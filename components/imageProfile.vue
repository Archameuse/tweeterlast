<template>
    <ImageComponent @click="click" v-if="!isVideo" :src="image"/>
    <video @click="click" ref="video" v-else :src="image" muted loop autoplay draggable="false" class="h-full w-full select-none object-center object-cover"></video>
    <ImageModal @close-modal2="closeModal" :isVideo="isVideo" :src="image" :timestamp="timestamp" v-if="modal"/>
</template>

<script setup lang="ts">
    const props = defineProps({
        image: {
            type: String,
            default: '/noprofile.svg'
        }
    })
    const vidTypes = [
        'webm',
        'mp4'
    ]
    // await preloadComponents('imageModal')
    const video = ref<HTMLVideoElement>()
    const timestamp = ref<number>(0)
    const modal = ref<boolean>(false)
    const isVideo = computed(() => {
        let video = false
        const extension = props.image.split('.').pop()
        for(let type of vidTypes) {
            if(type===extension?.substring(0,type.length)) {
                video = true
                break
            }
        }
        return video
    })
    const click = () => {
        if(video.value) {
            timestamp.value = video.value.currentTime
            video.value.pause()
        }
        modal.value = true
        // pause.value = !pause.value
    }
    const closeModal = (newTime:number|undefined) => {
        modal.value = false
        if(!video.value) return
        if(newTime) video.value.currentTime = newTime
        
        video.value?.play()
    }
</script>