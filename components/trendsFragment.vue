<template>
    <div class="w-full flex flex-col gap-2 justify-between font-noto-sans text-left">
        <span class="text-base font-semibold">#<slot></slot></span>
        <span v-if="tweets" class="text-primaryGray text-xs">{{ formattedTweets + ' Tweets' }}</span>
    </div>
</template>

<script lang="ts">
    export default defineNuxtComponent({
        props: {
            tweets: Number
        },
        computed: {
            formattedTweets() {
                const tweets = this.tweets
                if(!tweets) return
                return symbolFormatter(tweets, 1)
            }
        }
    })
</script>