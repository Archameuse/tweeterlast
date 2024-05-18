import { and, eq } from "drizzle-orm"
import { follows } from "~/db/schema"
import db from "~/server/utils/drizzle"

export default defineEventHandler(async event => {
    const {id} = await readBody(event)
    const user = readCookie(event)
    if(!Number(id)) throw createError('Invalid id')
    if(!user) throw createError('User is not logged in')
    if(user.id==Number(id)) throw createError("You can't follow yourself")
    try {
        const resp = await db.delete(follows).where(and(
            eq(follows.followed_id, Number(id)),
            eq(follows.follower_id, user.id)
        ))
        if(!resp.rowCount) throw createError('No such save founded')
        return 'success'
    } catch(e) {
        throw createError('Something went wrong')
    }
})