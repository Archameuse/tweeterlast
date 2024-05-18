import { eq } from "drizzle-orm"
import { users } from "~/db/schema"
import db from "~/server/utils/drizzle"

export default defineEventHandler(async event => {
    const user = readCookie(event)
    if(!user) throw createError({statusCode: 403, message: 'User is not logged in'})
    let {avatar,banner,name,status} = await readBody(event)
    if(typeof avatar !== 'string') throw createError({statusCode: 400, message: 'Avatar is not a string'})
    if(typeof banner !== 'string') throw createError({statusCode: 400, message: 'Banner is not a string'})
    if(typeof name !== 'string') throw createError({statusCode: 400, message: 'Username is not a string'})
    if(typeof status !== 'string') status = ''
    try {
        const resp = await db.update(users).set({
            username: name,
            image: avatar,
            banner,
            status,
        }).where(eq(users.id,user.id))
        return 'success'
    } catch(e) {
        throw createError('Something went wrong')
    }
})