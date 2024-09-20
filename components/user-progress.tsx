import Link from "next/link"
import { Button } from "./ui/button"
import Image from "next/image"
import { InfinityIcon } from "lucide-react"
import { courses, userProgress } from "@/db/schema"

type Props = {
    activeCourse: typeof courses.$inferSelect,
    hearts: number,
    points: number,
    hasActiveSubscription: boolean | undefined,
}

export const UserProgress = ({
    activeCourse,
    hearts,
    points,
    hasActiveSubscription
}: Props) => {
    return (
        <div className="flex items-center justify-between gap-x-2 w-full">
            <Link href={"/courses"}>
                <Button variant={"ghost"}>
                    <Image
                        src={activeCourse.imgSrc}
                        alt={activeCourse.title}
                        className="rounded-md border"
                        width={32}
                        height={32}
                    />
                </Button>
            </Link>
            <Link href="/shop">
                <Button variant={"ghost"} className="text-orange-500 ">
                    <Image src={"/points.svg"} className="mr-2" alt="Points" height={28} width={28} />
                    {points}
                </Button>
            </Link>
            <Link href="/shop">
                <Button variant={"ghost"} className="text-orange-500 ">
                    <Image src={"/heart.svg"} className="mr-2" alt="Hearts" height={28} width={28} />
                    {hasActiveSubscription ? <InfinityIcon className="h-4 w-4 stroke-[3]"/> : hearts}
                </Button>
            </Link>
        </div>
    )
}