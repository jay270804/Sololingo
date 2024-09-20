import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import db from '@/db/drizzle';
import { userSubscription } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth, currentUser } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  const { planId } = await req.json(); 
  const user = await currentUser();
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
  }

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 401 });;
  }
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY!,
    key_secret: process.env.RAZORPAY_SECRET!,
  });

  try {

    let existingSubscription = await db.query.userSubscription.findFirst({
      where: eq(userSubscription.userId, userId),
    });

    let razorPayCustomerId = existingSubscription?.razorPayCustomerId;

    if (!razorPayCustomerId) {

      const customers = await razorpay.customers.all();

      const email = user.primaryEmailAddress?.emailAddress;

      const existingCustomer = customers.items.find(
        (customer: any) => customer.email === email
      );

      if (existingCustomer) {
        razorPayCustomerId = existingCustomer.id;

      }
      else {
        // If customer doesn't exist, create a new one
        const customer = await razorpay.customers.create({
          name: user.username!, // Optionally pull user name from Clerk
          email, // Email from Clerk
          contact: '9999999999', // Example contact number
        });

        razorPayCustomerId = customer.id;
      }
    }

    const date=new Date()
    // Step 3: Create a subscription in Razorpay
    const subscription = await razorpay.subscriptions.create({
      plan_id: planId, // Razorpay Plan ID
      customer_notify: 1,
      total_count: null!, // Example: 12 months subscription
    });

    const subscriptionData = {
      userId,
      razorPayCustomerId,
      razorPaySubscriptionId: subscription.id,
      razorPayCurrentPeriodEnd: new Date(subscription.current_end! * 1000),
    };

    // Step 4: Insert or update the subscription record in the database
    if (existingSubscription) {
      // Update existing subscription
      await db
        .update(userSubscription)
        .set(subscriptionData)
        .where(eq(userSubscription.userId, userId));
    } else {
      // Insert new subscription
      await db.insert(userSubscription).values(subscriptionData);
    }

    return NextResponse.json({ success: true, subscriptionId: subscription.id });
  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json({ error: 'Error creating subscription' }, { status: 500 });
  }
}
