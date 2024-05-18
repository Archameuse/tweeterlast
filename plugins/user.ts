export default defineNuxtPlugin(async () => {
    const { populateUser } = useUser()
    await populateUser()
})