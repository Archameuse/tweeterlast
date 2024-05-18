<template>
    <div class="flex gap-3 items-center">
        <div class="h-8">
            <UserAvatar :image="user?.image"/>
        </div>
        <span v-if="user" class="text-xs dark:text-white max-w-48 overflow-ellipsis overflow-hidden font-bold whitespace-nowrap">{{ getUserName(user) }}</span>
    </div>
</template>

<script setup lang="ts">
    const {user} = useUser()
</script>