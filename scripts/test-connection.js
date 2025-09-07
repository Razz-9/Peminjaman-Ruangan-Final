const { Pool } = require("pg")

async function testConnection() {
  const pool = new Pool({
    connectionString:
      process.env.DATABASE_URL || "postgresql://room_booking_user:password123@localhost:5432/room_booking_system",
  })

  try {
    console.log("🔍 Testing database connection...")

    // Test basic connection
    const client = await pool.connect()
    console.log("✅ Database connection successful")

    // Test tables exist
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `)

    console.log(
      "📋 Tables found:",
      tablesResult.rows.map((row) => row.table_name),
    )

    // Test data
    const roomsResult = await client.query("SELECT COUNT(*) FROM rooms")
    const bookingsResult = await client.query("SELECT COUNT(*) FROM bookings")
    const usersResult = await client.query("SELECT COUNT(*) FROM users")

    console.log("📊 Data counts:")
    console.log(`   Rooms: ${roomsResult.rows[0].count}`)
    console.log(`   Bookings: ${bookingsResult.rows[0].count}`)
    console.log(`   Users: ${usersResult.rows[0].count}`)

    client.release()
    console.log("🎉 Database test completed successfully!")
  } catch (error) {
    console.error("❌ Database connection failed:", error.message)
    console.log("")
    console.log("💡 Troubleshooting tips:")
    console.log("   1. Make sure PostgreSQL is running")
    console.log("   2. Check your DATABASE_URL in .env.local")
    console.log("   3. Run: npm run setup-db")
  } finally {
    await pool.end()
  }
}

testConnection()
