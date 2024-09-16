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
import { useExitModal } from '@/store/use-exit-model'
import Image from 'next/image';

export const ExitModal = () => {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false)
    const { isOpen, close } = useExitModal()

    useEffect(() => setIsClient(true), []);

    if (!isClient) {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={close}>
            <DialogContent className='max-w-md'>
                <DialogHeader>
                    <div className="flex items-center justify-center w-full mb-5">
                        <Image
                            src={"/mascot_sad.svg"}
                            alt='mascot_sad'
                            height={80}
                            width={80}
                        />
                    </div>
                    <DialogTitle className='text-center text-2xl font-bold'>
                        Wait, Don&apos;t go!
                    </DialogTitle>
                    <DialogDescription className='text-center text-base'>
                        You&apos;re about to leave the lesson. Are you sure?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <div className="flex flex-col gap-y-4 w-full">
                    <Button
                        className='w-full'
                        variant={"primary"}
                        size={'lg'}
                        onClick={close}
                    >
                        Keep learning!
                    </Button>
                    <Button
                        className='w-full'
                        variant={"dangerOutline"}
                        size={'lg'}
                        onClick={()=>{
                            close();
                            router.push("/learn")
                        }}
                    >
                        End lesson
                    </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}