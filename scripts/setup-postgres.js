const { Pool } = require("pg")

console.log("🚀 Setting up PostgreSQL database...")

async function setupDatabase() {
  // Connect to default postgres database first
  const adminPool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "postgres",
    password: process.env.POSTGRES_PASSWORD || "postgres",
    port: 5432,
  })

  try {
    // Create database
    await adminPool.query("CREATE DATABASE pelni_db")
    console.log("✅ Database created")
  } catch (err) {
    if (err.code === "42P04") {
      console.log("ℹ️ Database already exists")
    } else {
      console.error("❌ Error creating database:", err.message)
    }
  }

  await adminPool.end()

  // Connect to our database
  const pool = new Pool({
    user: "pelni_user",
    host: "localhost",
    database: "pelni_db",
    password: process.env.POSTGRES_PASSWORD || "Pelni2025",
    port: 5434,
  })

  try {
    // Create tables and insert data
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS rooms (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        capacity INTEGER NOT NULL,
        location VARCHAR(255),
        facilities TEXT,
        price_per_hour DECIMAL(10,2) DEFAULT 0,
        status VARCHAR(50) DEFAULT 'available',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        room_id INTEGER REFERENCES rooms(id),
        start_time TIMESTAMP NOT NULL,
        end_time TIMESTAMP NOT NULL,
        purpose TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        total_price DECIMAL(10,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      INSERT INTO users (name, email, password, role) VALUES 
        ('Admin PELNI', 'admin@pelni.com', 'admin123', 'admin'),
        ('User Demo', 'user@pelni.com', 'user123', 'user')
      ON CONFLICT (email) DO NOTHING;

      INSERT INTO rooms (name, capacity, location, facilities, price_per_hour) VALUES 
        ('Ruang Rapat A', 10, 'Lantai 1', 'Proyektor, AC, WiFi', 50000),
        ('Ruang Rapat B', 20, 'Lantai 2', 'Proyektor, AC, WiFi, Sound System', 75000),
        ('Aula Utama', 100, 'Lantai 3', 'Stage, Sound System, AC, WiFi', 200000)
      ON CONFLICT DO NOTHING;
    `)

    console.log("✅ PostgreSQL setup complete!")
    console.log("🚀 Run: npm run dev")
  } catch (err) {
    console.error("❌ Error:", err.message)
  }

  await pool.end()
}

setupDatabase()
