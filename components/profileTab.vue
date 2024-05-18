<template>
    <div class="bg-white dark:bg-primaryBlack h-full w-full rounded-2xl flex justify-between px-6 py-5 shadow-md">
        <div class="h-full aspect-square lg:relative lg:-top-14 border-4 border-white rounded-lg overflow-hidden">
            <ImageComponent :image="profile.image"/>
        </div>
        <div class="flex-grow flex flex-col ml-5 gap-9">
            <div class="flex text-xs font-semibold gap-8 items-center">
                <h1 class="text-xl">{{ profile.username }}</h1>
                <div class="flex gap-2 cursor-pointer" @click="showFollowedModal=true">
                    <span>{{ styledFollowing }}</span>
                    <span class="text-primaryGray dark:text-white font-medium">Following</span>
                </div>
                <div class="flex gap-2 cursor-pointer" @click="showFollowersModal=true">
                    <span>{{ styledFollowers }}</span>
                    <span class="text-primaryGray dark:text-white font-medium">Followers</span>
                </div>
            </div>
            <p class="max-w-md text-primaryGray dark:text-white text-lg font-medium" v-if="profile.status">{{ profile.status }}</p>
        </div>
        <div class="h-full flex flex-col justify-center" v-if="user && user.id!==profile.id">
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
    // export default defineNuxtComponent({
    //     props: {
    //         profile: Object as PropType<Profile>
    //     },
    //     computed: {
    //         styledFollowed() {
    //             const followed = this.followed
    //             if(followed >= 10000) return symbolFormatter(followed, 1)
    //             return followed.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    //         },
    //         styledFollowers() {
    //             const followers = this.followers
    //             if(followers >= 10000) return symbolFormatter(followers, 1)
    //             return followers.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    //         }
    //     }
    // })
</script>