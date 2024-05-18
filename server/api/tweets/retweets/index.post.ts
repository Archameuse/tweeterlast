import { retweets } from "~/db/schema"
import db from "~/server/utils/drizzle"
import readCookie from "~/server/utils/readCookie"

export default defineEventHandler(async event => {
    const user = readCookie(event)
    const { tweet } = await readBody(event)
    if(!user) throw createError('You are not logged in')
    if(!Number(tweet)) throw createError('No tweet-id provided')
    try {
        const resp = await db.insert(retweets).values({
            tweet_id: Number(tweet),
            user_id: user.id,
            date: new Date()
        })
        return 'success'
    } catch(e) {
        throw createError('Something went wrong')
    }
})