import { eq, sql } from "drizzle-orm"
import { users } from "~/db/schema"
import db from "~/server/utils/drizzle"

export default defineEventHandler(async event => {
    const {id} = getQuery(event)
    if(!Number(id)) throw createError('Invalid id')
    const user = readCookie(event)
    const isFollowed = user ? sql<boolean>`(select exists (select 1 from "follows" where ("follows"."follower_id" = ${user.id})))`.as('followed') : sql<boolean>`false`.as('followed')
    const countFollows = sql<number>`(select count("follows") from "follows" where ("follows"."follower_id" = "users"."id"))`.as('following')
    const countFollowers = sql<number>`(select count("follows") from "follows" where ("follows"."followed_id" = "users"."id"))`.as('followers')

    try {
        const user = await db.query.users.findFirst({
            columns: {
                email: false,
                password: false,
            },
            where: eq(users.id, Number(id)),
            extras: {
                followed: isFollowed,
                following: countFollows,
                followers: countFollowers,
            }
        }) as Profile
        return user
    } catch(e) {
        throw createError('Something went wrong')
    }
})