'use client'

import { challengeOptions, challenges } from "@/db/schema"
import { useState } from "react"
import { Header } from "./header"
import { QuestionBubble } from "./question-bubble"
import { Challenge } from "./challenge"

type Props = {
    initialPercentage: number,
    initialHearts: number,
    initialLessonId: number,
    initialLessonChallenges: (typeof challenges.$inferSelect & {
        completed: boolean,
        challengeOptions: typeof challengeOptions.$inferSelect[]
    })[],
    userSubscription: any, //TODO: Replace with Subscription DB type 
}

export const Quiz = ({
    initialPercentage,
    initialLessonChallenges,
    initialHearts,
    initialLessonId,
    userSubscription
}: Props) => {
    const [hearts, setHearts] = useState(initialHearts)
    const [percentage, setPercentage] = useState(initialPercentage)
    const [challenges] = useState(initialLessonChallenges)
    const [activeIndex, setActiveIndex] = useState(() => {
        const uncompletedIndex = challenges.findIndex((challenge) => !challenge.completed)
        return uncompletedIndex === -1 ? 0 : uncompletedIndex;
    })

    const currentChallenge = challenges[activeIndex]
    const options = currentChallenge?.challengeOptions ?? [];

    const title = currentChallenge.type === 'SELECT' ? currentChallenge.question : "Select the Correct meaning.";
    return (
        <>
            <Header
                hearts={hearts}
                percentage={percentage}
                hasActiveSubscription={!!userSubscription?.isActive}
            />
            <div className="flex-1">
                <div className="h-full flex justify-center items-center">
                    <div className="lg:min-h-[350px] lg:w-[600px] w-full px-6 lg:px-0 flex flex-col gap-y-12">
                        <h1 className="text-lg lg:text-3xl text-center lg:text-start font-bold text-neutral-700">
                            {title}
                        </h1>
                        <div className="">
                            {currentChallenge.type === "ASSIST" && (
                                <QuestionBubble question={currentChallenge.question} />)
                            }
                            <Challenge
                                options={options}
                                onSelect={()=>{}}
                                status="none"
                                selectedOption={undefined}
                                disabled={false}
                                type={currentChallenge.type}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}