<template>
    <ModalMain>
        <TweetInput @refresh="$emit('close-modal', true)" :reply-id="id"/>
    </ModalMain>
</template>

<script setup lang="ts">
    const props = defineProps({
        id: {
            type: Number,
            required: true
        }
    })
</script>