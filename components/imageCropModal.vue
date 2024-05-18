<template>
    <ModalMain @close-modal="closeModal" v-if="imgWidth&&imgHeight">
        <div class="flex flex-col gap-4 w-full">
            <div ref="wrapper" class="relative touch-none">
                <ImageComponent :src="src"/>
                <div class="absolute w-full h-full top-0 left-0 bg-black opacity-50"></div>
                <div ref="frame" class="absolute aspect-square top-0 left-0 bg-red-500 opacity-80 w-20">
                    <div @touchstart="drag" @mousedown="drag" class="cursor-move h-full w-full absolute top-0 left-0"></div>
                    <hr  @touchstart="resizeL" @mousedown="resizeL" class="cursor-ew-resize absolute top-0 left-0 h-full w-2 border-x border-y border-dashed">
                    <hr  @touchstart="resizeR" @mousedown="resizeR" class="cursor-ew-resize absolute top-0 right-0 h-full w-2 border-x border-y border-dashed">
                    <hr  @touchstart="resizeT" @mousedown="resizeT" class="cursor-ns-resize absolute top-0 left-0 h-2 w-full border-x border-y border-dashed">
                    <hr  @touchstart="resizeB" @mousedown="resizeB" class="cursor-ns-resize absolute bottom-0 h-2 w-full border-x border-y border-dashed">
                </div>
            </div>
            <div class="pb-4 w-full flex justify-between px-8">                    
                <button @click="$emit('closeModal')" class="inline-block rounded bg-primaryBlue px-6 py-2 text-xs font-medium uppercase leading-normal text-white shadow-sm transition duration-150 ease-in-out hover:bg-secondaryBlue hover:shadow-md focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:opacity-80 active:shadow-sm active:transition-none">Discard</button>
                <button @click="crop" class="inline-block rounded bg-primaryBlue px-6 py-2 text-xs font-medium uppercase leading-normal text-white shadow-sm transition duration-150 ease-in-out hover:bg-secondaryBlue hover:shadow-md focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:opacity-80 active:shadow-sm active:transition-none">Accept</button>
            </div>
        </div>
    </ModalMain>
</template>
    
