<template>
    <div ref="wrapper" tabindex="-1" aria-hidden="true" :class="noscroll?'overflow-y-hidden':'overflow-y-auto'" class="fixed top-0 bottom-0 left-0 right-0 flex justify-center bg-[#0000004b] overflow-x-hidden z-50 select-none p-16">
        <div class="relative min-w-fit w-full max-w-2xl min-h-full h-fit flex flex-col justify-center">
            <div class="flex flex-col relative h-min-content bg-white dark:bg-primaryBlack rounded-lg shadow">
                <div class="flex justify-between items-start p-4 rounded-t border-b">
                    <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                        {{headline}}
                    </h3>
                    <button @click="$emit('close-modal')" type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center">
                        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                        <span class="sr-only">Close modal</span>
                    </button>
                </div>
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    const props = defineProps({
        headline: {
            type: String,
            default: ''
        },
        noscroll: Boolean
    })
    const wrapper = ref<HTMLDivElement>()
    defineExpose({
        wrapper
    })
    // onMounted(() => {
    //     const scrollbarwidth = useScrollbarWidth()
    //     document.documentElement.style.overflowY = 'hidden'
    //     document.documentElement.style.marginRight = scrollbarwidth.value+'px'
    // })
    // onUnmounted(() => {
    //     document.documentElement.style.overflowY = 'scroll'
    //     document.documentElement.style.marginRight = '0px'
    // })
</script>
