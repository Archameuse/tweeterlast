<template>
    <div class="h-full aspect-square cursor-pointer text-primaryBlue hover:text-secondaryBlue active:text-thirdaryBlue">
        <Icon size="100%" :name="name"/>
    </div>
</template>

<script lang="ts">
    export default defineNuxtComponent({
        props: {
            name: {
                type: String,
                default: 'ic:outline-image'
            }
        }
    })
</script>