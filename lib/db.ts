import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.NEON_DATABASE_URL!)

export default {
  query: async (text: string, params: any[] = []) => {
    try {
      return await sql(text, params)
    } catch (error) {
      console.error("Database query error:", error)
      throw error
    }
  },
}
