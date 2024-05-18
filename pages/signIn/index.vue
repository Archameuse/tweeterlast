<template>
    <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">{{status ? 'Sign in to your account' : 'Register new account'}}</h2>
      </div>
  
      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form @submit.prevent="formEvent" class="space-y-6" action="#" method="POST">
          <div>
            <label for="email" class="block text-sm font-medium leading-6 text-gray-900 dark:text-white">Email address</label>
            <div class="mt-2">
              <input ref="login" id="email" name="email" type="email" autocomplete="email" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
            </div>
          </div>

          <div v-if="!status">
            <label for="name" class="block text-sm font-medium leading-6 text-gray-900 dark:text-white">User name</label>
            <div class="mt-2">
              <input ref="name" id="name" name="name" type="text" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
            </div>
          </div>
  
          <div>
            <div class="flex items-center justify-between">
              <label for="password" class="block text-sm font-medium leading-6 text-gray-900 dark:text-white">Password</label>
            </div>
            <div class="mt-2">
              <input ref="password" id="password" name="password" type="password" autocomplete="current-password" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
            </div>
          </div>
  
          <div v-if="status">
            <button ref="signButton" type="submit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign in</button>
          </div>
          <div v-else>
            <button ref="createButton" type="submit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Create user</button>
          </div>

          <div> Or 
            <button @click="changeStatus" type="button" class="text-blue-500 underline select-none hover:text-blue-700 active:text-blue-900">{{status ? 'register' : 'sign in'}}</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
    definePageMeta({
        middleware: ['restric-authed']
    })
    const previous = useRouter().options.history.state.back
    const {user, signIn, createUser} = useUser()
    const status = ref<boolean>(true)
    const changeStatus = () => {
        status.value = !status.value
    }
    const login = ref<HTMLInputElement>()
    const password = ref<HTMLInputElement>()
    const name = ref<HTMLInputElement>()
    const signButton = ref<HTMLButtonElement>()
    const createButton = ref<HTMLButtonElement>()
    const formEvent = async (e:Event) => {
      const event = e as SubmitEvent
      const loginData = login.value?.value
      const passwordData = password.value?.value
      const nameData = name.value?.value
      // if(event.target )
      if(event.submitter === signButton.value) {
        await signIn(loginData, passwordData, previous ? String(previous) : undefined)
      } else if(event.submitter === createButton.value) {
        await createUser(loginData, passwordData, nameData)
      }
    }
  </script>