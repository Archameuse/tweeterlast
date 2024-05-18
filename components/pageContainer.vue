<template>
    <div ref="wrapper" class="overflow-y-scroll h-[calc(100vh-4rem)] w-screen dark:text-white">
        <div class="flex flex-col lg:flex-row gap-6 max-w-5xl w-full m-auto py-4">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
    const wrapper = ref<HTMLDivElement>()
    defineExpose({
        wrapper
    })
</script>