'use client'

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useHeartsModal } from '@/store/use-hearts-model';
import Image from 'next/image';

export const HeartsModal = () => {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false)
    const { isOpen, close } = useHeartsModal()

    useEffect(() => setIsClient(true), []);

    const onClick = () => {
        close();
        router.push('/store');
    }

    if (!isClient) {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={close}>
            <DialogContent className='max-w-md'>
                <DialogHeader>
                    <div className="flex items-center justify-center w-full mb-5">
                        <Image
                            src={"/mascot_bad.svg"}
                            alt='mascot_bad'
                            height={80}
                            width={80}
                        />
                    </div>
                    <DialogTitle className='text-center text-2xl font-bold'>
                        You ran out of hearts!
                    </DialogTitle>
                    <DialogDescription className='text-center text-base'>
                        Get Pro for unlimited hearts, or purchase them in the store.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <div className="flex flex-col gap-y-4 w-full">
                        <Button
                            className='w-full'
                            variant={"primary"}
                            size={'lg'}
                            onClick={onClick}
                        >
                            Get unlimited hearts
                        </Button>
                        <Button
                            className='w-full'
                            variant={"primaryOutline"}
                            size={'lg'}
                            onClick={close}
                        >
                            No thanks!
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}