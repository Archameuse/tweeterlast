import { eq } from "drizzle-orm"
import { users } from "~/db/schema"
import db from "~/server/utils/drizzle"

export default defineEventHandler(async event => {
    const user = readCookie(event)
    if(!user) throw createError({statusCode: 403, message: 'User is not logged in'})
    try {
        const resp:UserSettings = await db.query.users.findFirst({
            columns: {
                password: false,
            },
            where: eq(users.id, user.id)
        }) as UserSettings
        return resp
    } catch(e) {
        throw createError('Something went wrong')
    }
})