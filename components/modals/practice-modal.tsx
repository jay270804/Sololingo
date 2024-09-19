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
import { usePracticeModal } from '@/store/use-practice-model';
import Image from 'next/image';

export const PracticeModal = () => {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false)
    const { isOpen, close } = usePracticeModal()

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
                            src={"/heart.svg"}
                            alt='Heart'
                            height={100}
                            width={100}
                        />
                    </div>
                    <DialogTitle className='text-center text-2xl font-bold'>
                        Practice lesson
                    </DialogTitle>
                    <DialogDescription className='text-center text-base'>
                        Use practice lessons to regain hearts and points. You cannot lose hearts or points in Practice lessons.
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
                            I understand!
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}