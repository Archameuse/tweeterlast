<template>    
    <PageContainer ref="container">
        <div class="flex flex-col lg:flex-row flex-wrap gap-6 w-full">
            
            <div v-if="profile?.banner" class="w-full aspect-video max-h-96 flex-grow">
                <ImageComponent v-if="profile.banner" :image="profile.banner"/>
            </div>
            <div>
                <aside class="sticky top-4 py-5 w-full lg:w-80 shrink-0 flex flex-col gap-4 bg-white dark:bg-secondaryGray shadow-md dark:shadow-primaryBlack rounded-lg h-fit">
                    <SectionFragment @click="() => type='tweets'" :active="type==='tweets'">Tweets</SectionFragment>
                    <SectionFragment @click="() => type='replies'" :active="type==='replies'">Tweets & replies</SectionFragment>
                    <SectionFragment @click="() => type='media'" :active="type==='media'">Media</SectionFragment>
                    <SectionFragment @click="() => type='likes'" :active="type==='likes'">Likes</SectionFragment>
                </aside>
            </div>
            <div class="flex flex-col gap-10 w-full h-fit flex-1">
                <div v-if="profile" :class="profile.banner ? 'lg:relative lg:-top-12' : 'my-12'" class="relative w-full max-w-screen-md m-auto">
                    <ProfileTab :profile="profile"/>
                </div>
                <div :class="status==='pending' && 'blur-md cursor-wait [&_*]:pointer-events-none'" class="flex flex-col gap-10 max-w-xl m-auto w-full lg:max-w-fit">
                    <ProfilePost v-for="tweet in tweets"
                        :post="tweet"
                        />
                </div>
            </div>
        </div>
    </PageContainer>
</template>

<script setup lang="ts">
    definePageMeta({
        middleware: ['user-exist']
    })
    const {user} = useUser()
    const {id} = useRoute().params
    const type = ref<'tweets'|'replies'|'media'|'likes'>('tweets')
    const page = ref<number>(1)
    const container = ref<any>()
    //твиты = твиты+ретвиты, медиа = твиты+ретвиты где картинка, лайки=только твиты которые лайкнул юзер
    //твиты+реплаи все твиты юзера+все твиты которые реплаят на твиты юзера первое условие where user id = tweet senderid второе условие "или" where reply_to = твитид и брать тогда where replies.replywith = tweet.id
    const {data:profile} = await useFetch('/api/user/profile', {
        query: {
            id,
            page
        }
    })
    useHead({title: profile.value?.username})
    const isBottom = useIsBottom(() => {
        page.value = Math.max(Math.floor((tweets.value?.length||0)/10)+1, page.value)
    }, container)

    const {data:tweets, status} = await useFetch<Tweet[]>('/api/tweets/profile', {
        query: {
            id,
            type,
            page
        }
    })
</script>