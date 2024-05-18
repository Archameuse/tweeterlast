import { eq, sql } from "drizzle-orm"
import { users } from "~/db/schema"
import db from "~/server/utils/drizzle"

export default defineEventHandler(async (event) => {
    const {id} = getQuery(event)
    if(!Number(id)) throw createError('Invalid id')
    try {
        const resp = await db.select({
            exists: sql<boolean>`true`
        }).from(users).where(eq(users.id, Number(id))).limit(1).then((value) => !!value.length)
        return resp
    } catch(e) {
        throw createError({message: 'Something went wrong'})
    }
})