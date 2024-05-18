import { eq } from "drizzle-orm"
import jwt from "jsonwebtoken"
import { users } from "~/db/schema"
import db from "~/server/utils/drizzle"
import readCookie from "~/server/utils/readCookie"

export default defineEventHandler<Promise<User|null>>(async event => {
    const user = readCookie(event)
    if(!user) return null
    try {
        const updateUser = await db.query.users.findFirst({
            columns: {
                id: true,
                image: true,
                username: true
            },
            where: eq(users.id, user.id),
        }) as User
        return updateUser
    } catch(e) {
        throw createError('Unknown error')
    }
})