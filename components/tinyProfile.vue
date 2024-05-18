<template>
    <div class="flex flex-col gap-5">
        <div class="flex items-center w-full justify-between" >
            <div class="flex items-center gap-4">
                <div class="h-10">
                    <UserAvatar :image="user.image"/>
                </div>
                <div class="flex flex-col justify-between">
                    <span class="break-words">{{ getUserName(user) }}</span>
                    <span v-if="user.followers||user.followers===0" class="text-primaryGray dark:text-white font-noto-sans text-xs">{{ symbolFormatter(user.followers, 0) + ' Followers' }}</span>
                </div>
            </div>
            <div class="max-w-16">
                <FollowButton v-if="user.id&&loggedInUser?.id&&user.id!==loggedInUser.id" @response="follow" :profileId="user.id" :isFollowed="user.followed"/>
            </div>
        </div>
        <div v-if="user.status">
            <p class="font-noto-sans text-sm text-primaryGray dark:text-white">{{ user.status }}</p>
        </div>
        <div v-if="user.banner&&!nobanner" class="w-full aspect-[32/9] rounded-md shadow-sm overflow-hidden">
            <ImageComponent :image="user.banner"/>
        </div>
        <UnderlinedText :class="nobanner&&'!p-0'"></UnderlinedText>
    </div>
</template>

<script setup lang="ts">
    const {user:loggedInUser} = useUser()
    const props = defineProps({
        user: {
            type: Object as PropType<Profile>,
            required: true
        },
        nobanner: Boolean
        // avatar: String,
        // followers: Number,
        // banner: String,
        // followed: Boolean,
        // status: String,
        // id: Number,
        // name: {
        //     type: String,
        //     required: true
        // }
    })
    const follow = (status:boolean) => {
        if(status) props.user.followers++
        else props.user.followers--
    }
</script>