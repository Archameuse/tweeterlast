import { desc, eq, sql } from "drizzle-orm"
import { users } from "~/db/schema"
import db from "~/server/utils/drizzle"

export default defineEventHandler(async event => {
    const user = readCookie(event)
    const isFollowed = user ? sql<boolean>`(select exists (select 1 from "follows" where ("follows"."follower_id" = ${user.id})))`.as('followed') : sql<boolean>`false`.as('followed')
    const countFollows = sql<number>`(select count("follows")::int from "follows" where ("follows"."follower_id" = "users"."id"))`.as('following')
    const countFollowers = sql<number>`(select count("follows")::int from "follows" where ("follows"."followed_id" = "users"."id"))`.as('followers')

    try {
        const users = await db.query.users.findMany({
            columns: {
                email: false,
                password: false,
            },
            extras: {
                followed: isFollowed,
                following: countFollows,
                followers: countFollowers,
            },
            orderBy: desc(countFollowers)
        }) as Profile[]
        return users
    } catch(e) {
        throw createError('Something went wrong')
    }
})