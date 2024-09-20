'use client'

import {  refillHearts } from "@/actions/user-progress";
import { Button } from "@/components/ui/button"
import { POINTS_TO_REFILL } from "@/constants";
import Image from "next/image"
import { useRouter } from "next/navigation";
import {  useTransition } from "react";
import { toast } from "sonner";


type Props = {
    hearts: number,
    points: number,
    hasActiveSubscription: boolean,
}

export const Items = ({
    hearts,
    points,
    hasActiveSubscription
}: Props) => {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    // const user=await currentUser;
    const onRefillHearts = () => {
        if (pending || hearts === 5 || points < POINTS_TO_REFILL) {
            return;
        }

        startTransition(() => {
            refillHearts().catch(() => toast.error("Something went wrong."))
        })
    }

    const onUpgrade = () => {
        startTransition(() => {
            handleSubscribe().catch((err) => toast.error(err))
        })
    }

    const handleSubscribe = async () => {
  
      const planId = 'plan_OzEomYPi7EXmww'; // Replace with your Razorpay Plan ID
    //   const razorPayPriceId = 'price_XXXXXXXX'; // Replace with Razorpay Price ID
  
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId}),
      });
  
      const data = await response.json();
  
      if (data.success) {
        // Initialize Razorpay payment options
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
          subscription_id: data.subscriptionId,
          name: 'Sololingo',
          description: 'Get unlimited hearts with super sololingo.',
          handler: async function (response: any) {
            alert('Payment successful!');
            router.refresh(); // Reload the same page
          },
          prefill: {
            name: "Jay Patel",
            email: "jaypatel270804@gmail.com",
            contact: "9999999999",
          },
          theme: {
            color: '#F37254',
          },
        };
  
        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
      } else {
        alert('Error in creating subscription.');
      }
  
    };
  
    return (
        <ul className="w-full">
            <div className="flex items-center w-full p-4 border-t-2 gap-x-4">
                <Image
                    src={"/heart.svg"}
                    alt="heart"
                    height={60}
                    width={60}
                />
                <div className="flex-1 ">
                    <p className="text-base text-neutral-700 lg:text-xl font-bold">
                        Refill hearts
                    </p>
                </div>
                <Button
                    disabled={pending || hearts === 5 || points < POINTS_TO_REFILL}
                    onClick={onRefillHearts}
                >
                    {hearts === 5 ? "full" : (
                        <div className="flex items-center">
                            <Image
                                src={"/points.svg"}
                                alt="points"
                                height={20}
                                width={20}
                            />
                            <p>
                                {POINTS_TO_REFILL}
                            </p>
                        </div>
                    )}

                </Button>
            </div>
            <div className="flex items-center w-full p-4 pt-8 gap-x-4 border-t-2">
                <Image
                    src={"/unlimited.svg"}
                    alt={"unlimited"}
                    height={60}
                    width={60}
                />
                <div className="flex-1">
                    <p className="text-base text-neutral-700 lg:text-xl font-bold">
                        Unlimited hearts
                    </p>
                </div>
                <Button
                    onClick={onUpgrade}
                    disabled={ pending }  
                >
                    {hasActiveSubscription ? "settings" : "upgrade"}
                </Button>
            </div>
        </ul>
    )
}