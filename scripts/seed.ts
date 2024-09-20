import "dotenv/config"
import { drizzle } from "drizzle-orm/neon-http"
import { neon } from "@neondatabase/serverless"
import * as schema from "../db/schema"

const sql = neon(process.env.DATABASE_URL!)

const db = drizzle(sql, { schema })

const main = async () => {
    try {
        console.log("Seeding database")

        await db.delete(schema.courses)
        await db.delete(schema.userProgress)
        await db.delete(schema.units)
        await db.delete(schema.lessons)
        await db.delete(schema.challenges)
        await db.delete(schema.challengeOptions)
        await db.delete(schema.challengeProgress)
        await db.delete(schema.userSubscription)

        await db.insert(schema.courses).values([
            {
                id: 1,
                title: "Hindi",
                imgSrc: "/in.svg",
            },
            {
                id: 2,
                title: "Spanish",
                imgSrc: "/es.svg",
            },
            {
                id: 3,
                title: "Japanese",
                imgSrc: "/jp.svg",
            },
            {
                id: 4,
                title: "French",
                imgSrc: "/fr.svg",
            },
            {
                id: 5,
                title: "Italian",
                imgSrc: "/it.svg"
            }
        ])

        await db.insert(schema.units).values([
            {
                id: 1,
                courseId: 1,
                title: "Unit 1",
                description: "Learn the basics of Hindi",
                order: 1,
            },
            {
                id: 2,
                courseId: 1,
                title: "Unit 2",
                description: "Learn the advance Hindi",
                order: 2,
            }
        ])

        await db.insert(schema.lessons).values([
            {
                id: 1,
                unitId: 1,
                order: 1,
                title: 'Nouns'
            },
            {
                id: 2,
                unitId: 1,
                order: 2,
                title: 'Verbs'
            },
            {
                id: 3,
                unitId: 1,
                order: 3,
                title: 'Adjectives'
            },
            {
                id: 4,
                unitId: 1,
                order: 4,
                title: 'Articles'
            },
            {
                id: 5,
                unitId: 1,
                order: 5,
                title: 'Tense'
            },
        ])
        await db.insert(schema.lessons).values([
            {
                id: 6,
                unitId: 2,
                order: 1,
                title: 'Nouns'
            },
            {
                id: 7,
                unitId: 2,
                order: 2,
                title: 'Verbs'
            },
            {
                id: 8,
                unitId: 2,
                order: 3,
                title: 'Adjectives'
            },
            {
                id: 9,
                unitId: 2,
                order: 4,
                title: 'Articles'
            },
            {
                id: 10,
                unitId: 2,
                order: 5,
                title: 'Tense'
            },
        ])

        await db.insert(schema.challenges).values([
            {
                id: 1,  // Nouns
                lessonId: 1,
                type: "SELECT",
                order: 1,
                question: 'Which one of these is "The Man"?',
            },
            {
                id: 2,  // Nouns
                lessonId: 1,
                type: "ASSIST",
                order: 2,
                question: '"The Doctor"',
            },
            {
                id: 3,  // Nouns
                lessonId: 1,
                type: "SELECT",
                order: 3,
                question: 'Which one of these is "The Woman"',
            },
        ])

        await db.insert(schema.challengeOptions).values([
            {
                challengeId: 1,
                imgSrc: "/man.png",
                correct: true,
                text: "आदमी",
                audioSrc: "/hin_man.mp3",
            },
            {
                challengeId: 1,
                imgSrc: "/woman.png",
                correct: false,
                text: "महिला",
                audioSrc: "/hin_woman.mp3",
            },
            {
                challengeId: 1,
                imgSrc: "/doctor.png",
                correct: false,
                text: "चिकित्सक",
                audioSrc: "/hin_doctor.mp3",
            },
        ])

        await db.insert(schema.challengeOptions).values([
            {
                challengeId: 2,
                correct: false,
                text: "आदमी",
                audioSrc: "/hin_man.mp3",
            },
            {
                challengeId: 2,
                correct: false,
                text: "महिला",
                audioSrc: "/hin_woman.mp3",
            },
            {
                challengeId: 2,
                correct: true,
                text: "चिकित्सक",
                audioSrc: "/hin_doctor.mp3",
            },
        ])

        await db.insert(schema.challengeOptions).values([
            {
                challengeId: 3,
                imgSrc: "/man.png",
                correct: false,
                text: "आदमी",
                audioSrc: "/hin_man.mp3",
            },
            {
                challengeId: 3,
                imgSrc: "/woman.png",
                correct: true,
                text: "महिला",
                audioSrc: "/hin_woman.mp3",
            },
            {
                challengeId: 3,
                imgSrc: "/doctor.png",
                correct: false,
                text: "चिकित्सक",
                audioSrc: "/hin_doctor.mp3",
            },
        ])

        await db.insert(schema.challenges).values([
            {
                id: 4,  //verbs
                lessonId: 2,
                type: "SELECT",
                order: 1,
                question: 'Which one of these is "The Man"?',
            },
            {
                id: 5,  //verbs
                lessonId: 2,
                type: "ASSIST",
                order: 2,
                question: '"The Doctor"',
            },
            {
                id: 6,  //verbs
                lessonId: 2,
                type: "SELECT",
                order: 3,
                question: 'Which one of these is "The Woman"',
            },

        ])


        console.log("Seeding finished")
    } catch (error) {
        console.error(error)
        throw new Error("Failed to seed the database")
    }
}

main();