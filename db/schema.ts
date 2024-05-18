import { relations } from "drizzle-orm";
import { text, boolean, pgTable, serial, timestamp, integer, primaryKey, varchar } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    email: text('email').unique().notNull(),
    password: text('password').notNull(),
    username: text('username').notNull(),
    image: text('image'),
    banner: text('banner'),
    status: text('status'),
})

export const follows = pgTable('follows', {
    follower_id: integer('follower_id').notNull().references(() => users.id),
    followed_id: integer('followed_id').notNull().references(() => users.id),
}, table => ({pk: primaryKey({columns: [table.follower_id, table.followed_id]})}))

export const tweets = pgTable('tweets', {
    id: serial('id').primaryKey(),
    content: text('content').default(''),
    date: timestamp('date').notNull(),
    onlyFollowers: boolean('onlyFollowers').default(false),
    image: text('image'),
    senderID: integer('senderID').notNull().references(() => users.id),
    hashtag: varchar('hashtag', {length: 64})
})

export const replies = pgTable('replies', {
    reply_to: integer('reply_to').notNull().references(() => tweets.id),
    reply_with: integer('reply_with').notNull().references(() => tweets.id),
}, table => ({pk: primaryKey({columns: [table.reply_to, table.reply_with]})}))

export const likes = pgTable('likes', {
    user_id: integer('user_id').notNull().references(() => users.id),
    tweet_id: integer('tweet_id').notNull().references(() => tweets.id),   
}, table => ({pk: primaryKey({ columns: [table.user_id, table.tweet_id] })}))

export const saves = pgTable('saves', {
    user_id: integer('user_id').notNull().references(() => users.id),
    tweet_id: integer('tweet_id').notNull().references(() => tweets.id),
}, table => ({pk: primaryKey({columns: [table.tweet_id, table.user_id]})}))


export const retweets = pgTable('retweets', {
    user_id: integer('user_id').notNull().references(() => users.id),
    tweet_id: integer('tweet_id').notNull().references(() => tweets.id),
    date: timestamp('date').defaultNow()
}, table => ({pk: primaryKey({columns: [table.tweet_id, table.user_id]})}))

// relations

export const tweetsRelations = relations(tweets, ({one, many}) => ({
    user: one(users, {
        fields: [tweets.senderID],
        references: [users.id],
    }),
    likes: many(likes, {relationName: 'tweet'}),
    saves: many(saves, {relationName: 'tweet'}),
    retweets: many(retweets, {relationName: 'tweet'})
}))

export const usersRelations = relations(users, ({many}) => ({
    tweets: many(tweets),
    followers: many(follows, {relationName: 'followed'}),
    follows: many(follows, {relationName: 'follower'}),
    saves: many(saves, {relationName: 'tweet'}),
}))

export const followsRelations = relations(follows, ({one}) => ({
    follower: one(users, {
        fields: [follows.follower_id],
        references: [users.id],
        relationName: 'follower'
    }),
    followed: one(users, {
        fields: [follows.followed_id],
        references: [users.id],
        relationName: 'followed'
    })
}))

export const repliesRelations = relations(replies, ({one}) => ({
    original: one(tweets, {
        fields: [replies.reply_to],
        references: [tweets.id],
        relationName: 'original'
    }),
    reply: one(tweets, {
        fields: [replies.reply_with],
        references: [tweets.id],
        relationName: 'reply'
    })
}))

export const likesRelations = relations(likes, ({one}) => ({
    tweet: one(tweets, {
        fields: [likes.tweet_id],
        references: [tweets.id],
        relationName: 'tweet'
    }),
    user: one(users, {
        fields: [likes.user_id],
        references: [users.id],
        relationName: 'user'
    })
}))
export const savesRelations = relations(saves, ({one}) => ({
    tweet: one(tweets, {
        fields: [saves.tweet_id],
        references: [tweets.id],
        relationName: 'tweet'
    }),
    user: one(users, {
        fields: [saves.user_id],
        references: [users.id],
        relationName: 'user'
    })
}))
export const retweetsRelations = relations(retweets, ({one}) => ({
    tweet: one(tweets, {
        fields: [retweets.tweet_id],
        references: [tweets.id],
        relationName: 'tweet'
    }),
    user: one(users, {
        fields: [retweets.user_id],
        references: [users.id],
        relationName: 'user'
    })
}))
