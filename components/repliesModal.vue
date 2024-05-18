<template>
    <ModalMain ref="modalMain">
        <div class="flex flex-col gap-10 flex-grow min-w-0">
            <ProfilePost v-for="tweet in tweets"
            :post="tweet"
            />
        </div>
        <div v-if="status==='pending'" class="h-6 z-10 w-full flex justify-center aspect-square float-right cursor-wait">
            <Icon name="svg-spinners:180-ring" />
        </div>
    </ModalMain>
</template>

<script setup lang="ts">
    const props = defineProps({
        id: {
            type: Number,
            required: true
        }
    })
    const idRef = ref<number>(props.id)
    const page = ref<number>(0)
    const {data:tweets, status} = await useLazyFetch<Tweet[]>('/api/tweets/replies', {
        query: {id:idRef,page}
    })
    const modalMain = ref<any>()
    const isBottom = useIsBottom(() => {
        page.value = Math.max(Math.floor((tweets.value?.length||0)/10)+1, page.value)
    }, modalMain)

</script>