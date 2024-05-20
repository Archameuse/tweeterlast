import { and, eq } from "drizzle-orm"
import { follows, replies, tweets, users } from "~/db/schema"
import db from "~/server/utils/drizzle"

export default defineEventHandler(async event => {
    const { message, everyone, hash, image, replyId } = await readBody(event)
    try {
        if(!message) throw createError('No message received')
        const user = readCookie(event)
        if(!user) throw createError('You are not logged in')
        if(Number(replyId)){
            const isonlyFollowers = await db.select({
                onlyFollowers: tweets.onlyFollowers,
                user: {id: users.id},
            }).from(tweets).where(eq(tweets.id, Number(replyId))).leftJoin(users, eq(tweets.senderID, users.id)).limit(1).then(val => val[0])
            if(isonlyFollowers.onlyFollowers&&isonlyFollowers.user?.id&&isonlyFollowers.user.id!==user.id){
                const followed = await db.query.follows.findFirst({where: and(eq(follows.followed_id, isonlyFollowers.user?.id),eq(follows.follower_id,user.id))})
                if(!followed) throw createError('Followers only post')
            }
        }
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
        console.log(e)
        throw createError('Something went wrong')
    }
})