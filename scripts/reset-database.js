const { Pool } = require("pg")

async function resetDatabase() {
  const pool = new Pool({
    connectionString:
      process.env.DATABASE_URL || "postgresql://room_booking_user:password123@localhost:5432/room_booking_system",
  })

  try {
    console.log("🗑️  Resetting database...")

    // Drop all tables
    await pool.query("DROP TABLE IF EXISTS bookings CASCADE")
    await pool.query("DROP TABLE IF EXISTS rooms CASCADE")
    await pool.query("DROP TABLE IF EXISTS users CASCADE")

    console.log("✅ Tables dropped")
    console.log('🔄 Run "npm run setup-db" to recreate tables and data')
  } catch (error) {
    console.error("❌ Error resetting database:", error.message)
  } finally {
    await pool.end()
  }
}

resetDatabase()
