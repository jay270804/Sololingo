import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { Header } from "./header";
import { UserProgress } from "@/components/user-progress";

const LearnPage=()=>{
    return(
        <div className="flex flex-row-reverse gap-[48px] px-6 ">
            <StickyWrapper>
                <UserProgress 
                    activeCourse={{title:"Japanese", imageSrc:"/jp.svg"}}
                    hearts={5}
                    points={100}
                    hasActiveSubscription={false}
                />
            </StickyWrapper>
            <FeedWrapper>
                <Header title="Japanese"/>
            </FeedWrapper>
        </div>
    )
}

export default LearnPage;