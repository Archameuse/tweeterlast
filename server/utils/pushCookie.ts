import type {H3Event} from 'h3'
import { eq, exists, sql } from "drizzle-orm"
import { users } from "~/db/schema"
import db from "~/server/utils/drizzle"
import jwt from 'jsonwebtoken'

export default async (event:H3Event, login:string) => {
    const user = await db.select({
        id: users.id,
        username: users.username,
        image: users.image
    }).from(users)
        .where(eq(users.email, login)).limit(1).then((user)=>user[0]) as User


    const token = jwt.sign(user, process.env.SECRET_KEY, {expiresIn: '1h'})
    return setCookie(event, process.env.COOKIE_NAME, token, {
        httpOnly: true
    })
}