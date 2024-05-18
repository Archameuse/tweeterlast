import { count, desc, isNotNull, sql } from "drizzle-orm"
import { tweets } from "~/db/schema"
import db from "~/server/utils/drizzle"

export default defineEventHandler(async () => {
    const resp = await db.select({
        name: tweets.hashtag,
        tweets: count(sql`*`)
    }).from(tweets).groupBy(tweets.hashtag).where(isNotNull(tweets.hashtag)).orderBy(desc(count(sql`*`))).limit(5) as Trend[]
    return resp
})  