<script setup lang="ts">
    const props = defineProps({
        src: {
            type: String,
            required: true
        },
    })
    const imgWidth = ref<number>(1)
    const imgHeight = ref<number>(1)
    const frame = ref<HTMLDivElement>()
    const wrapper = ref<HTMLDivElement>()
    const minSize = 64
    onMounted(async () => {
        const status = await new Promise<boolean>(resolve => {
            const img = new Image()
            img.onload = () => {
                [imgWidth.value,imgHeight.value] = [img.width,img.height]                
                resolve(true)
            }
            img.onerror = () => {
                console.log('error')
                resolve(false)
            }
            img.src = props.src
        })
        window.addEventListener('resize', onResize)
        if(!status) console.log('error')
    })
    onBeforeUnmount(() => {
        window.removeEventListener('resize', onResize)
    })
    function onResize() {
        if(!frame.value) return
        frame.value.style.top = '0px'
        frame.value.style.left = '0px'
        frame.value.style.width = '5rem'
    }
    
    const layout = computed(() => {
        if((imgWidth.value&&imgHeight.value)&&(imgWidth.value < imgHeight.value)) return 'w-full'
        else return 'h-full'
    })
    const emit = defineEmits<{
        closeModal: [src: File|void]
    }>()

    const closeModal = () => {
        emit('closeModal')
    }

    const crop = async () => {
        if(!frame.value) return console.log('error')
        if(!wrapper.value) return console.log('error')
        const ratioX = imgWidth.value/wrapper.value.clientWidth 
        const ratioY = imgHeight.value/wrapper.value.clientHeight
        const top = frame.value.offsetTop * ratioY
        const left = frame.value.offsetLeft * ratioX
        const width = frame.value.clientWidth * ratioX
        const height = frame.value.clientHeight * ratioY
        const image = new Image()
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx?.clearRect(0,0,9999,9999)
        await new Promise<void>(resolve => {
            image.onload = () => resolve()
            image.src = props.src
        })
        ctx?.drawImage(
            image,
            left,top,width,height,0,0,width,height
        )
        canvas.toBlob((blob) => {
            if(!blob) return null
            emit('closeModal',new File([blob],'CroppedImage.webp'))
        })
        
    }

    const drag = (e:MouseEvent|TouchEvent) => {
        if(!frame.value) return
        if(!wrapper.value) return
        let left:number
        let top:number

        const move = (e:MouseEvent|TouchEvent) => {
            if(!frame.value) return
            if(!wrapper.value) return
            const bounds = wrapper.value.getBoundingClientRect()
            let x:number = 0
            let y:number = 0
            if(e instanceof MouseEvent) {
                x = e.clientX - bounds.left - left
                y = e.clientY - bounds.top - top
            } else {
                for(let target of e.targetTouches) {
                    x = target.clientX - bounds.left - left
                    y = target.clientY - bounds.top - top
                }
            }
            if(x < 0) x = 0
            if(x > wrapper.value.clientWidth-frame.value.clientWidth) x = wrapper.value.clientWidth-frame.value.clientWidth
            if(y < 0) y = 0
            if(y > wrapper.value.clientHeight-frame.value.clientHeight) y = wrapper.value.clientHeight-frame.value.clientHeight
            frame.value.style.left = x + 'px'
            frame.value.style.top =  y + 'px'
        }
        if(e instanceof MouseEvent) {
            const clean = (e:MouseEvent) => {
                window.removeEventListener('mousemove', move)
                window.removeEventListener('mouseup', clean)
            }
            left = e.offsetX; top=e.offsetY
            window.addEventListener('mousemove', move)
            window.addEventListener('mouseup', clean)
        }
        else {
            const clean = (e:TouchEvent) => {
                window.removeEventListener('touchmove', move)
                window.removeEventListener('touchend', clean)
            }
            for(let target of e.targetTouches) {
                //@ts-ignore
                const rect = e.target?.getBoundingClientRect()
                left = target.clientX - window.pageXOffset - rect.left + window.scrollX
                top = target.clientY - window.pageYOffset - rect.top + window.scrollY
            }
            window.addEventListener('touchmove', move)
            window.addEventListener('touchend', clean)

        }

    }
    const resizeR = (e:MouseEvent|TouchEvent) => {
        if(!frame.value) return
        const og_width = frame.value.clientWidth
        const og_mouseX = e instanceof MouseEvent ? e.pageX : e.targetTouches[0].pageX
        const og_top = frame.value.offsetTop
        const move = (e:MouseEvent|TouchEvent) => {
            if(!frame.value) return
            if(!wrapper.value) return
            const left = frame.value.offsetLeft
            let width = og_width - og_mouseX + (e instanceof MouseEvent ? e.pageX : e.targetTouches[0].pageX)
            const topDiff = og_top-(width-og_width)
            const leftMax = wrapper.value.clientWidth-left
            if(width < minSize) width=minSize
            if(topDiff<0) width+=topDiff
            if(width>leftMax) width=Math.min(width,leftMax)
            let y = og_top-(width-og_width)
            frame.value.style.width = width+'px'
            frame.value.style.top = y+'px'
        }
        if(e instanceof MouseEvent) {
            const clean = () => {
                window.removeEventListener('mousemove', move)
                window.removeEventListener('mouseup', clean)
            }
            window.addEventListener('mousemove', move)
            window.addEventListener('mouseup', clean)
        } else {
            const clean = () => {
                window.removeEventListener('touchmove', move)
                window.removeEventListener('touchend', clean)
            }
            window.addEventListener('touchmove', move)
            window.addEventListener('touchend', clean)

        }
    }
    const resizeL = (e:MouseEvent|TouchEvent) => {
        if(!frame.value) return
        const og_width = frame.value.clientWidth
        const og_mouseX = e instanceof MouseEvent ? e.pageX : e.targetTouches[0].pageX
        const og_left = frame.value.offsetLeft
        const move = (e:MouseEvent|TouchEvent) => {
            if(!frame.value) return
            if(!wrapper.value) return
            const top = frame.value.offsetTop
            let width = og_width + og_mouseX - (e instanceof MouseEvent ? e.pageX : e.targetTouches[0].pageX)
            const leftDiff = og_left-(width-og_width)
            const topMax = wrapper.value.clientHeight-top
            if(width < minSize) width = minSize
            if(leftDiff<0) width+=leftDiff
            if(width > topMax) width = Math.min(width,topMax)
            let x = og_left-(width-og_width)
            frame.value.style.width = width+'px'
            frame.value.style.left = Math.ceil(x)+'px'
        }
        if(e instanceof MouseEvent) {
            const clean = () => {
                window.removeEventListener('mousemove', move)
                window.removeEventListener('mouseup', clean)
            }
            window.addEventListener('mousemove', move)
            window.addEventListener('mouseup', clean)
        } else {
            const clean = () => {
                window.removeEventListener('touchmove', move)
                window.removeEventListener('touchend', clean)
            }
            window.addEventListener('touchmove', move)
            window.addEventListener('touchend', clean)
        }
    }
    const resizeT = (e:MouseEvent|TouchEvent) => {
        if(!frame.value) return
        const og_height = frame.value.clientHeight
        const og_left = frame.value.offsetLeft
        const og_top = frame.value.offsetTop
        const og_mouseY = e instanceof MouseEvent ? e.pageY : e.targetTouches[0].pageY
        const move = (e:MouseEvent|TouchEvent) => {
            if(!frame.value) return
            if(!wrapper.value) return
            let height = og_height + og_mouseY - (e instanceof MouseEvent ? e.pageY : e.targetTouches[0].pageY)
            const topDiff = og_top-(height-og_height)
            const leftDiff = og_left-(height-og_height)
            if(height < minSize) height = minSize
            if(topDiff < 0 || leftDiff < 0) height+=leftDiff<topDiff ? leftDiff : topDiff
            let y = og_top-(height-og_height)
            let x = og_left-(height-og_height)
            frame.value.style.width = height+'px'
            frame.value.style.top = y+'px'
            frame.value.style.left = x+'px'
        }
        if(e instanceof MouseEvent) {
            const clean = () => {
                window.removeEventListener('mousemove', move)
                window.removeEventListener('mouseup', clean)
            }
            window.addEventListener('mousemove', move)
            window.addEventListener('mouseup', clean)
        } else {
            const clean = () => {
                window.removeEventListener('touchmove', move)
                window.removeEventListener('touchend', clean)
            }
            window.addEventListener('touchmove', move)
            window.addEventListener('touchend', clean)
        }
    }
    const resizeB = (e:MouseEvent|TouchEvent) => {
        if(!frame.value) return
        const og_height = frame.value.clientHeight
        const og_mouseY = e instanceof MouseEvent ? e.pageY : e.targetTouches[0].pageY
        const move = (e:MouseEvent|TouchEvent) => {
            if(!frame.value) return
            if(!wrapper.value) return
            const left = frame.value.offsetLeft
            const top = frame.value.offsetTop
            let height = og_height - og_mouseY + (e instanceof MouseEvent ? e.pageY : e.targetTouches[0].pageY)
            if(height > wrapper.value.clientWidth-left) height = wrapper.value.clientWidth-left
            if(height > wrapper.value.clientHeight-top) height = wrapper.value.clientHeight-top
            if(height < minSize) height = minSize
            frame.value.style.width = height+'px'
        }
        if(e instanceof MouseEvent) {
            const clean = () => {
                window.removeEventListener('mousemove', move)
                window.removeEventListener('mouseup', clean)
            }
            window.addEventListener('mousemove', move)
            window.addEventListener('mouseup', clean)
        } else {
            const clean = () => {
                window.removeEventListener('touchmove', move)
                window.removeEventListener('touchend', clean)
            }
            window.addEventListener('touchmove', move)
            window.addEventListener('touchend', clean)
        }
    }
</script>