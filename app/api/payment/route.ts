// app/api/payment/route.ts
import Razorpay from 'razorpay';
import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';

export async function POST(req: Request) {
  const { amount } = await req.json(); // Extract amount from request body

  // Initialize Razorpay instance
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY!,
    key_secret: process.env.RAZORPAY_SECRET!,
  });

  const options = {
    amount: amount * 100, // Amount is in smallest currency unit (paise for INR)
    currency: 'INR',
    receipt: nanoid(),
  };

  try {
    const order = await razorpay.orders.create(options);
    return NextResponse.json({ orderId: order.id });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.error();
  }
}
