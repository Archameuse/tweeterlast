<template>
    <div class="w-full select-none">
        <div class="ml-5 w-full flex items-center text-primaryGray dark:text-thirdaryGray" v-if="post.retweetedBy">
            <Icon name="ic:baseline-loop"/>
            {{ post.retweetedBy }} Retweeted
        </div>
        <div class="w-full p-5 bg-white dark:bg-primaryBlack shadow-md rounded-md flex flex-col gap-5">
            <NuxtLink :to="'/users/' + post.user.id" v-if="post.user">
                <div class="flex h-10 gap-4">
                    <UserAvatar :image="post.user.image"/>
                    <div class="flex flex-col justify-between">
                        <span class="text-base dark:text-white">{{ post.user.username }}</span>
                        <span class="text-xs text-primaryGray dark:text-thirdaryGray">{{ date }}</span>
                    </div>
                </div>
            </NuxtLink>
            <div class="font-noto-sans text-secondaryGray dark:text-white">
                <p>{{ post.content }}</p>
                <p class="mt-4 opacity-60" v-if="post.hashtag">{{ '#'+post.hashtag }}</p>
            </div>
            <div v-if="post.image" class="w-full h-96 rounded-md shadow-sm overflow-hidden">
                <ImageProfile  :image="post.image" />
            </div>
            <ul class="flex text-primaryGray dark:text-thirdaryGray text-xs font-noto-sans justify-end gap-4">
                <li >{{ symbolFormatter(post.replies, 1) }} Comments</li>
                <li >{{ symbolFormatter(post.retweets, 1) }} Retweets</li>
                <li >{{ symbolFormatter(post.likes, 1) }} Likes</li>
            </ul>
            <div class="p-4 flex gap-4 items-center border-y border-thirdaryGray">
                <PostAction @click="showReplies=true" icon="mdi:message-reply-outline"><span class="hidden sm:block">Comments</span></PostAction>
                <PostAction :loading="retweetStatus === 'pending'" @click="clickRetweet" :active="post.retweeted" type="retweet" icon="bi:arrow-repeat" ><span class="hidden sm:block">Retweet</span></PostAction>
                <PostAction :loading="likeStatus==='pending'" @click="clickLike" :active="post.liked" type="like" icon="mdi:heart-outline"><span class="hidden sm:block">Like</span></PostAction>
                <PostAction :loading="saveStatus==='pending'" @click="clickSave" :active="post.saved" type="save" icon="material-symbols:bookmark-outline"><span class="hidden sm:block">Save</span></PostAction>
            </div>
            <div class="min-h-10 h-fit flex gap-4" v-if="user&&computeOnlyFollowers">
                <div class="h-10">
                    <UserAvatar :image="user.image"/>
                </div>
                <div @click="showReply=true" class="flex-grow cursor-pointer min-h-full overflow-y-auto max-h-96 px-3 py-2 text-sm font-noto-sans bg-thirdaryGray dark:bg-secondaryGray rounded-xl">
                    <div class="h-6 z-10 aspect-square float-right cursor-pointer">
                        <Icon name="ic:outline-image" size="100%" class="text-[#BDBDBD] dark:text-thirdaryGray hover:text-secondaryGray dark:hover:text-primaryGray active:text-primaryBlack dark:active:text-primaryBlack"/>
                    </div>
                    <div ref="textDiv" placeholder="Tweet your reply" class="min-h-full bg-transparent text-justify focus:outline-none break-words [hyphens:auto] empty:before:content-[attr(placeholder)] before:pointer-events-none before:text-[#BDBDBD] dark:before:text-thirdaryGray focus:before:invisible"></div>
                </div>
            </div>
        </div>
    </div>
    <ReplyModal :id="post.id" @close-modal="closeReply" v-if="showReply"/>
    <RepliesModal :id="post.id"  @close-modal="showReplies=false" v-if="showReplies"/>
</template>

<script setup lang="ts">

const props = defineProps({
    post: {
        type: Object as PropType<Tweet>,
        required: true
    }
})
const { user } = useUser()
const method = ref<'POST'|'DELETE'>()
const showReply = ref<boolean>(false)
const showReplies = ref<boolean>(false)
const postId = computed(() => props.post.id)

const { execute:like, status:likeStatus } = await useFetch('/api/tweets/likes', {
            method,
            body: {
                tweet: postId
            },
            immediate: false,
            watch: false
        })
const { execute:save, status:saveStatus } = await useFetch('/api/tweets/saves', {
            method,
            body: {
                tweet: postId
            },
            immediate: false,
            watch: false
        })
const { execute:retweet, status:retweetStatus } = await useFetch('/api/tweets/retweets', {
            method,
            body: {
                tweet: postId
            },
            immediate: false,
            watch: false
        })
const clickLike = async () => {
    if(!user.value) return alert('Please log in to perform this action')
    method.value = props.post.liked ? 'DELETE' : 'POST'
    await like()
    if(likeStatus.value==='error') {
        alert('Error')
    } else {
        if(props.post.liked) props.post.likes--
        else                 props.post.likes++
        props.post.liked = !props.post.liked
    }
}
const clickSave = async () => {
    if(!user.value) return alert('Please log in to perform this action')
    method.value = props.post.saved ? 'DELETE' : 'POST'
    await save()
    if(saveStatus.value==='error') {
        alert('Error')
    } else {
        props.post.saved = !props.post.saved
    }
}
const clickRetweet = async () => {
    if(!user.value) return alert('Please log in to perform this action')
    if(user.value.id === props.post.user.id) return alert('You cant retweet your own tweets')
    method.value = props.post.retweeted ? 'DELETE' : 'POST'
    await retweet()
    if(retweetStatus.value==='error') {
        alert('Error')
    } else {
        if(props.post.retweeted) props.post.retweets--
        else                     props.post.retweets++
        props.post.retweeted = !props.post.retweeted
    }
}
const closeReply = (success?:true) => {
    showReply.value = false
    if(success) {
        props.post.replies++
    }
}

const date = computed(() => {
    if(!props.post.date) return undefined
    const now = new Date()
    const date = new Date(props.post.date)
    const getTime = () => {
        const hours = date.getHours()
        const minutes = date.getMinutes()
        const formattedHours = hours < 10 ? '0'+hours : hours
        const formattedMinutes = minutes < 10 ? '0'+minutes : minutes
        return `${formattedHours}:${formattedMinutes}`
    }
    if(now.getFullYear() > date.getFullYear()) return `${monthName(date.getMonth())} ${date.getDate()}, ${date.getFullYear()}`
    if(now.getDate() === date.getDate() && now.getMonth() === date.getMonth()) return `Today, at ${getTime()}`
    return `${date.getDate()} ${monthName(date.getMonth())} at ${getTime()}`
})

const computeOnlyFollowers = computed(() => {
    if(!user.value) return false
    if(props.post.onlyFollowers) {
        if(props.post.user.followed||props.post.user.id===user.value.id) return true
        return false
    }
    return true
})
</script>