<template>
<ModalMain @close-modal="closeModal">
    <ImageComponent v-if="!isVideo" :src="src"/>
    <video v-else :src="src" ref="video" muted loop autoplay draggable="false" class="h-full w-full select-none object-center object-cover"></video>
</ModalMain>
</template>

<script setup lang="ts">

    const props = defineProps({
        src: {
            type: String,
            requried: true
        },
        isVideo: Boolean,
        timestamp: Number
    })
    
    const emit = defineEmits<{
        closeModal2: [timestamp: number|void]
    }>()
    const video = ref<HTMLVideoElement>()
    onMounted(() => {
            if(video.value && props.timestamp) {
                video.value.currentTime = props.timestamp
            }
        })
    const closeModal = () => {
        if(video.value) {
            emit('closeModal2', video.value.currentTime)
        } else {
            emit('closeModal2')
        }
    }
</script>