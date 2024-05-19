<template>
    <form @reset.prevent="discard" @submit.prevent="submit" class="w-full flex flex-col items-center gap-10" v-if="user">
        <div class="flex w-full justify-center p-4 text-primaryGray border-b-gray-300 border-b">
            <h1 class="text-2xl w-full max-w-5xl">Account</h1>
        </div>
        <div class="w-full max-w-5xl flex flex-col items-center gap-8">
            <div class="flex justify-end w-full gap-4">
                <p class="w-40 text-right">Username</p>
                <input  class="w-full dark:bg-primaryBlack" v-model="name">
            </div>
            <div class="flex justify-end w-full gap-4">
                <p class="w-40 text-right">Status</p>
                <input  class="w-full dark:bg-primaryBlack" v-model="status">
            </div>
            <div class="flex justify-end w-full gap-4">
                <p class="w-40 text-right">User avatar</p>
                <div class="w-full flex flex-wrap space-x-20 space-y-4">
                    <div class="w-40 aspect-square relative rounded-2xl overflow-hidden border-4 border-primaryGray shadow-md">
                        <div v-if="avatarProgress>0" class="absolute w-full h-full top-0 left-0 z-20 flex flex-col justify-center">
                            <div class="w-full bg-gray-200 rounded-full dark:bg-gray-700">
                                <div class="bg-blue-600 text-xs select-none font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" :style="'width: '+avatarProgress+'%'"> {{ avatarProgress }}%</div>
                            </div>
                        </div>
                        <ImageComponent :class="avatarProgress>0&&'blur-md'" :image="avatar" />
                    </div>
                    <div class="flex flex-col justify-center">
                        <button @click.prevent="openAvatar" class="inline-block rounded bg-primaryBlue px-6 py-2 text-xs font-medium uppercase leading-normal text-white shadow-sm transition duration-150 ease-in-out hover:bg-secondaryBlue hover:shadow-md focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:opacity-80 active:shadow-sm active:transition-none">Upload</button>
                    </div>
                </div>
            </div>
            <div class="flex justify-end w-full gap-4">
                <p class="w-40 text-right">Profile banner</p>
                <div class="w-full flex flex-col gap-4 items-center">
                    <div class="w-full h-60 relative rounded-2xl overflow-hidden border-4 border-primaryGray shadow-md">
                        <div v-if="bannerProgress>0" class="absolute w-full h-full top-0 left-0 z-20 flex flex-col justify-center">
                            <div class="w-full bg-gray-200 rounded-full dark:bg-gray-700">
                                <div class="bg-blue-600 text-xs select-none font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" :style="'width: '+bannerProgress+'%'"> {{ bannerProgress }}%</div>
                            </div>
                        </div>
                        <ImageComponent :class="bannerProgress>0&&'blur-md'" :image="banner" />
                    </div>
                    <div class="flex flex-col justify-center w-40">
                        <button @click.prevent="openBanner" class="inline-block rounded bg-primaryBlue px-6 py-2 text-xs font-medium uppercase leading-normal text-white shadow-sm transition duration-150 ease-in-out hover:bg-secondaryBlue hover:shadow-md focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:opacity-80 active:shadow-sm active:transition-none">Upload</button>
                    </div>
                </div>
            </div>
            <div class="w-full flex gap-4 ml-[calc(min(9rem,max(calc(40%-9rem),0)))]">
                <div class="flex w-full max-w-96 m-auto justify-between">
                    <button type="reset" class="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Discard</button>
                    <button type="submit" class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2">Accept</button>
                </div>
            </div>
        </div>
    </form>
    <ImageUploadModal @image-select="select" @closeModal="showModal=false" v-if="showModal"/>
    <ImageCropModal @closeModal="crop" :src="cropAvatar" v-if="cropAvatar"/>
</template>

