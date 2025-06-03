import { Pool } from "pg"

let pool: Pool

if (process.env.NODE_ENV === "production") {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL, // EasyPanel will provide this
    // ssl: {
    //   rejectUnauthorized: false, // Adjust SSL for your Docker setup if needed
    // },
  })
} else {
  // Development: use specific variables
  pool = new Pool({
    host: process.env.DB_HOST,
    port: Number.parseInt(process.env.DB_PORT || "5432", 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  })
}

export default {
  query: async (text: string, params: any[] = []) => {
    const start = Date.now()
    try {
      const res = await pool.query(text, params)
      const duration = Date.now() - start
      console.log("executed query", { text, duration, rows: res.rowCount })
      return res
    } catch (error) {
      console.error("Error executing query", { text, error })
      throw error
    }
  },
  getClient: async () => {
    const client = await pool.connect()
    const query = client.query
    const release = client.release
    // monkey patch the query method to keep track of the last query
    client.query = (...args) => {
      // @ts-ignore
      client.lastQuery = args
      // @ts-ignore
      return query.apply(client, args)
    }
    client.release = () => {
      // @ts-ignore
      console.log("Releasing client", client.lastQuery)
      // @ts-ignore
      delete client.lastQuery
      // @ts-ignore
      return release.apply(client)
    }
    return client
  },
}
