import { and, desc, eq, sql } from "drizzle-orm"
import db from "~/server/utils/drizzle"

export default defineEventHandler(async event => {
    const user = readCookie(event)
    const {id, page}:{id:string, page:string} = getQuery(event)
    const isFollowed = user ? sql<boolean>`(select exists (select 1 from "follows" where ("follows"."follower_id" = ${user.id})))`.as('followed') : sql<boolean>`false`.as('followed')
    const countFollows = sql<number>`(select count("follows")::int from "follows" where ("follows"."follower_id" = "users"."id"))`.as('following')
    const countFollowers = sql<number>`(select count("follows")::int from "follows" where ("follows"."followed_id" = "users"."id"))`.as('followers')
    
    try {
        const limit = Number(page) ? Number(page)*10 : 10
        if(!Number(id)) throw createError('Invalid id')
        const profiles = await db.query.users.findMany({
            columns: {
                email: false,
                password: false,
            },
            extras: {
                followed: isFollowed,
                following: countFollows,
                followers: countFollowers,
            },
            limit,
            where: sql<boolean>`(select exists (select 1 from "follows" where "follows"."followed_id" = ${id} and "follows"."follower_id" = "users"."id"))`
        }) as Profile[]
        return profiles
    } catch(e) {
        throw createError('Something went wrong')
    }
})