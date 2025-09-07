const { pool, client, testConnection } = require("../lib/db")
const bcrypt = require("bcryptjs")

// Sample data dari localStorage yang biasanya ada
const defaultLocalStorageData = {
  rooms: [
    {
      id: "550e8400-e29b-41d4-a716-446655440001",
      name: "Lambelu Lt.1 TI",
      capacity: "10 orang",
      floor: "Lantai 1",
      amenities: ["TV", "Proyektor", "Meja"],
      description: "Ruangan meeting dengan fasilitas lengkap untuk keperluan TI dan presentasi.",
      image: "/placeholder.svg?height=200&width=300",
      isActive: true,
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440002",
      name: "Leuser Lt.1 Pengamanan",
      capacity: "10 orang",
      floor: "Lantai 1",
      amenities: ["TV", "Proyektor", "Meja", "AC"],
      description: "Ruangan meeting untuk keperluan pengamanan dengan fasilitas AC dan multimedia.",
      image: "/placeholder.svg?height=200&width=300",
      isActive: true,
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440003",
      name: "Awu Lt.3",
      capacity: "10 orang",
      floor: "Lantai 3",
      amenities: ["TV", "Proyektor", "Meja", "AC"],
      description: "Ruangan meeting di lantai 3 dengan pemandangan yang baik dan fasilitas lengkap.",
      image: "/placeholder.svg?height=200&width=300",
      isActive: true,
    },
  ],
  bookings: [
    {
      id: "booking-1",
      roomId: "550e8400-e29b-41d4-a716-446655440001",
      name: "Jane Cooper",
      phone: "081234567890",
      unitKerja: "TI",
      bookingDate: "2025-01-15",
      startTime: "10:00",
      endTime: "12:00",
      status: "approved",
      createdAt: "2025-01-10T10:00:00.000Z",
    },
    {
      id: "booking-2",
      roomId: "550e8400-e29b-41d4-a716-446655440002",
      name: "Floyd Miles",
      phone: "081234567891",
      unitKerja: "Umum",
      bookingDate: "2025-01-18",
      startTime: "14:00",
      endTime: "16:00",
      status: "pending",
      createdAt: "2025-01-12T14:00:00.000Z",
    },
    {
      id: "booking-3",
      roomId: "550e8400-e29b-41d4-a716-446655440003",
      name: "Ronald Richards",
      phone: "081234567892",
      unitKerja: "SDM",
      bookingDate: "2025-01-19",
      startTime: "10:00",
      endTime: "12:30",
      status: "rejected",
      rejectionReason: "Ruangan sedang dalam perbaikan pada tanggal tersebut",
      createdAt: "2025-01-13T10:00:00.000Z",
    },
    {
      id: "booking-4",
      roomId: "550e8400-e29b-41d4-a716-446655440001",
      name: "Darlene Robertson",
      phone: "081234567893",
      unitKerja: "Marketing",
      bookingDate: "2025-01-20",
      startTime: "09:00",
      endTime: "11:00",
      status: "approved",
      createdAt: "2025-01-14T09:00:00.000Z",
    },
    {
      id: "booking-5",
      roomId: "550e8400-e29b-41d4-a716-446655440002",
      name: "Courtney Henry",
      phone: "081234567894",
      unitKerja: "Finance",
      bookingDate: "2025-01-21",
      startTime: "13:00",
      endTime: "15:00",
      status: "active",
      createdAt: "2025-01-15T13:00:00.000Z",
    },
    {
      id: "booking-6",
      roomId: "550e8400-e29b-41d4-a716-446655440003",
      name: "Jerome Bell",
      phone: "081234567895",
      unitKerja: "HR",
      bookingDate: "2025-01-22",
      startTime: "10:00",
      endTime: "12:00",
      status: "completed",
      createdAt: "2025-01-16T10:00:00.000Z",
    },
  ],
  admins: [
    {
      id: "admin-1",
      username: "admin",
      password: "password", // Will be hashed
      name: "Administrator",
    },
  ],
}

async function migrateLocalStorageToDatabase() {
  let dbClient

  try {
    console.log("🔄 Migrating localStorage data to PostgreSQL...")
    console.log("===============================================")

    // Test connection first
    console.log("1. Testing database connection...")
    const isConnected = await testConnection()
    if (!isConnected) {
      throw new Error("Cannot connect to database")
    }

    dbClient = client()
    await dbClient.connect()

    console.log("2. Clearing existing data...")

    // Clear existing data (in correct order due to foreign keys)
    await dbClient.query("DELETE FROM bookings")
    await dbClient.query("DELETE FROM rooms")
    await dbClient.query("DELETE FROM admins")

    console.log("✅ Existing data cleared")

    console.log("3. Migrating admin users...")

    // Migrate admins with hashed passwords
    for (const admin of defaultLocalStorageData.admins) {
      const hashedPassword = await bcrypt.hash(admin.password, 10)

      await dbClient.query(
        `INSERT INTO admins (id, username, password_hash, name) 
         VALUES ($1, $2, $3, $4)`,
        [admin.id, admin.username, hashedPassword, admin.name],
      )

      console.log(`   ✅ Admin: ${admin.username} (password: ${admin.password})`)
    }

    console.log("4. Migrating rooms...")

    // Migrate rooms
    for (const room of defaultLocalStorageData.rooms) {
      await dbClient.query(
        `INSERT INTO rooms (id, name, capacity, floor, amenities, description, image, is_active) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [room.id, room.name, room.capacity, room.floor, room.amenities, room.description, room.image, room.isActive],
      )

      console.log(`   ✅ Room: ${room.name}`)
    }

    console.log("5. Migrating bookings...")

    // Migrate bookings
    for (const booking of defaultLocalStorageData.bookings) {
      await dbClient.query(
        `INSERT INTO bookings (id, room_id, name, phone, unit_kerja, booking_date, start_time, end_time, status, rejection_reason, created_at) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          booking.id,
          booking.roomId,
          booking.name,
          booking.phone,
          booking.unitKerja,
          booking.bookingDate,
          booking.startTime,
          booking.endTime,
          booking.status,
          booking.rejectionReason || null,
          booking.createdAt,
        ],
      )

      console.log(`   ✅ Booking: ${booking.name} → ${booking.bookingDate}`)
    }

    console.log("6. Verifying migration...")

    // Verify migration
    const roomCount = await dbClient.query("SELECT COUNT(*) FROM rooms")
    const bookingCount = await dbClient.query("SELECT COUNT(*) FROM bookings")
    const adminCount = await dbClient.query("SELECT COUNT(*) FROM admins")

    console.log("")
    console.log("📊 Migration Summary:")
    console.log(`   - Rooms migrated: ${roomCount.rows[0].count}`)
    console.log(`   - Bookings migrated: ${bookingCount.rows[0].count}`)
    console.log(`   - Admins migrated: ${adminCount.rows[0].count}`)

    console.log("")
    console.log("🎉 Migration completed successfully!")
    console.log("")
    console.log("📝 Admin Login Credentials:")
    console.log("   Username: admin")
    console.log("   Password: password")
    console.log("")
    console.log("🚀 You can now run: npm run dev")
  } catch (error) {
    console.error("❌ Migration failed:", error.message)
    console.error("Full error:", error)
  } finally {
    if (dbClient) {
      await dbClient.end()
    }
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrateLocalStorageToDatabase()
}

module.exports = { migrateLocalStorageToDatabase, defaultLocalStorageData }
