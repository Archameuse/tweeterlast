import { google } from "googleapis"
export const getDrive = async () => {
    const auth = new google.auth.GoogleAuth({
        credentials: JSON.parse(process.env.SERVICE_ACCOUNT),
        scopes: "https://www.googleapis.com/auth/drive",
      })
    const client = await auth.getClient()
    const drive = google.drive({version: 'v3', auth: auth})
    
    return drive
}