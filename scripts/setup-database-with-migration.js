const { pool, client, testConnection } = require("../lib/db")
const { migrateLocalStorageToDatabase } = require("./migrate-localStorage-to-db")

async function setupDatabaseWithMigration() {
  let dbClient

  try {
    console.log("🚀 Setting up PELNI Room Booking Database with Migration...")
    console.log("========================================================")

    // Test connection first
    console.log("1. Testing database connection...")
    const isConnected = await testConnection()
    if (!isConnected) {
      throw new Error("Cannot connect to database")
    }

    dbClient = client()
    await dbClient.connect()

    console.log("2. Creating database schema...")

    // Create rooms table
    await dbClient.query(`
      CREATE TABLE IF NOT EXISTS rooms (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          capacity VARCHAR(100) NOT NULL,
          floor VARCHAR(100) NOT NULL,
          amenities TEXT[] DEFAULT '{}',
          description TEXT,
          image TEXT,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create bookings table
    await dbClient.query(`
      CREATE TABLE IF NOT EXISTS bookings (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
          name VARCHAR(255) NOT NULL,
          phone VARCHAR(50) NOT NULL,
          unit_kerja VARCHAR(255) NOT NULL,
          booking_date DATE NOT NULL,
          start_time TIME NOT NULL,
          end_time TIME NOT NULL,
          status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'active', 'completed')),
          notes TEXT,
          rejection_reason TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create admins table
    await dbClient.query(`
      CREATE TABLE IF NOT EXISTS admins (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          username VARCHAR(100) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          name VARCHAR(255),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `)

    console.log("✅ Database schema created")

    console.log("3. Creating indexes...")

    // Create indexes
    await dbClient.query("CREATE INDEX IF NOT EXISTS idx_bookings_room_id ON bookings(room_id)")
    await dbClient.query("CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date)")
    await dbClient.query("CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status)")
    await dbClient.query("CREATE INDEX IF NOT EXISTS idx_rooms_active ON rooms(is_active)")

    console.log("✅ Indexes created")

    console.log("4. Creating triggers...")

    // Create updated_at trigger function
    await dbClient.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql'
    `)

    // Create triggers
    await dbClient.query(`
      DROP TRIGGER IF EXISTS update_rooms_updated_at ON rooms;
      CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON rooms
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `)

    await dbClient.query(`
      DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
      CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `)

    await dbClient.query(`
      DROP TRIGGER IF EXISTS update_admins_updated_at ON admins;
      CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `)

    console.log("✅ Triggers created")

    // Close current connection before migration
    await dbClient.end()

    console.log("5. Migrating localStorage data...")

    // Run migration
    await migrateLocalStorageToDatabase()

    console.log("")
    console.log("🎉 Database setup with migration completed!")
    console.log("")
    console.log("📝 Login credentials:")
    console.log("   Username: admin")
    console.log("   Password: password")
    console.log("")
    console.log("🚀 You can now run: npm run dev")
  } catch (error) {
    console.error("❌ Database setup failed:", error.message)
    console.error("Full error:", error)
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabaseWithMigration()
}

module.exports = { setupDatabaseWithMigration }
