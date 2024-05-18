<template>
    <div class="h-full aspect-square rounded-md border border-black dark:border-white overflow-hidden">
        <img :src="avatar" draggable="false" class="h-full w-full select-none object-cover object-center">
    </div>
</template>

<script lang="ts">
    export default defineNuxtComponent({
        props: {
            image: String
        },
        computed: {
            avatar() {
                return this.$props.image||'/noprofile.svg'
            }
        }
    })
</script>