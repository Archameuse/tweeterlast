import { FetchError } from 'ofetch'

export default function() {
    // const user = useState<User|null>(() => null)
    const user = useState<User|null>('userState', () => null)
    const populateUser = async () => {
        const {data, error, status} = await useFetch('/api/user')
        const refresh = await $fetch('/api/user/refresh', {method: 'POST'})
        if(error.value) console.error(error.value.data)
        user.value = data.value
    // console.log(data.value)
        return data
    }
    const refreshUser = async () => {
        const data = await $fetch<User|null>('/api/user')
            .catch((e) => {console.error(e);return null})
        user.value = data
    }

    const signOut = async (to?:string) => {
        try{
            await $fetch('/api/user/signOut', {
                method: 'POST'
            })
            await Promise.all([refreshUser(), navigateTo(to||'/explore')])
            if(user.value) throw new Error()
            alert('You have been signed out')
        } catch(e) {
            alert('Something went wrong')
        }
    }
    const signIn = async (login:string|undefined, password:string|undefined, to?:string) => {
        if(!login || !password) return alert('No login or password provided')
        try{
            await $fetch('/api/user/signIn', {
                method: 'POST',
                body: {
                    login,
                    password
                }
            })
            await Promise.all([refreshUser(), navigateTo(to||'/')])
        } catch(e) {
            if(!(e instanceof FetchError)) {
                return
            } else {
                if(e.statusCode === 404) alert('Invalid email')
                if(e.statusCode === 403) alert('Invalid password')
            }
        }
    }
    const createUser = async (login:string|undefined, password:string|undefined, name:string|undefined, to?:string) => {
        if(!login || !password) return alert('No login or password provided')
        if(!name) return alert('Please enter a name')
        try {
            await $fetch('/api/user/create', {
                method: 'POST',
                body: {
                    login,
                    password,
                    name
                }
            })
            await Promise.all([populateUser(), navigateTo(to||'/')])
        } catch(e) {
            if(!(e instanceof FetchError)) {
                return console.error(e)
            } else {
                if(e.statusCode === 406) return alert('User already exists')
            }
        }
    }
    return {
        user,
        signOut,
        signIn,
        createUser,
        populateUser,
        refreshUser
    }
}