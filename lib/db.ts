import { Pool } from "pg"

const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL,
})

export default {
  query: (text, params) => pool.query(text, params),
}

