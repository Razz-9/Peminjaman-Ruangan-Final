// scripts/setup-database.js (Versi Perbaikan Final)

const { Pool, Client } = require("pg");
const bcrypt = require("bcryptjs");

// Konfigurasi koneksi database langsung di sini
const dbConfig = {
  host: "localhost",
  port: 5434, // Pastikan port ini 5434
  user: "pelni_user",
  password: "Pelni2025",
  database: "pelni_booking",
};

// Fungsi untuk membuat koneksi baru
const createClient = () => new Client(dbConfig);

async function setupDatabase() {
  let dbClient;

  try {
    console.log("🚀 Setting up PELNI Room Booking Database...");
    console.log("==========================================");

    dbClient = createClient();
    await dbClient.connect();
    console.log("✅ Connection successful.");

    console.log("2. Creating tables...");

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
    `);

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
    `);

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
    `);

    console.log("✅ Tables created successfully");

    // Lanjutan (indeks, trigger, data) di sini...
    // (Kode selanjutnya tidak perlu diubah)


    console.log("3. Creating indexes...");
    await dbClient.query("CREATE INDEX IF NOT EXISTS idx_bookings_room_id ON bookings(room_id)");
    await dbClient.query("CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date)");
    await dbClient.query("CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status)");
    await dbClient.query("CREATE INDEX IF NOT EXISTS idx_rooms_active ON rooms(is_active)");
    console.log("✅ Indexes created successfully");

    console.log("4. Creating triggers...");
    await dbClient.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql'
    `);
    await dbClient.query(`
      DROP TRIGGER IF EXISTS update_rooms_updated_at ON rooms;
      CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON rooms
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `);
    await dbClient.query(`
      DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
      CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `);
    await dbClient.query(`
      DROP TRIGGER IF EXISTS update_admins_updated_at ON admins;
      CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `);
    console.log("✅ Triggers created successfully");

    console.log("5. Inserting admin user...");
    const hashedPassword = await bcrypt.hash("password", 10);
    await dbClient.query(
      `
      INSERT INTO admins (username, password_hash, name) 
      VALUES ($1, $2, $3) 
      ON CONFLICT (username) DO NOTHING
    `,
      ["admin", hashedPassword, "Administrator"],
    );
    console.log("✅ Admin user created (username: admin, password: password)");

    console.log("6. Inserting sample rooms...");
    const rooms = [
      {
        id: "550e8400-e29b-41d4-a716-446655440001",
        name: "Lambelu Lt.1 TI",
        capacity: "10 orang",
        floor: "Lantai 1",
        amenities: ["TV", "Proyektor", "Meja"],
        description: "Ruangan meeting dengan fasilitas lengkap untuk keperluan TI dan presentasi.",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440002",
        name: "Leuser Lt.1 Pengamanan",
        capacity: "10 orang",
        floor: "Lantai 1",
        amenities: ["TV", "Proyektor", "Meja", "AC"],
        description: "Ruangan meeting untuk keperluan pengamanan dengan fasilitas AC dan multimedia.",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440003",
        name: "Awu Lt.3",
        capacity: "10 orang",
        floor: "Lantai 3",
        amenities: ["TV", "Proyektor", "Meja", "AC"],
        description: "Ruangan meeting di lantai 3 dengan pemandangan yang baik dan fasilitas lengkap.",
        image: "/placeholder.svg?height=200&width=300",
      },
    ];
    for (const room of rooms) {
      await dbClient.query(
        `
        INSERT INTO rooms (id, name, capacity, floor, amenities, description, image) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) 
        ON CONFLICT (id) DO NOTHING
      `,
        [room.id, room.name, room.capacity, room.floor, room.amenities, room.description, room.image],
      );
    }
    console.log("✅ Sample rooms inserted");

    console.log("7. Inserting sample bookings...");
    const bookings = [
      {
        room_id: "550e8400-e29b-41d4-a716-446655440001",
        name: "Jane Cooper",
        phone: "081234567890",
        unit_kerja: "TI",
        booking_date: "2025-01-15",
        start_time: "10:00",
        end_time: "12:00",
        status: "approved",
      },
      {
        room_id: "550e8400-e29b-41d4-a716-446655440002",
        name: "Floyd Miles",
        phone: "081234567891",
        unit_kerja: "Umum",
        booking_date: "2025-01-18",
        start_time: "14:00",
        end_time: "16:00",
        status: "pending",
      },
      {
        room_id: "550e8400-e29b-41d4-a716-446655440003",
        name: "Ronald Richards",
        phone: "081234567892",
        unit_kerja: "SDM",
        booking_date: "2025-01-19",
        start_time: "10:00",
        end_time: "12:30",
        status: "rejected",
      },
    ];
    for (const booking of bookings) {
      await dbClient.query(
        `
        INSERT INTO bookings (room_id, name, phone, unit_kerja, booking_date, start_time, end_time, status) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `,
        [
          booking.room_id,
          booking.name,
          booking.phone,
          booking.unit_kerja,
          booking.booking_date,
          booking.start_time,
          booking.end_time,
          booking.status,
        ],
      );
    }
    console.log("✅ Sample bookings inserted");
    
    console.log("\n🎉 Database setup completed successfully!");
    console.log("\n🚀 You can now run: npm run dev");

  } catch (error) {
    console.error("❌ Database setup failed:", error.message);
  } finally {
    if (dbClient) {
      await dbClient.end();
    }
  }
}

setupDatabase();