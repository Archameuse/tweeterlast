export default defineEventHandler(event => {
    deleteCookie(event, process.env.COOKIE_NAME, {
        httpOnly: true
    })
    return 'success'
})