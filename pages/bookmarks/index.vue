<template>
    <PageContainer ref="container">
        <div>
            <aside class="sticky top-4 py-5 w-full lg:w-80 shrink-0 flex flex-col gap-4 bg-white dark:bg-secondaryGray shadow-md dark:shadow-primaryBlack rounded-lg h-fit">
                <SectionFragment @click="() => status='top'" :active="status==='top'">Top</SectionFragment>
                <SectionFragment @click="() => status='latest'" :active="status==='latest'">Latest</SectionFragment>
                <SectionFragment @click="() => status='media'" :active="status==='media'">Media</SectionFragment>
            </aside>
        </div>
        <div :class="loading==='pending' && 'blur-md cursor-wait [&_*]:pointer-events-none'" class="flex flex-col gap-10 max-w-xl m-auto w-full lg:max-w-fit">
            <ProfilePost v-for="tweet in tweets"
                :post="tweet"
                />
        </div>
    </PageContainer>
</template>

<script setup lang="ts">
useHead({title: 'Bookmarks'})
    definePageMeta({
        middleware: ['restrict-unauthed']
    })
const container = ref<any>()
const page = ref<number>(1)
const isBottom = useIsBottom(() => {
    page.value = Math.max(Math.floor((tweets.value?.length||0)/10)+1, page.value)
},container)
const {user} = useUser()
const status = ref<'top'|'latest'|'media'>('latest')
const {data:tweets, status:loading} = await useFetch<Tweet[]>(`/api/tweets/bookmarks`, {
    query: {
        type: status,
        page
    },
    watch: [user]
})
</script>