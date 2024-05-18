import { desc, eq, isNotNull, ne, and, sql, count, getTableColumns, ilike } from "drizzle-orm"
import { integer, union, unionAll } from "drizzle-orm/pg-core"
import { likes, replies, retweets, tweets, users } from "~/db/schema"
import db from "~/server/utils/drizzle"
import getTweets from "~/server/utils/getTweets"
import readCookie from "~/server/utils/readCookie"

export default defineEventHandler(async (event) => {
    try {
        const { type, search, page }:{type:string,search:string,page:string} = getQuery(event)
        const user = readCookie(event)
        const posts = await getTweets(Number(page)||1,'explore',user,type,search)
        return posts
    } catch(e) {
        console.log(e)
        throw createError('error')
    }
})
