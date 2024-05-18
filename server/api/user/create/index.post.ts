import { eq, exists, sql } from "drizzle-orm"
import { users } from "~/db/schema"
import db from "~/server/utils/drizzle"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import pushCookie from "~/server/utils/pushCookie"

export default defineEventHandler(async (event) => {
    const salt = bcrypt.genSaltSync(10)
    const {login, password, name} = await readBody(event)
    if(typeof login !== 'string') throw createError({message: 'No login provided'})
    if(typeof password !== 'string') throw createError({message: 'No password provided'})
    if(typeof name !== 'string') throw createError({message: 'No username provided'})
    const user = await db.select({
        exists: sql<number>`1`
    }).from(users).where(eq(users.email, login)).then(data => !!data.length)

    if(user) throw createError({message: 'User already exists', statusCode: 406})
    try {
        const resp = await db.insert(users).values({
            email: login,
            password: bcrypt.hashSync(password,salt),
            username: name
        })
        return await pushCookie(event,login)
    } catch(e) {
        throw createError({message: 'Something went wrong with creating user'})
    }
})