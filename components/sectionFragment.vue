<template>
    <div class="h-8 flex items-center font-semibold text-sm relative px-5 cursor-pointer select-none" :class="active ? 'text-primaryBlue dark:brightness-150 before:w-1 before:h-full before:bg-primaryBlue before:absolute before:left-0 before:rounded-r-md' : 'text-primaryGray dark:text-white'">
        <slot></slot>
    </div>
</template>

<script lang="ts">
    export default defineNuxtComponent({
        props: {
            active: Boolean
        }
    })
</script>