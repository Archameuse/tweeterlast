import { eq } from "drizzle-orm"
import { users } from "~/db/schema"
import db from "~/server/utils/drizzle"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import pushCookie from "~/server/utils/pushCookie"

export default defineEventHandler(async (event) => {
    const {login, password} = await readBody(event)
    if(typeof login !== 'string') throw createError({message: 'No login provided'})
    if(typeof password !== 'string') throw createError({message: 'No password provided'})
    const user = await db.select({password: users.password}).from(users)
        .where(eq(users.email, login)).limit(1).then((user)=>user[0])
    if(!user) throw createError({message: 'No user found', statusCode: 404})
    if(!(bcrypt.compareSync(password, user.password))) throw createError({message: 'Wrong password', statusCode: 403})
    return await pushCookie(event,login)
})