import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '~/db/schema'

const sql = neon<boolean,boolean>(process.env.NEON_DB_URL)
// const db = drizzle(sql, {schema, logger: true})
const db = drizzle(sql, {schema})
export default db