export default (callback:Function, target:Ref<any>) => {
    
    if(!callback) return console.error('No callback provided for scroll event');
    const scrollY = ref<number>(0)
    const scroll = (e:Event) => {
        if(!target?.value) return
        if(target.value.wrapper) target.value = target.value.wrapper
        const el = target.value as HTMLElement
        if(scrollY.value === el.scrollTop) return
        scrollY.value = el.scrollTop
        const totalHeight = el.scrollHeight
        const currentHeight = el.scrollTop+el.clientHeight
        if(currentHeight >= totalHeight) callback()
    }
    onMounted(() => {
        if(target.value) {
            if(target.value?.wrapper) target.value = target.value?.wrapper
            target.value.addEventListener('scroll', scroll)
        }
    })
    onBeforeUnmount(() => {
        if(target.value?.wrapper) target.value = target.value?.wrapper
        if(target.value) target.value.removeEventListener('scroll',scroll)
    })
    return 
}