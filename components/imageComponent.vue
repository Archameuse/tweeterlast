<template>
    <img :src="img" draggable="false" class="w-full h-full select-none object-center object-cover">
</template>

<script setup lang="ts">
    const props = defineProps({
        image: {
            type: String
        }
    })
    const img = computed(() => props.image?.length ? props.image : '/noprofile.svg')
</script>