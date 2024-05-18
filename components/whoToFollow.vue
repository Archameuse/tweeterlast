<template>
    <div class="w-full px-5 py-3 bg-white dark:bg-primaryBlack rounded-xl shadow-sm flex flex-col gap-6">
        <UnderlinedText>Who to follow</UnderlinedText>
        <div class="flex flex-col gap-6">
            <TinyProfile v-for="user in users" :user="user" :name="getUserName(user)" 
            :avatar="user.image" :followers="user.followers" :banner="user.banner" :status="user.status" :id="user.id" 
            />
        </div>
    </div>
</template>

<script setup lang="ts">
    const {data:users} = await useFetch<Profile[]>('/api/user/popular')
</script>