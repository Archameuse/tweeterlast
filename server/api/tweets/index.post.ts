import { replies, tweets } from "~/db/schema"
import db from "~/server/utils/drizzle"

export default defineEventHandler(async event => {
    const { message, everyone, hash, image, replyId } = await readBody(event)
    if(!message) throw createError('No message received')
    const user = readCookie(event)
    if(!user) throw createError('You are not logged in')
    try {
        const resp = await db.insert(tweets).values({
            date: new Date(),
            senderID: user.id,
            content: message,
            hashtag: hash,
            onlyFollowers: !everyone,
            image: image
        }).returning({id:tweets.id}).then(res => res[0])
        if(Number(replyId)) {
            if(!resp.id) throw createError('No id returned')
            await db.insert(replies).values({
                reply_to: Number(replyId),
                reply_with: resp.id
            })
        }
        return 'success'
    } catch(e) {
        throw createError('Something went wrong')
    }
})