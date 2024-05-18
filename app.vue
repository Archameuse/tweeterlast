<template>
  <div class="font-poppins font-medium bg-[#f2f2f2] dark:bg-[#121212] min-h-screen overflow-hidden">
    <MainHeader />
    <NuxtPage />
    <MainFooter>created by Mihail Divulin - devChallenges.io</MainFooter>
  </div>
</template>

<script setup lang="ts">
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `Tweeter - ${titleChunk}` : 'Tweeter'
  }
})
</script>

<style>
[data-mode="dark"] {
  color-scheme: dark;
}
[data-mode="light"] {
  color-scheme:light;
}
</style>