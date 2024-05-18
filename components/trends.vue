<template>
    <div class="w-full px-5 py-3 bg-white dark:bg-primaryBlack rounded-xl shadow-sm flex flex-col gap-6">
        <UnderlinedText>Trends for you</UnderlinedText>
        <TrendsFragment v-for="trend in trends" :tweets="trend.tweets">{{ trend.name }}</TrendsFragment>
    </div>
</template>

<script lang="ts">
    export default defineNuxtComponent({
        props: {
            trends: {
                type: Array as PropType<Trend[]>,
                required: true
            }
        }
    })
</script>