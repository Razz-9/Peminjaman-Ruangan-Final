const { Pool } = require("pg")

async function setupDatabase() {
  console.log("🚀 Starting database setup...")

  // Koneksi ke PostgreSQL sebagai superuser untuk membuat database
  const adminPool = new Pool({
    host: "localhost",
    port: 5432,
    database: "postgres", // Connect to default postgres database
    user: "postgres",
    password: process.env.POSTGRES_PASSWORD || "postgres",
  })

  try {
    // 1. Buat database jika belum ada
    console.log("📦 Creating database...")
    await adminPool
      .query(`
      SELECT 'CREATE DATABASE room_booking_system'
      WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'room_booking_system')
    `)
      .then(async (result) => {
        if (result.rows.length > 0) {
          await adminPool.query("CREATE DATABASE room_booking_system")
          console.log("✅ Database created successfully")
        } else {
          console.log("✅ Database already exists")
        }
      })

    // 2. Buat user jika belum ada
    console.log("👤 Creating user...")
    await adminPool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'room_booking_user') THEN
          CREATE USER room_booking_user WITH PASSWORD 'password123';
        END IF;
      END
      $$;
    `)

    // 3. Grant privileges
    await adminPool.query("GRANT ALL PRIVILEGES ON DATABASE room_booking_system TO room_booking_user")
    console.log("✅ User created and privileges granted")
  } catch (error) {
    console.error("❌ Error setting up database:", error.message)
  } finally {
    await adminPool.end()
  }

  // Koneksi ke database yang baru dibuat untuk membuat tabel
  const appPool = new Pool({
    host: "localhost",
    port: 5432,
    database: "room_booking_system",
    user: "room_booking_user",
    password: "password123",
  })

  try {
    // 4. Buat tabel users
    console.log("🏗️  Creating tables...")
    await appPool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20),
        unit_kerja VARCHAR(255),
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // 5. Buat tabel rooms
    await appPool.query(`
      CREATE TABLE IF NOT EXISTS rooms (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        floor VARCHAR(100),
        capacity INTEGER NOT NULL,
        amenities TEXT[],
        description TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // 6. Buat tabel bookings
    await appPool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        user_name VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        unit_kerja VARCHAR(255) NOT NULL,
        room_id INTEGER REFERENCES rooms(id),
        booking_date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        notes TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        rejection_reason TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // 7. Buat index
    await appPool.query("CREATE INDEX IF NOT EXISTS idx_bookings_date_room ON bookings(booking_date, room_id)")
    await appPool.query("CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status)")
    await appPool.query("CREATE INDEX IF NOT EXISTS idx_rooms_active ON rooms(is_active)")

    console.log("✅ Tables created successfully")

    // 8. Insert sample data
    console.log("📝 Inserting sample data...")

    // Insert rooms
    await appPool.query(`
      INSERT INTO rooms (name, floor, capacity, amenities, description) 
      VALUES 
        ('Meeting Room A', 'Lantai 1', 8, ARRAY['WiFi', 'Projector', 'Whiteboard'], 'Ruangan meeting kecil untuk diskusi tim'),
        ('Conference Room B', 'Lantai 2', 20, ARRAY['WiFi', 'Projector', 'Audio System', 'Coffee Machine'], 'Ruangan konferensi besar untuk presentasi'),
        ('Training Room C', 'Lantai 2', 15, ARRAY['WiFi', 'Projector', 'Flipchart'], 'Ruangan training dengan fasilitas lengkap'),
        ('Board Room', 'Lantai 3', 12, ARRAY['WiFi', 'Video Conference', 'Coffee Machine'], 'Ruangan khusus untuk rapat direksi')
      ON CONFLICT DO NOTHING
    `)

    // Insert sample users
    await appPool.query(`
      INSERT INTO users (name, email, phone, unit_kerja, role)
      VALUES 
        ('Admin PELNI', 'admin@pelni.com', '081234567890', 'IT Department', 'admin'),
        ('User Demo', 'user@pelni.com', '081234567891', 'HR Department', 'user')
      ON CONFLICT (email) DO NOTHING
    `)

    console.log("✅ Sample data inserted successfully")
    console.log("🎉 Database setup completed!")
    console.log("")
    console.log("📋 Connection Details:")
    console.log("   Database: room_booking_system")
    console.log("   User: room_booking_user")
    console.log("   Password: password123")
    console.log("   Host: localhost")
    console.log("   Port: 5432")
    console.log("")
    console.log("🔗 Add this to your .env.local:")
    console.log('   DATABASE_URL="postgresql://room_booking_user:password123@localhost:5432/room_booking_system"')
  } catch (error) {
    console.error("❌ Error creating tables:", error.message)
  } finally {
    await appPool.end()
  }
}

setupDatabase()
