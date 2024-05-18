<template>
    <NuxtLink class="h-full select-none cursor-pointer flex justify-center items-center font-semibold text-sm" :class="active ? 'border-b-2 border-solid border-primaryBlue text-primaryBlue' : 'text-primaryGray dark:text-white'">
        <slot></slot>
    </NuxtLink>
</template>

<script lang="ts">
    export default defineNuxtComponent({
        props: {
            active: {
                type: Boolean,
                default: false
            },
        }
    })
</script>