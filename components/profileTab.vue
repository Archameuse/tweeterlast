<template>
    <div class="bg-white dark:bg-primaryBlack h-full w-full rounded-2xl flex shadow-md px-6 py-4">
        <div class="min-h-16 min-w-16 max-h-16 max-w-16 sm:min-w-32 sm:min-h-32 sm:max-h-32 sm:max-w-32 lg:relative lg:-top-14 border-4 border-white rounded-lg overflow-hidden flex-grow">
            <ImageComponent :image="profile.image"/>
        </div>
        <div class="flex flex-col ml-5 gap-4 justify-center items-center">
            <div class="flex flex-wrap w-full text-xs font-semibold items-center gap-2">
                <h1 class="text-xl pr-6">{{ profile.username }}</h1>
                <div class="flex flex-wrap gap-2 justify-start">
                    <div class="flex gap-2 cursor-pointer pr-2" @click="showFollowedModal=true">
                        <span>{{ styledFollowing }}</span>
                        <span class="text-primaryGray dark:text-white font-medium">Following</span>
                    </div>
                    <div class="flex gap-2 cursor-pointer" @click="showFollowersModal=true">
                        <span>{{ styledFollowers }}</span>
                        <span class="text-primaryGray dark:text-white font-medium">Followers</span>
                    </div>
                </div>
            </div>
            <p v-if="profile.status" class="w-full text-primaryGray dark:text-white sm:text-lg sm:font-medium [word-break:break-word]">{{ profile.status }}</p>
        </div>
        <div class="ml-5 mt-4 w-20 sm:w-auto" v-if="user && user.id!==profile.id">
            <FollowButton @response="follow" :profileId="profile.id" :isFollowed="profile.followed"/>
        </div>
        <FollowersModal :profile="profile" v-if="showFollowersModal" @close-modal="showFollowersModal=false"/>
        <FollowsModal :profile="profile" v-if="showFollowedModal" @close-modal="showFollowedModal=false"/>
    </div>
</template>

<script setup lang="ts">
    const props = defineProps({
        profile: {
            type: Object as PropType<Profile>,
            required: true
        }
    })
    const showFollowersModal = ref<boolean>(false)
    const showFollowedModal = ref<boolean>(false)
    const {user} = useUser()
    const follow = (status:boolean) => {
        if(status) props.profile.followers++
        else props.profile.followers--
    }
    const styledFollowing = computed(() => {
        const followed = props.profile.following||0
        if(followed >= 10000) return symbolFormatter(followed, 1)
        return followed.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    })
    const styledFollowers = computed(() => {
        const followers = props.profile.followers||0
        if(followers >= 10000) return symbolFormatter(followers, 1)
        return followers.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    })
</script>