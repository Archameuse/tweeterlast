import getTweets from "~/server/utils/getTweets"
import readCookie from "~/server/utils/readCookie"

export default defineEventHandler(async (event) => {
    try {
        const { id, page }:{id:string|undefined, page:string} = getQuery(event)
        if(!Number(id)) throw createError('Invalid id')
        const user = readCookie(event)
        const posts = await getTweets(Number(page)||1,'replies',user,undefined,undefined,Number(id))
        return posts
    } catch(e) {
        throw createError('error')
    }
})
