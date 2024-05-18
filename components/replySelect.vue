<template>
    <div class="bg-white dark:bg-primaryBlack px-3 py-2 flex flex-col gap-4 absolute -bottom-2 translate-y-full drop-shadow-md rounded-xl w-64 z-10">
        <div class="flex flex-col text-xs gap-2">
            <span class="font-semibold text-primaryBlack dark:text-white">Who can reply?</span>
            <span class="font-normal font-noto-sans text-primaryGray">Choose who can reply to this Tweet.</span>
        </div>
        <PostAction :left="true" @click="$emit('select', 'everyone')">
            <Icon name="mdi:earth"/> 
            Everyone
        </PostAction>
        <PostAction :left="true" @click="$emit('select', 'followers')">
            <Icon name="material-symbols:group" /> 
            People you follow
        </PostAction>
        <!-- <SectionFragment>People you follow</SectionFragment> -->
    </div>
</template>

