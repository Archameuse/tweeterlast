<template>
    <ModalMain headline="Upload your image">
        <main @drop.prevent="drop" @dragover.prevent @dragenter.prevent class="bg-white dark:bg-primaryBlack flex flex-col justify-center items-center w-full shadow-md rounded-lg text-center">
            <div>
                <h1 class="text-[rgba(0,0,0,0.65)] dark:text-thirdaryGray">Upload your image</h1>
                <h3 class="text-[rgba(0,0,0,0.45)] dark:text-thirdaryGray">File should be an image</h3>
            </div>
                <div ref="dropzone" class="w-[90%] h-[300px] flex flex-col items-center justify-center border-dashed border-2 border-[lightskyblue] bg-[aliceblue] dark:border-thirdaryGray dark:bg-secondaryGray rounded-[5px] text-[rgba(0,0,0,0.2)] ">
                <img src="/image.svg" width="200" height="100">
                <h2 class="text-[rgba(0,0,0,0.65)] dark:text-thirdaryGray mt-0 mb-6 w-full">Drag & Drop your image in here</h2>
            </div>
            <div>
                <h2 class="text-[rgba(0,0,0,0.3)] dark:text-white text-sm">Or</h2>
            </div>
                <div @click="select" class="bg-[#318CE7] max-w-[220px] w-full h-[60px] rounded-2xl flex justify-center items-center mb-5 shadow-md cursor-pointer">
                <h3 class="text-white font-thin text-md sm:text-2xl">Choose a file</h3>
            </div>
            <input @change="change" class="hidden" type="file" ref="fileInput" accept="image/*">
        </main>
    </ModalMain>
</template>

<script setup lang="ts">
    const isImage = /^image\//
    const fileInput = ref<HTMLInputElement>()
    const emit = defineEmits<{
        (e: 'imageSelect', file:File):void
    }>()
    const upload = (file:File) => {
        emit('imageSelect', file)
    }
    const drop = async (event:DragEvent) => {
        const file = event.dataTransfer?.files?.[0]
        if(!file) return alert('No file selected')
        if(!isImage.test(file.type)) return alert('Wrong filetype')
        upload(file)
    }

    const select = () => {
        if(fileInput.value) {
            fileInput.value.click()
        }
    }
    const change = (event:Event) => {
        if(!fileInput.value) return
        if(!fileInput.value.files?.length) {fileInput.value.value = '';return alert('No image selected')}
        if(!isImage.test(fileInput.value.files[0].type)) {fileInput.value.value = '';return alert('Wrong filetype')}
        upload(fileInput.value.files[0])
        fileInput.value.value = ''
    
    }
</script>