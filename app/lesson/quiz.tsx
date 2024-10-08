'use client'

import Confetti from "react-confetti"
import { useRouter } from "next/navigation"
import { challengeOptions, challenges, userSubscription } from "@/db/schema"
import { useState, useTransition } from "react"
import { Header } from "./header"
import { QuestionBubble } from "./question-bubble"
import { Challenge } from "./challenge"
import { Footer } from "./footer"
import { upsertChallengeProgress } from "@/actions/challenge-progress"
import { toast } from "sonner"
import { reduceHearts } from "@/actions/user-progress"
import { useAudio, useWindowSize, useMount } from "react-use"
import Image from "next/image"
import { ResultCard } from "./result-card"
import { useHeartsModal } from "@/store/use-hearts-model"
import { usePracticeModal } from "@/store/use-practice-model"


type Props = {
    initialPercentage: number,
    initialHearts: number,
    initialLessonId: number,
    initialLessonChallenges: (typeof challenges.$inferSelect & {
        completed: boolean,
        challengeOptions: typeof challengeOptions.$inferSelect[]
    })[],
    userSubscription: typeof userSubscription.$inferSelect & {
        isActive: boolean
    } | null, //TODO: Replace with Subscription DB type 
}

export const Quiz = ({
    initialPercentage,
    initialLessonChallenges,
    initialHearts,
    initialLessonId,
    userSubscription
}: Props) => {
    const { open: openHeartsModal } = useHeartsModal();
    const { open: openPracticeModal } = usePracticeModal()

    useMount(() => {
        if (initialPercentage === 100) {
            openPracticeModal()
        }
    })

    const router = useRouter();
    const { width, height } = useWindowSize()

    const [
        correctAudio,
        _c,
        correctControls,
    ] = useAudio({ src: "/correct.wav" })
    const [
        incorrectAudio,
        _i,
        incorrectControls,
    ] = useAudio({ src: "/incorrect.wav" })
    const [
        finishAudio
    ] = useAudio({ src: "/finish.mp3", autoPlay: true })

    const [lessonId] = useState(initialLessonId)
    const [isPending, startTransition] = useTransition()
    const [hearts, setHearts] = useState(initialHearts)
    const [percentage, setPercentage] = useState(() => {
        return initialPercentage === 100 ? 0 : initialPercentage;
    })
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
                            openHeartsModal()
                            return;
                        }

                        correctControls.play()
                        setStatus("correct");
                        setPercentage((prev) => prev + 100 / challenges.length);

                        if (initialPercentage === 100) {
                            setHearts((prev) => Math.min(prev + 1, 5))
                        }
                    })
                    .catch((err) => toast.error("Something went wrong! Please try again."))
            })
        } else {
            startTransition(() => {
                reduceHearts(currentChallenge.id)
                    .then((response) => {
                        if (response?.error === 'hearts') {
                            openHeartsModal();
                            return;
                        }

                        incorrectControls.play()
                        setStatus("wrong")

                        if (!response?.error) {
                            setHearts((prev) => Math.max(prev - 1, 0))
                        }
                    })
                    .catch(() => toast.error("Something went wrong. Please try again."))
            })
        }
    }
    //TODO: Remove true 
    if (!currentChallenge) {
        return (
            <>
                {finishAudio}
                <Confetti
                    width={width}
                    height={height}
                    recycle={false}
                    numberOfPieces={700}
                    tweenDuration={10000}
                />
                <div className="flex flex-col gap-y-4 lg:gap-y-8 max-w-lg mx-auto text-center items-center justify-center h-full">
                    <Image
                        src={"/finish.svg"}
                        alt="finish"
                        className="hidden lg:block"
                        height={100}
                        width={100}
                    />
                    <Image
                        src={"/finish.svg"}
                        alt="finish"
                        className="block lg:hidden"
                        height={50}
                        width={50}
                    />
                    <h1 className="text-xl lg:text-3xl font-bold text-neutral-700">
                        Great Job! <br /> You&apos;ve completed the lesson.
                    </h1>
                    <div className="flex items-center gap-x-4 w-full">
                        <ResultCard
                            variant="points"
                            value={challenges.length * 10}
                        />
                        <ResultCard
                            variant="hearts"
                            value={hearts}
                        />
                    </div>
                </div>
                <Footer
                    lessonId={lessonId}
                    status="completed"
                    onCheck={() => router.push("/learn")}
                />
            </>
        )
    }

    const title = currentChallenge.type === 'SELECT' ? currentChallenge.question : "Select the Correct meaning.";

    return (
        <>
            {correctAudio}
            {incorrectAudio}
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
                                disabled={isPending}
                                type={currentChallenge.type}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Footer
                disabled={isPending || !selectedOption}
                status={status}
                onCheck={onContinue}
            />
        </>
    )
}