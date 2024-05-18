<template>
    <nav class="bg-white select-none dark:bg-primaryBlack w-full h-16 flex justify-evenly items-center gap-4 relative">
        <NuxtLink :to="user ? '/' : '/explore'" class="h-8 w-32 min-w-8 bg-contain bg-no-repeat bg-center bg-[url('public/tweeter-small.svg')] md:bg-[url('public/tweeter.svg')] md:dark:bg-[url('public/tweeter-light.svg')] ">
            <span class="sr-only">Tweeter logo</span>
        </NuxtLink>
        <ul id="navbar" class="hidden sm:flex items-center justify-evenly h-full w-full max-w-80 gap-4">
            <button @click="setTheme" class="cursor-pointer text-primaryGray dark:text-white">
                <Icon name="material-symbols:light-mode" class="!hidden dark:!block"/>
                <Icon name="material-symbols:dark-mode" class="dark:!hidden"/>
                <span class="sr-only">Toggle theme</span>
            </button>
            <!-- <button @click="setTheme" class="flex text-center justify-center items-center h-full dark:before:content-['Dark'] before:content-['Light'] before:text-primaryGray before:font-semibold before:dark:text-white cursor-pointer">
                <span class="sr-only">Toggle theme</span>
            </button> -->
            <template v-if="user">
                <MainHeaderButton to="/" :active="isHome">Home</MainHeaderButton >
                <MainHeaderButton to="/explore" :active="isExplore">Explore</MainHeaderButton >
                <MainHeaderButton to="/bookmarks" :active="isBookmarks">Bookmarks</MainHeaderButton >
            </template>
        </ul>
        <div class="min-w-32 h-full flex items-center justify-center relative group">
            <MainHeaderProfile v-if="user" :user="user"/>
            <div v-if="user" class="absolute z-30 top-full w-full h-0 overflow-clip group-hover:h-20 flex flex-col bg-white dark:bg-primaryBlack transition-[height]">
                <button @click="async () => await signOut()" class="h-full w-full dark:text-white hover:bg-[#E2E7E9] dark:hover:bg-[#898c8d] active:bg-[#c0c5c7] dark:active:bg-[#5a5b5c]">Sign-out</button>
                <NuxtLink to="/settings" class="h-full w-full text-center flex items-center justify-center dark:text-white hover:bg-[#E2E7E9] dark:hover:bg-[#898c8d] active:bg-[#c0c5c7] dark:active:bg-[#5a5b5c]">Settings</NuxtLink>
            </div>
            <NuxtLink to="/signIn" v-else>
                <ActionButton>Login</ActionButton>
            </NuxtLink>
        </div>
        <button @click="expand" class="sm:hidden h-full min-w-6" data-collapse-toggle="navbar" aria-controls="navbar" aria-expanded="false">
            <Icon class="h-full w-6 text-black dark:text-white" name="material-symbols:menu"/>
        </button>
        <aside @pointerdown="expanded=false" class="absolute z-20 sm:hidden dark:text-white font-medium top-full left-0 h-[calc(100vh-4rem)] " :class="expanded ? 'w-screen' : 'w-0'">
            <div @pointerdown.stop class="transition-[width] overflow-clip text-nowrap h-full bg-white dark:bg-primaryBlack" :class="expanded ? 'w-40' : 'w-0'">
                <template v-if="user">            
                    <li :class="isHome && 'bg-zinc-400'" class="w-full flex h-10 items-center hover:bg-[#E2E7E9] active:bg-[#c0c5c7] dark:!bg-opacity-20">
                        <NuxtLink  class="w-full pl-4" to="/">Home</NuxtLink>
                    </li>
                    <li :class="isExplore && 'bg-zinc-400'" class="w-full flex h-10 items-center hover:bg-[#E2E7E9] active:bg-[#c0c5c7] dark:!bg-opacity-20">
                        <NuxtLink  class="w-full pl-4" to="/explore">Explore</NuxtLink>
                    </li>
                    <li :class="isBookmarks && 'bg-zinc-400'" class="w-full flex h-10 items-center hover:bg-[#E2E7E9] active:bg-[#c0c5c7] dark:!bg-opacity-20">
                        <NuxtLink class="w-full pl-4" to="/bookmarks">Bookmarks</NuxtLink>
                    </li>
                </template>
                    <li @click="setTheme" class="w-full flex h-10 items-center hover:bg-[#E2E7E9] active:bg-[#c0c5c7] dark:!bg-opacity-20 dark:before:content-['Dark_theme'] before:content-['Light_theme'] pl-4 cursor-pointer">
                        <span class="sr-only">Toggle theme</span>
                    </li>
            </div>
        </aside>
    </nav>
</template>

<script setup lang="ts">
    const {user, signOut} = useUser()  
    const route = useRoute()
    const isHome = computed(() => route.fullPath === '/')
    const isExplore = computed(() => route.fullPath === '/explore')
    const isBookmarks = computed(() => route.fullPath === '/bookmarks')
    const expanded = ref<boolean>(false)
    const expand = (e:Event) => {
        const target = e.currentTarget as HTMLButtonElement
        expanded.value = !expanded.value
        target.ariaExpanded = String(expanded.value)
    }
    const setTheme = () => {
        if(document.documentElement.getAttribute('data-mode') === 'dark') {
            localStorage.setItem('theme','light')
            document.documentElement.setAttribute('data-mode', 'light')
        } else {
            localStorage.setItem('theme','dark')
            document.documentElement.setAttribute('data-mode', 'dark')
        }
    } 
</script>