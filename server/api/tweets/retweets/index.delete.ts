import { and, eq } from "drizzle-orm"
import { retweets } from "~/db/schema"
import db from "~/server/utils/drizzle"
import readCookie from "~/server/utils/readCookie"

export default defineEventHandler(async event => {
    const user = readCookie(event)
    const { tweet } = await readBody(event)
    if(!user) throw createError('You are not logged in')
    if(!Number(tweet)) throw createError('No tweet-id provided')
    try {
        const resp = await db.delete(retweets).where(and(eq(retweets.tweet_id, Number(tweet)),eq(retweets.user_id,user.id)))
        if(!resp.rowCount) throw createError('No such like founded')
        return 'success'
    } catch(e) {
        throw createError('Something went wrong')
    }
})