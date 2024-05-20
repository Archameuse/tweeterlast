<template>
    <PageContainer ref="container">
        <div>
            <aside class="sticky top-4 py-5 w-full lg:w-80 shrink-0 flex flex-col gap-4 bg-white dark:bg-secondaryGray shadow-md dark:shadow-primaryBlack rounded-lg h-fit">
                <SectionFragment @click="() => status='top'" :active="status==='top'">Top</SectionFragment>
                <SectionFragment @click="() => status='latest'" :active="status==='latest'">Latest</SectionFragment>
                <SectionFragment @click="() => status='media'" :active="status==='media'">Media</SectionFragment>
            </aside>
        </div>
        <div class="flex flex-col gap-10 w-full h-fit">
            <form @submit.prevent="searchEvent" class="w-full">   
                <label for="tweet-search" class="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>
                <div class="relative">
                    <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <Icon name="ic:outline-search" class="w-6 h-6"/>
                    </div>
                    <input type="search" id="tweet-search" class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search..." v-model="search"/>
                    <button type="submit" class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-4 py-2 active:opacity-80">Search</button>
                </div>
            </form>

            <div :class="loading==='pending' && 'blur-md cursor-wait [&_*]:pointer-events-none'" class="flex flex-col gap-10 max-w-xl m-auto w-full lg:max-w-fit">
                <ProfilePost v-for="tweet in tweets"
                    @refresh-reply="refresh"
                    :post="tweet"
                    />
            </div>
        </div>
    </PageContainer>
</template>

<script setup lang="ts">
const {user} = useUser()
const page = ref<number>(1)
const container = ref<any>()
const isBottom = useIsBottom(() => {
    page.value = Math.max(Math.floor((tweets.value?.length||0)/10)+1, page.value)
}, container)

const status = ref<'top'|'latest'|'media'>('latest')
const searchQuery = ref<string>()
const search = ref<string>()
const {data:tweets, status:loading, refresh} = await useFetch<Tweet[]>(`/api/tweets/explore`, {
    query: {
        type: status,
        search: searchQuery,
        page
    },
    watch: [user],
})
const searchEvent = () => {
    searchQuery.value = search.value?.replace(/\W/g, '')
}
</script>