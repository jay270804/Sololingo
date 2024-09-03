import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { SidebarContent } from "./sidebar-content"
import { ClerkLoaded, ClerkLoading, UserButton } from "@clerk/nextjs"
import { Loader } from "lucide-react"

type Props = {
    className?: string,
}

export const Sidebar = ({ className }: Props) => {
    return (
        <div className={cn("lg:w-[256px] lg:fixed h-full flex flex-col border-r-2 px-4 left-0 top-0", className)}>
            <Link href="/learn">
                <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
                    <Image src={"/mascot.svg"} height={40} width={40} alt="Mascot" />
                    <h1 className="text-green-600 tracking-wide font-extrabold text-2xl">Sololingo</h1>
                </div>
            </Link>
            <div className="flex flex-col gap-y-2 flex-1">
                <SidebarContent label="Learn" href="/learn" iconSrc="/learn.svg"/>
                <SidebarContent label="Leaderboard" href="/leaderboard" iconSrc="/leaderboard.svg"/>
                <SidebarContent label="Quests" href="/quests" iconSrc="/quests.svg"/>
                <SidebarContent label="Shop" href="/shop" iconSrc="/shop.svg"/>
                <SidebarContent label="Lang Coach" href="/coach" iconSrc="/chatbot.png"/>
            </div>
            <div className="p-4">
                <ClerkLoading>
                    <Loader className="h-5 w-5 animate-spin text-muted-foreground"/>
                </ClerkLoading>
                <ClerkLoaded>
                    <UserButton afterSwitchSessionUrl="/"/>
                </ClerkLoaded>
            </div>
        </div>
    )
}