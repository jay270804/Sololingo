'use client'

import { challengeOptions, challenges } from "@/db/schema"
import { useState, useTransition } from "react"
import { Header } from "./header"
import { QuestionBubble } from "./question-bubble"
import { Challenge } from "./challenge"
import { Footer } from "./footer"
import { upsertChallengeProgress } from "@/actions/challenge-progress"
import { toast } from "sonner"

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
    const [isPending, startTransition] = useTransition()
    const [hearts, setHearts] = useState(initialHearts)
    const [percentage, setPercentage] = useState(initialPercentage)
    const [challenges] = useState(initialLessonChallenges)
    const [activeIndex, setActiveIndex] = useState(() => {
        const uncompletedIndex = challenges.findIndex((challenge) => !challenge.completed)
        return uncompletedIndex === -1 ? 0 : uncompletedIndex;
    })

    const [selectedOption, setSelectedOption] = useState<number>();
    const [status, setStatus] = useState<"correct" | "wrong" | "none">("none");

    const currentChallenge = challenges[activeIndex]
    const options = currentChallenge?.challengeOptions ?? [];

    const onNext = () => {
        setActiveIndex((currentIndex) => currentIndex + 1)
    }

    const onSelect = (id: number) => {
        if (status !== "none") return;

        setSelectedOption(id);
    }

    const onContinue = () => {
        if (!selectedOption) return;

        if (status === "wrong") {
            setStatus("none")
            setSelectedOption(undefined)
            return;
        }
        if (status === "correct") {
            onNext()
            setStatus("none")
            setSelectedOption(undefined)
            return;
        }

        const correctOption = options.find((option) => option.correct)

        if (!correctOption) {
            return;
        }

        if (correctOption && correctOption.id === selectedOption) {
            startTransition(() => {
                upsertChallengeProgress(currentChallenge.id)
                    .then((response) => {
                        if (response?.error === 'hearts') {
                            console.error("Missing hearts");
                            return;
                        }

                        setStatus("correct");
                        setPercentage((prev) => prev + 100 / challenges.length);

                        if (initialPercentage === 100) {
                            setHearts((prev) => Math.min(prev + 1, 5))
                        }
                    })
                    .catch((err)=>toast.error("Something went wrong! Please try again."))
            })
        } else {
            console.error("incorrect option")
        }
    }

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
                                onSelect={onSelect}
                                status={status}
                                selectedOption={selectedOption}
                                disabled={false}
                                type={currentChallenge.type}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Footer
                disabled={!selectedOption}
                status={status}
                onCheck={onContinue}
            />
        </>
    )
}