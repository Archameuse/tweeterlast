<template>
    <div v-if="user" class="min-w-0 w-full bg-white dark:bg-primaryBlack rounded-lg shadow-sm px-5 py-3 flex flex-col gap-2 relative">
        <UnderlinedText class="flex justify-between flex-wrap [word-break:break-word]">
            {{
                (replyId ? 'Reply ' : 'Tweet something ') +
                (hash&&('#'+hash)||'')
            }}
            <button @click="addHashtag" >
                <Icon name="ph:hash"/>
            </button>
        </UnderlinedText>
        <div class="min-h-[5rem] h-fit flex gap-4">
            <div class="h-10">
                <UserAvatar :image="user.image"/>
            </div>
            <div class="flex flex-col flex-grow items-start min-w-0">
                <div class="w-full flex-grow px-3 py-2 text-sm font-noto-sans rounded-xl">
                    <div ref="messageBox" @input="input" @paste.prevent="plain" placeholder="What's happening?" contenteditable="true" 
                        class="overflow-y-auto max-h-60 
                        noscroll bg-transparent text-justify focus:outline-none 
                        break-words  [hyphens:auto] 
                        empty:before:content-[attr(placeholder)] 
                        before:pointer-events-none before:text-[#BDBDBD] 
                        focus:before:invisible">
                    </div>
                    <span class="float-right">{{ remaining }}</span>
                    <div v-if="image" class="w-full relative h-96 rounded-md shadow-sm overflow-hidden mt-8">
                        <div v-if="statusImage==='pending'" class="absolute w-full h-full top-0 left-0 z-20 flex flex-col justify-center">
                            <div class="w-full bg-gray-200 rounded-full dark:bg-gray-700">
                                <div class="bg-blue-600 text-xs select-none font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" :style="'width: '+progress+'%'"> {{ progress }}%</div>
                            </div>
                        </div>
                        <div class="relative h-full" :class="statusImage==='pending' && 'blur-md'">
                            <div class="absolute top-0 right-0 z-10 h-8 w-8">
                                <ActionIcon @click="clearImage" name="material-symbols:close-rounded"/>
                            </div>
                            <ImageComponent :image="image" />
                        </div>
                    </div>
                </div>
                <div class="flex justify-between w-full items-center flex-wrap space-y-2">
                    <div :class="loading&&'pointer-events-none'" class="h-6 flex gap-4 text-primaryBlue select-none">
                        <ActionIcon @click="openModal" name="ic:outline-image" />
                        <div class="h-full flex items-center gap-2">
                            <div class="h-full" @click="chooseType=!chooseType">
                                <ActionIcon name="mdi:earth" v-if="everyone"/>
                                <ActionIcon name="material-symbols:group" v-else/>
                            </div>
                            <span class="text-xs font-noto-sans">{{ everyone ? 'Everyone can reply' : 'People you follow' }}</span>
                            <ReplySelect v-if="chooseType" @select="selectType" />
                        </div>
                    </div>
                    <ActionButton v-if="!loading" @click="send">
                        Tweet
                    </ActionButton>
                    <ActionButton v-else class="cursor-wait opacity-80 !scale-100">
                        <Icon name="svg-spinners:180-ring" />
                    </ActionButton>
                </div>
            </div>
        </div>
        <ImageUploadModal v-if="imageModal" @closeModal="imageModal = false" @image-select="selectImage"/>
    </div>
</template>

<script setup lang="ts">
    const props = defineProps({
        limit: {
            type: Number,
            default: 300
        },
        replyId: Number
    })
    const emit = defineEmits(['refresh'])
    const {user} = useUser()
    const messageBox = ref<HTMLDivElement>()
    const message = ref<string>('')
    const chooseType = ref<boolean>()
    const everyone = ref<boolean>(true)
    const image = ref<string|undefined>()
    const uploadImage = ref<string|undefined>()
    const imageModal = ref<boolean>()
    const hash = ref<string>()
    const progress = ref<number>(0)
    const statusImage = ref<'idle'|'pending'>('idle')
    const replyIdRef = ref<number|undefined>(props.replyId)
    const imageData = new FormData()
    imageData.append('folder','post')
    const {execute, status:statusPost} = await useFetch('/api/tweets', {
        method: 'POST',
        immediate: false,
        watch: false,
        body: {
            message,
            hash,
            everyone: everyone,
            image: uploadImage,
            replyId: replyIdRef
        }
    })
    const loading = computed(() => {
        if(statusPost.value==='pending' || statusImage.value==='pending') return true
        return false
    })
    const remaining = computed(() => {
        return props.limit-message.value.length
    })
    const plain = (event:ClipboardEvent) => {
        if(event?.clipboardData) {
            // const target = event.target as HTMLDivElement
            const text = event.clipboardData.getData('text/plain')
            if (document.queryCommandSupported('insertText')) {
                document.execCommand('insertText', false, text);
            } else {
                document.execCommand('paste', false, text);
            }
        }
    }
    const input = () => {
        if(!messageBox.value) return
        const text = messageBox.value.textContent||''
        message.value = text.slice(0,props.limit)
    }
    const send = async () => {
        if(image.value) {
            const xhr = new XMLHttpRequest()
            const resp = await new Promise<void>((resolve,reject) => {
                statusImage.value = 'pending'
                xhr.open('POST', '/api/images', true)
                xhr.upload.onprogress = (e) => {
                    progress.value = Math.round((e.loaded/e.total)*100)
                }
                xhr.upload.onload = (e) => {
                    progress.value = 100
                }
                xhr.onload = (e) => {
                    progress.value = 0
                    resolve()
                }
                xhr.send(imageData)
            })
            statusImage.value = 'idle'
            if(xhr.status !== 200) return alert ('Failed to upload image')
            uploadImage.value = `https://drive.google.com/thumbnail?id=${xhr.response}&sz=w5000`
        }
        await execute()
        if(statusPost.value === 'error') return alert('Failed to create post')
        if(messageBox.value) messageBox.value.innerText = ''
        emit('refresh')
        message.value = ''
        image.value = undefined
        chooseType.value = false
        everyone.value = true
        uploadImage.value = undefined
        hash.value = undefined
        imageData.delete('image')
    }
    const clearImage = () => {
        imageData.delete('image')
        image.value = undefined
    }
    const selectImage = (img:File) => {
        if(img.size >= 1024*1024*20) return alert('Image should be less than 20mb')
        image.value = URL.createObjectURL(img)
        imageModal.value = false
        if(imageData.get('image')) imageData.delete('image')
        imageData.append('image', img)
    }
    const openModal = () => {
        imageModal.value = true
    }
    const selectType = (who:string) => {
        everyone.value = who==='everyone'
        chooseType.value = false
    }
    const addHashtag = () => {
        const tag = prompt('Input hashtag (40 characters (only letters))')?.slice(0,40).replace(/[^a-zA-Z]/g, "");
        if(!tag) return
        hash.value = tag
    }
</script>