<script setup lang="ts">
useHead({title: 'Settings'})
    const meta = definePageMeta({
        middleware: ['restrict-unauthed']
    })
    const {refreshUser} = useUser()
    const {data:user,refresh} = await useFetch('/api/user/settings')
    const avatar = ref<string|undefined>(user.value?.image)
    const cropAvatar = ref<string|undefined>()
    const banner = ref<string|undefined>(user.value?.banner)
    const avatarFile = ref<File>()
    const bannerFile = ref<File>()
    const name = ref<string|undefined>(user.value?.username)
    const status = ref<string|undefined>(user.value?.status)
    // const nameRef = ref<HTMLInputElement>()
    // const statusRef = ref<HTMLInputElement>()
    const form = ref<HTMLFormElement>()
    const showModal = ref<boolean>(false)
    const active = ref<'avatar'|'banner'>('avatar')
    const avatarProgress = ref<number>(0)
    const bannerProgress = ref<number>(0)
    const {execute, error, status:fetchStatus} = await useFetch('/api/user/settings', {
        method: 'POST',
        immediate: false,
        watch: false,
        body: {
            avatar,
            banner,
            name,
            status
        }
    })
    const loading = computed(() => {
        return fetchStatus.value==='pending'
    })
    const openAvatar = () => {
        active.value = 'avatar'
        showModal.value = true
    }
    const openBanner = () => {
        active.value = 'banner'
        showModal.value = true
    }
    const select = (file:File) => {
        showModal.value = false
        if(active.value==='avatar') {
            cropAvatar.value = URL.createObjectURL(file)
        } else if(active.value==='banner') {
            banner.value = URL.createObjectURL(file)
            bannerFile.value = file
        }
    }
    const crop = async (image:File) => {
        cropAvatar.value = undefined
        if(!image) return
        avatar.value = URL.createObjectURL(image)
        avatarFile.value = image
    }

    const discard = (e:Event) => {
        name.value = user.value?.username
        status.value = user.value?.status
        avatar.value = user.value?.image
        banner.value = user.value?.banner
    }
    const submit = async (e:Event) => {
        if(avatarFile.value) {
            const avatarForm = new FormData()
            avatarForm.set('folder','banner')
            avatarForm.set('image',avatarFile.value)
            const xhr = new XMLHttpRequest()
            const resp = await new Promise(resolve => {
                xhr.open('POST', '/api/images', true)
                xhr.upload.onprogress = (e) => {
                    avatarProgress.value = Math.round((e.loaded/e.total)*100)
                }
                xhr.upload.onload = (e) => {
                    avatarProgress.value = 100
                }
                xhr.onload = (e) => {
                    avatarProgress.value = 0
                    resolve(xhr.response)
                }
                xhr.send(avatarForm)
            })
            if(!resp) return alert('error uploading avatar')
            avatar.value = `https://drive.google.com/thumbnail?id=${resp}&sz=w5000`
        }
        if(bannerFile.value) {
            const bannerForm = new FormData()
            bannerForm.set('folder','banner')
            bannerForm.set('image',bannerFile.value)
            const xhr = new XMLHttpRequest()
            const resp = await new Promise(resolve => {
                xhr.open('POST', '/api/images', true)
                xhr.upload.onprogress = (e) => {
                    bannerProgress.value = Math.round((e.loaded/e.total)*100)
                }
                xhr.upload.onload = (e) => {
                    bannerProgress.value = 100
                }
                xhr.onload = (e) => {
                    bannerProgress.value = 0
                    resolve(xhr.response)
                }
                xhr.send(bannerForm)
            })
            if(!resp) return alert('error uploading banner')
            banner.value = `https://drive.google.com/thumbnail?id=${resp}&sz=w5000`
        }
        const event = e as SubmitEvent
        await execute()
        if(error.value) console.log(error.value?.data)
        if(fetchStatus.value==='success') refreshUser()
        if(fetchStatus.value==='success') await refresh()
    }
</script>