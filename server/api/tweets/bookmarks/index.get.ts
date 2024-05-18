import { desc, eq, isNotNull, ne, and, sql, count, getTableColumns, ConsoleLogWriter } from "drizzle-orm"
import { integer } from "drizzle-orm/pg-core"
import { likes, saves, tweets, users } from "~/db/schema"
import db from "~/server/utils/drizzle"
import getTweets from "~/server/utils/getTweets"
import readCookie from "~/server/utils/readCookie"

export default defineEventHandler(async (event) => {
    try {
        const { type, page }:{type:string, page:string} = getQuery(event)
        const user = readCookie(event)
        if(!user) throw createError('No user')

        const posts = await getTweets(Number(page)||1,'bookmarks',user, type)
        return posts
    } catch(e) {
        throw createError('error')
    }
})
