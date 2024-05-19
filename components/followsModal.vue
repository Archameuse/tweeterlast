<template>
    <ModalMain :headline="profile.username + ` is following`" ref="modalMain">
        <div v-if="status==='pending'" class="h-6 z-10 w-full flex justify-center aspect-square float-right cursor-wait">
            <Icon name="svg-spinners:180-ring" />
        </div>
        <div v-else class="flex flex-col flex-grow min-w-0 px-8 gap-5 py-5">
            <TinyProfile v-for="user of users" :user="user" nobanner/>
        </div>
    </ModalMain>
</template>

<script setup lang="ts">
    const props = defineProps({
        profile: {
            type: Object as PropType<Profile>,
            required: true
        }
    })
    const idRef = ref<number>(props.profile.id)
    const page = ref<number>(0)
    const {data:users,status} = useLazyFetch<Profile[]>('/api/user/followed', {
        query: {id:idRef,page}
    })
    const modalMain = ref<any>()
    const isBottom = useIsBottom(() => {
        page.value = Math.max(Math.floor((users.value?.length||0)/10)+1, page.value)
    }, modalMain)

</script>