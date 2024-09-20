import Image from "next/image"
import { Button } from "./ui/button"
import Link from "next/link"
import { Progress } from "./ui/progress"
import { quests } from "@/constants"

type Props = {
    points: number,
}

export const Quests = (
    { points }
        : Props) => (
    <div className="border-2 rounded-xl p-4 space-y-4">
        <div className="flex items-center  justify-between">
            <h3 className="font-bold text-lg">
                Quests
            </h3>
            <Link href={"/quests"}>
                <Button
                    variant={"primaryOutline"}
                    size={"sm"}
                >
                    View all
                </Button>
            </Link>
        </div>
        <ul className="w-full">
            {quests.map((quest) => {
                const progress = (points / quest.value) * 100
                return (
                    <div
                        className="flex items-center w-full pb-5 gap-x-3"
                        key={quest.title}
                    >
                        <Image
                            src={"/points.svg"}
                            alt="Points"
                            height={40}
                            width={40} />

                        <div className="flex flex-col gap-y-2 w-full">
                            <p className="text-neutral-700 text-sm font-bold ">
                                {quest.title}
                            </p>
                            <Progress value={progress} className="h-2" />
                        </div>
                    </div>
                )

            })}
        </ul>
    </div>
)