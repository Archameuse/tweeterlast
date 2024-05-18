import { getDrive } from '~/server/utils/drive'
import { Readable } from 'stream'

export default defineEventHandler(async event => {
    const foldersId = {
      post: process.env.FOLDER_POST,
      avatar: process.env.FOLDER_AVATAR,
      banner: process.env.FOLDER_BANNER
    }
    const formData = await readFormData(event)
    const image = formData.get('image') as File
    const folder = formData.get('folder') as 'post'|'avatar'|'banner'
    if(!Object.hasOwn(foldersId,folder)) throw createError('No folder provided')
    if(!image) throw createError('No image provided')
    const imageReadable = Readable.from(Buffer.from(await image.arrayBuffer()))
    if(!imageReadable) throw createError('Error reading image')
    try{
      const folderId = foldersId[folder]
      const name = new Date().toLocaleString().replaceAll('/','-').replaceAll(':','-').replaceAll(',','').replaceAll(' ','_')+'.webp'
      const drive = await getDrive()
      const {data} = await drive.files.create({
          requestBody: {
              name,
              parents: [folderId]
          },
          media: {
              mimeType: 'image/webp',
              body: imageReadable
          },
          fields: 'id'
      })
      if(!data.id) throw createError('No id to return')
      return data.id
    } catch(e) {
      throw createError('Unknown error')
    }
})