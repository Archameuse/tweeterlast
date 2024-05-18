import { and, desc, eq, getTableColumns, ilike, inArray, isNotNull, ne, or, sql } from "drizzle-orm"
import db from "./drizzle"
import { follows, replies, retweets, tweets, users } from "~/db/schema"
import { alias, except, union } from "drizzle-orm/pg-core"

export default async (limitPage:number, page:string, user?:User|null,type?:string,search?:string, id?:number) => {
    const limit = limitPage*10
    const postFields = getTableColumns(tweets)
    const countLikes = sql<number>`(select count("likes") from "likes" where ("likes"."tweet_id" = "tweets"."id"))`.as('likes')
    const countRetweets = sql<number>`(select count("retweets") from "retweets" where ("retweets"."tweet_id" = "tweets"."id"))`.as('retweets')
    const countReplies = sql<number>`(select count("replies") from "replies" where ("replies"."reply_to" = "tweets"."id"))`.as('replies')
    const isLiked = user ? sql<boolean>`(select exists(select 1 from "likes" where ( ("likes"."tweet_id" = "tweets"."id") and ("likes"."user_id" = ${user.id}))))`.as('liked') : sql<boolean>`false`.as('liked')
    const isSaved = user ? sql<boolean>`(select exists(select 1 from "saves" where ( ("saves"."tweet_id" = "tweets"."id") and ("saves"."user_id" = ${user.id}))))` : sql<boolean>`false`
    const isRetweeted = user ? sql<boolean>`(select exists(select 1 from "retweets" where ( ("retweets"."tweet_id" = "tweets"."id") and ("retweets"."user_id" = ${user.id}))))`.as('retweeted') : sql<boolean>`false`.as('retweeted')
    const isFollowedUser = user ? sql`(( "tweets"."senderID" in (select "id" from "users" where ( "users"."id" in (select "followed_id" from "follows" where ("follows"."follower_id" = ${user.id}))))))` : sql<boolean>`false`
    const retweetUser = alias(users, 'retweetUser')

    const whereProfile = () => {
        const ifTweets = eq(tweets.senderID, Number(id))
        const ifReplies = or(ifTweets, sql`( "tweets"."id" in ( select "reply_with" from "replies" where ( "replies"."reply_to" in ( select "id" from "tweets" where ( "tweets"."senderID" = ${Number(id)} ) ) ) ) )`)
        const ifMedia = and(ifTweets, isNotNull(tweets.image), ne(tweets.image,''))
        const ifLikes = sql`("tweets"."id" in ( select "tweet_id" from "likes" where ( "likes"."user_id" = ${Number(id)} )  ) )`
        if(type === 'replies') return ifReplies
        if(type === 'media') return ifMedia
        if(type === 'likes') return ifLikes
        else return ifTweets
    }


    const normalPosts = db.select({
        ...postFields,
        user: {id: users.id, username: users.username, image:users.image},
        likes: countLikes,
        liked: isLiked,
        saved: isSaved,
        replies: countReplies,
        retweets: countRetweets,
        retweeted: isRetweeted,
        retweetedBy: sql`null`,
    }).from(tweets).leftJoin(users, eq(tweets.senderID, users.id))
    .where(page==='profile'&&id ? whereProfile() : and(
        ilike(tweets.content, `%${search?search:''}%`),
        page==='replies'&&id ? (inArray(tweets.id,db.select({id:replies.reply_with}).from(replies).where(eq(replies.reply_to,id)))) : sql`TRUE`,
        type==='media' ? (and(isNotNull(tweets.image), ne(tweets.image,''))) : sql`TRUE`,
        page==='home'&&user ? (or(eq(tweets.senderID, user.id), isFollowedUser)) : sql`TRUE`,
        page==='bookmarks'&&user ? isSaved : sql`TRUE`
    ))

    if(page==='replies') return await normalPosts.orderBy(desc(tweets.date)).limit(limit) as Tweet[]
    if(page==='profile'&&type==='likes') return await normalPosts.orderBy(desc(tweets.date)).limit(limit) as Tweet[]
    if(page==='bookmarks') return await normalPosts.orderBy(type==='top' ? desc(countLikes) : desc(tweets.date)).limit(limit) as Tweet[]
    const retweetPosts = db.select({
        ...postFields,
        date: retweets.date,
        user: {id: users.id, username: users.username, image:users.image},
        likes: countLikes,
        liked: isLiked,
        saved: isSaved,
        replies: countReplies,
        retweets: countRetweets,
        retweeted: isRetweeted,
        retweetedBy: retweetUser.username,
    })
        .from(tweets)
        .leftJoin(retweets, eq(tweets.id,retweets.tweet_id))
        .leftJoin(users, eq(tweets.senderID,users.id))
        .leftJoin(retweetUser, eq(retweets.user_id,retweetUser.id))
        .where(and(
            eq(tweets.id,retweets.tweet_id),
            ilike(tweets.content, `%${search?search:''}%`),
            type==='media' ? (and(isNotNull(tweets.image), ne(tweets.image,''))) : sql`TRUE`,
            page==='home'&&user ? (or(eq(retweets.user_id, user.id), inArray(retweets.user_id, db.select({id:users.id}).from(users).innerJoin(follows, and(eq(users.id,follows.followed_id),eq(follows.follower_id,user.id)))))) : sql`TRUE`,
            // page==='profile'&&id ? (or(eq(retweets.user_id, id), inArray(retweets.user_id, db.select({id:users.id}).from(users).innerJoin(follows, and(eq(users.id, follows.followed_id), eq(follows.follower_id,id)))))) : sql`TRUE`
            page==='profile'&&id ? eq(retweets.user_id, id) : sql`TRUE`
        ))
        

        const posts = await union(
            normalPosts,
            //@ts-ignore
            retweetPosts,
        ).orderBy(type==='top' ? desc(countLikes) : desc(tweets.date)).limit(limit)
    
        
    return posts as Tweet[]
}

