<template>
    <div class="flex gap-3 font-noto-sans text-sm py-3 px-2 items-center rounded-lg flex-grow cursor-pointer select-none hover:bg-thirdaryGray active:bg-[#dadada] dark:hover:bg-primaryGray dark:active:bg-secondaryGray"
        :class="loading && 'cursor-not-allowed opacity-80 active:bg-transparent hover:bg-transparent dark:hover:bg-transparent dark:active:bg-transparent', `${left ? 'justify-start' : 'justify-center'} ${active&&!loading ? getClass : 'text-secondaryGray dark:text-thirdaryGray'}`"
    >
        <Icon v-if="icon&&!loading" :name="icon" :class="reverse&&'-scale-x-100'"/>
        <slot v-if="!loading"></slot>
        <Icon v-else name="svg-spinners:180-ring" />
    </div>
</template>

<script setup lang="ts">
type types = 'retweet'|'like'|'save'
    const props = defineProps({
        icon: String,
        type: String as PropType<types>,
        reverse: Boolean,
        left: Boolean,
        active: Boolean,
        loading: Boolean
    })
    const getClass = computed(() => {
        const type = props.type
        if(type === 'retweet') return 'text-[#27AE60]'
        if(type === 'like') return 'text-[#EB5757]'
        if(type === 'save') return 'text-primaryBlue'
        return 'text-secondaryGray'
    })
</script>