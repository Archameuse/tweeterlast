<template>
    <PageContainer ref="container">
        <div class="flex flex-col gap-10 w-full h-fit">
            <TweetInput @refresh="refresh" :limit="300"/>
            <div :class="status==='pending' && 'blur-md cursor-wait [&_*]:pointer-events-none'" class="flex flex-col gap-10 max-w-xl m-auto w-full lg:max-w-fit">
                <ProfilePost @refresh-reply="refresh" v-for="tweet in tweets"
                    :post="tweet"
                    />
            </div>
        </div>
        <div class="hidden lg:flex flex-col gap-6 sticky top-4 w-96 h-[calc(100vh-4rem)] overflow-y-scroll hidescrollbar">
            <Trends v-if="trends" :trends="trends"/>
            <WhoToFollow />
        </div>
    </PageContainer>
</template>

<script setup lang="ts">
//tinyprofile -> followbutton needs to be added
    const pageMeta = definePageMeta({
        middleware: ['restrict-unauthed']
    })
    const {user} = useUser()
    const page = ref<number>(1)
    const container = ref<any>()
    useIsBottom(() => {
        page.value = Math.max(Math.floor((tweets.value?.length||0)/10)+1, page.value)
    }, container)
    const { data:tweets, status, refresh } = await useFetch<Tweet[]>('/api/tweets/home', {
        query: {
            page
        }
    })

    const { data:trends } = await useFetch<Trend[]>('/api/tweets/trends')
</script>

<style>
.hidescrollbar::-webkit-scrollbar {
    display: none;
}

.hidescrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>