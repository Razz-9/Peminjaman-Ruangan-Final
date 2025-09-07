const { pool, client, testConnection } = require("../lib/db")

async function checkDatabase() {
  let dbClient

  try {
    console.log("🔍 Checking PELNI Room Booking Database...")
    console.log("=========================================")

    // Test connection
    console.log("1. Testing database connection...")
    const isConnected = await testConnection()

    if (!isConnected) {
      console.log("❌ Cannot connect to database")
      console.log("")
      console.log("🔧 Troubleshooting steps:")
      console.log("1. Make sure PostgreSQL is running")
      console.log("2. Check Docker: docker ps")
      console.log("3. Start PostgreSQL: docker-compose up -d")
      console.log("4. Check credentials in .env.local")
      return
    }

    dbClient = client()
    await dbClient.connect()

    console.log("2. Checking database structure...")

    // Check if tables exist
    const tablesResult = await dbClient.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `)

    console.log("📋 Tables in database:")
    if (tablesResult.rows.length === 0) {
      console.log("   ❌ No tables found! Run: node scripts/setup-database.js")
    } else {
      tablesResult.rows.forEach((row) => {
        console.log(`   ✅ ${row.table_name}`)
      })
    }

    if (tablesResult.rows.length > 0) {
      console.log("")
      console.log("3. Checking data...")

      try {
        const roomsCount = await dbClient.query("SELECT COUNT(*) FROM rooms WHERE is_active = true")
        const bookingsCount = await dbClient.query("SELECT COUNT(*) FROM bookings")
        const adminsCount = await dbClient.query("SELECT COUNT(*) FROM admins")

        console.log("📊 Data Summary:")
        console.log(`   - Active Rooms: ${roomsCount.rows[0].count}`)
        console.log(`   - Total Bookings: ${bookingsCount.rows[0].count}`)
        console.log(`   - Admin Users: ${adminsCount.rows[0].count}`)

        // Show sample data
        if (Number.parseInt(roomsCount.rows[0].count) > 0) {
          console.log("")
          console.log("🏢 Sample Rooms:")
          const sampleRooms = await dbClient.query(
            "SELECT name, capacity, floor FROM rooms WHERE is_active = true LIMIT 3",
          )
          sampleRooms.rows.forEach((room) => {
            console.log(`   - ${room.name} (${room.capacity}, ${room.floor})`)
          })
        }

        if (Number.parseInt(bookingsCount.rows[0].count) > 0) {
          console.log("")
          console.log("📅 Recent Bookings:")
          const recentBookings = await dbClient.query(`
            SELECT b.name, r.name as room_name, b.booking_date, b.status 
            FROM bookings b 
            JOIN rooms r ON b.room_id = r.id 
            ORDER BY b.created_at DESC 
            LIMIT 3
          `)
          recentBookings.rows.forEach((booking) => {
            console.log(`   - ${booking.name} → ${booking.room_name} (${booking.booking_date}) [${booking.status}]`)
          })
        }

        console.log("")
        console.log("✅ Database is healthy and ready to use!")
      } catch (dataError) {
        console.log("⚠️  Tables exist but there might be data issues:")
        console.log("   Error:", dataError.message)
        console.log("   Try running: node scripts/setup-database.js")
      }
    }
  } catch (error) {
    console.error("❌ Database check failed:", error.message)

    if (error.code === "ECONNREFUSED") {
      console.log("")
      console.log("🔧 Connection refused - PostgreSQL is not running")
      console.log("Solutions:")
      console.log("1. Start with Docker: docker-compose up -d")
      console.log("2. Check status: docker ps")
      console.log("3. Or start local PostgreSQL service")
    } else if (error.code === "3D000") {
      console.log("")
      console.log("🔧 Database does not exist")
      console.log("Solutions:")
      console.log("1. Run: node scripts/create-database.js")
      console.log("2. Then: node scripts/setup-database.js")
    } else if (error.code === "28P01") {
      console.log("")
      console.log("🔧 Authentication failed")
      console.log("Check your credentials in lib/db.js:")
      console.log("- user: pelni_user")
      console.log("- password: Pelni2025")
      console.log("- database: pelni_booking")
    }
  } finally {
    if (dbClient) {
      await dbClient.end()
    }
  }
}

// Run check if this file is executed directly
if (require.main === module) {
  checkDatabase()
}

module.exports = { checkDatabase }
