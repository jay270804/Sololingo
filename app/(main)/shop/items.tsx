'use client'

import {  refillHearts } from "@/actions/user-progress";
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useState, useTransition } from "react";
import { toast } from "sonner";

const POINTS_TO_REFILL = 10;

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

    const [pending, startTransition] = useTransition();

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

    const [loading, setLoading] = useState(false);

    const handleSubscribe = async () => {
        setLoading(true);

        // Call the backend to create a Razorpay order
        const response = await fetch('/api/payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount: 269 }), // Example amount in INR
        });

        const { orderId } = await response.json();

        // Initialize Razorpay payment options
        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Use NEXT_PUBLIC_ for frontend env variables
            amount: 26900, // Amount in paise
            currency: 'INR',
            name: 'Sololingo',
            description: 'Subscribe to premium',
            order_id: orderId,
            handler: async function (response: any) {
                alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
                // Handle payment success here
            },
            prefill: {
                name: 'John Doe',
                email: 'john.doe@example.com',
                contact: '9999999999',
            },
            theme: {
                color: '#F37254',
            },
        };

        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
        setLoading(false);
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
                    disabled={loading || pending || hasActiveSubscription}  //TODO:remove loading later
                >
                    {hasActiveSubscription ? "active" : "upgrade"}
                </Button>
            </div>
        </ul>
    )
}