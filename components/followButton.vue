<template>
    <div @click="click" class="relative select-none cursor-pointer rounded-md flex gap-1 justify-center items-center"
        :class="`${px} ${py} ${isFollowed ? 'border-2 border-primaryGray text-primaryGray' : 'bg-primaryBlue text-white hover:bg-secondaryBlue active:bg-thirdaryBlue'}`"
    >
        <div v-if="loading" @click.stop class="absolute top-0 left-0 bottom-0 right-0 flex justify-center items-center z-10 cursor-wait">
            <Icon name="svg-spinners:180-ring" />
        </div>
        <Icon v-if="isFollowed" :class="loading && 'opacity-0'" class="-scale-x-100" name="material-symbols:person-remove"/>
        <Icon v-else :class="loading && 'opacity-0'" class="-scale-x-100" name="material-symbols:person-add"/>
        <span :class="getClass">{{ isFollowed ? 'Unfollow' : 'Follow' }}</span>
    </div>
</template>

<script setup lang="ts">
    const props = defineProps({
        profileId: {
            type: Number,
            required: true
        },
        isFollowed: Boolean,
        small: Boolean,
        px: String,
        py: String,
    })
    const px = computed(() => {
        return props.px||'px-8'
    })
    const py = computed(() => {
        return props.py||'py-3'
    })
    const {user} = useUser()
    const isFollowed = ref(props.isFollowed)
    const method = ref<'POST'|'DELETE'>()
    const profileId = computed(() => props.profileId)
    const {execute:follow, status} = await useFetch('/api/user/follow', {
        method,
        immediate: false,
        body: {
            id: profileId
        },
        watch: false
    })
    const emit = defineEmits<{
        (e: 'response', status: boolean): void
    }>()
    const click = async () => {
        if(!user.value) return alert('Please log in to perform this action')
        method.value = isFollowed.value ? 'DELETE' : 'POST'
        await follow()
        if(status.value ==='error') return alert('Error')
        isFollowed.value = !isFollowed.value
        emit('response', isFollowed.value)
    }


    const loading = computed(() => status.value==='pending')
    const getClass = computed(() => {
        let style = props.small ? 'text-xs font-normal' : 'text-sm font-medium'
        if(loading.value) style += ' opacity-0'
        return style
    })
</script>
