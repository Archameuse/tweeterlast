// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  pages:true,
  modules: ["@nuxtjs/tailwindcss", "nuxt-icon"],
  typescript: { strict: true }, 
  routeRules: {
    '/home': {redirect: '/'}
  },
  app: {
    head: {
      script: [{children: `
        if(localStorage.getItem('theme')==='dark') document.documentElement.setAttribute('data-mode', 'dark')
      `}]
    }
  }
})