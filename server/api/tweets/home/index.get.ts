import { and, desc, eq, isNotNull, ne, or, sql } from "drizzle-orm"
import { tweets } from "~/db/schema"
import db from "~/server/utils/drizzle"
import getTweets from "~/server/utils/getTweets"

export default defineEventHandler(async event => {
    const user = readCookie(event)
    const {page} = getQuery(event)
    if(!user) throw createError('No user provided')

    const posts = await getTweets(Number(page)||1,'home',user)
    return posts
})