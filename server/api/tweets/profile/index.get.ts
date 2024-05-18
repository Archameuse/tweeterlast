import { and, eq, isNotNull, ne, or, sql } from "drizzle-orm"
import { tweets } from "~/db/schema"
import db from "~/server/utils/drizzle"
import getTweets from "~/server/utils/getTweets"

export default defineEventHandler(async event => {
    const {id, type, page}:{id:string,type:string, page:string} = getQuery(event)
    if(!Number(id)) throw createError('Invalid id')
    const user = readCookie(event)

    const posts = getTweets(Number(page)||1,'profile',user,type,undefined,Number(id))
    return posts
})