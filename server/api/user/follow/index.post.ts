import { follows } from "~/db/schema"
import db from "~/server/utils/drizzle"

export default defineEventHandler(async event => {
    const {id} = await readBody(event)
    const user = readCookie(event)
    if(!Number(id)) throw createError('Invalid id')
    if(!user) throw createError('User is not logged in')
    if(user.id==Number(id)) throw createError("You can't follow yourself")
    try {
        const resp = await db.insert(follows).values({
            followed_id: Number(id),
            follower_id: user.id
        })
        return 'success'
    } catch(e) {
        throw createError('Something went wrong')
    }
})