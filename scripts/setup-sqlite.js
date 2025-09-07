const sqlite3 = require("sqlite3").verbose()
const path = require("path")

console.log("🚀 Setting up SQLite database...")

// Create database file
const dbPath = path.join(process.cwd(), "database.sqlite")
const db = new sqlite3.Database(dbPath)

// Create tables
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`)

  // Rooms table
  db.run(`CREATE TABLE IF NOT EXISTS rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    capacity INTEGER NOT NULL,
    location TEXT,
    facilities TEXT,
    price_per_hour DECIMAL(10,2) DEFAULT 0,
    status TEXT DEFAULT 'available',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`)

  // Bookings table
  db.run(`CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    room_id INTEGER,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    purpose TEXT,
    status TEXT DEFAULT 'pending',
    total_price DECIMAL(10,2) DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (room_id) REFERENCES rooms (id)
  )`)

  // Insert sample data
  db.run(`INSERT OR IGNORE INTO users (name, email, password, role) VALUES 
    ('Admin PELNI', 'admin@pelni.com', 'admin123', 'admin'),
    ('User Demo', 'user@pelni.com', 'user123', 'user')`)

  db.run(`INSERT OR IGNORE INTO rooms (name, capacity, location, facilities, price_per_hour) VALUES 
    ('Ruang Rapat A', 10, 'Lantai 1', 'Proyektor, AC, WiFi', 50000),
    ('Ruang Rapat B', 20, 'Lantai 2', 'Proyektor, AC, WiFi, Sound System', 75000),
    ('Aula Utama', 100, 'Lantai 3', 'Stage, Sound System, AC, WiFi', 200000)`)
})

db.close((err) => {
  if (err) {
    console.error("❌ Error:", err.message)
  } else {
    console.log("✅ SQLite database setup complete!")
    console.log("📁 Database file: database.sqlite")
    console.log("🚀 Run: npm run dev")
  }
})
