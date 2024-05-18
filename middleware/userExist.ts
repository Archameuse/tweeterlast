export default defineNuxtRouteMiddleware(async (to, from) => {
    const {id} = to.params
    if(!Number(id)) return abortNavigation({message: 'Invalid id', statusCode: 404})
    const user = await $fetch('/api/user/exist', {
        query: {
            id: Number(id)
        }
    }).catch(e => {
        abortNavigation(e)
        return null
    })
    if(!user) return navigateTo('/', {redirectCode: 404})
    return
})