import { Client, Pool } from "pg"

// Database configuration
const config = {
  host: "localhost", // alamat database (biasanya localhost kalo lokal)
  port: 5434, // port Postgres default
  user: "pelni_user", // user dari docker env kamu
  password: "Pelni2025", // password sesuai docker env
  database: "pelni_booking", // nama database yang dibuat di docker env
}

// Use Pool for better connection management
const pool = new Pool(config)

// Single client for one-time operations
const client = new Client(config)

// Test connection function
async function testConnection(): Promise<boolean> {
  try {
    await client.connect()
    console.log("✅ Connected to PostgreSQL database")
    const result = await client.query("SELECT NOW()")
    console.log("🕐 Server time:", result.rows[0].now)
    await client.end()
    return true
  } catch (err: any) {
    console.error("❌ Connection error:", err.message)
    return false
  }
}

export default pool

export { pool, testConnection }
export const createClient = () => new Client(config)
