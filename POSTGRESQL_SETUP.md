# PostgreSQL Setup Guide untuk Room Booking System

## 1. Instalasi PostgreSQL

### Windows:
1. Download PostgreSQL dari https://www.postgresql.org/download/windows/
2. Jalankan installer dan ikuti petunjuk instalasi
3. Catat username dan password yang Anda buat (biasanya username: `postgres`)
4. Catat port yang digunakan (default: 5432)

### macOS:
\`\`\`bash
# Menggunakan Homebrew
brew install postgresql
brew services start postgresql

# Atau menggunakan Postgres.app
# Download dari https://postgresapp.com/
\`\`\`

### Linux (Ubuntu/Debian):
\`\`\`bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
\`\`\`

## 2. Konfigurasi Database

### Masuk ke PostgreSQL:
\`\`\`bash
# Windows/Linux
psql -U postgres

# macOS (jika menggunakan Homebrew)
psql postgres
\`\`\`

### Buat Database dan User:
\`\`\`sql
-- Buat database untuk room booking system
CREATE DATABASE room_booking_system;

-- Buat user khusus untuk aplikasi
CREATE USER room_booking_user WITH PASSWORD 'your_secure_password';

-- Berikan hak akses ke database
GRANT ALL PRIVILEGES ON DATABASE room_booking_system TO room_booking_user;

-- Keluar dari psql
\q
\`\`\`

## 3. Struktur Database

### Tabel Users:
\`\`\`sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    unit_kerja VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### Tabel Rooms:
\`\`\`sql
CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    floor VARCHAR(100),
    capacity INTEGER NOT NULL,
    amenities TEXT[], -- Array untuk fasilitas
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### Tabel Bookings:
\`\`\`sql
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    unit_kerja VARCHAR(255) NOT NULL,
    room_id INTEGER REFERENCES rooms(id),
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    notes TEXT,
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected, active, completed
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### Index untuk Performance:
\`\`\`sql
-- Index untuk pencarian booking berdasarkan tanggal dan ruangan
CREATE INDEX idx_bookings_date_room ON bookings(booking_date, room_id);

-- Index untuk pencarian booking berdasarkan status
CREATE INDEX idx_bookings_status ON bookings(status);

-- Index untuk pencarian ruangan aktif
CREATE INDEX idx_rooms_active ON rooms(is_active);
\`\`\`

## 4. Data Sample

### Insert Sample Rooms:
\`\`\`sql
INSERT INTO rooms (name, floor, capacity, amenities, description) VALUES
('Meeting Room A', 'Lantai 1', 8, ARRAY['WiFi', 'Projector', 'Whiteboard'], 'Ruangan meeting kecil untuk diskusi tim'),
('Conference Room B', 'Lantai 2', 20, ARRAY['WiFi', 'Projector', 'Audio System', 'Coffee Machine'], 'Ruangan konferensi besar untuk presentasi'),
('Training Room C', 'Lantai 2', 15, ARRAY['WiFi', 'Projector', 'Flipchart'], 'Ruangan training dengan fasilitas lengkap'),
('Board Room', 'Lantai 3', 12, ARRAY['WiFi', 'Video Conference', 'Coffee Machine'], 'Ruangan khusus untuk rapat direksi');
\`\`\`

### Insert Sample Bookings:
\`\`\`sql
INSERT INTO bookings (user_name, phone, unit_kerja, room_id, booking_date, start_time, end_time, notes, status) VALUES
('John Doe', '081234567890', 'IT Department', 1, '2024-01-15', '09:00', '11:00', 'Meeting tim mingguan', 'approved'),
('Jane Smith', '081234567891', 'HR Department', 2, '2024-01-15', '14:00', '16:00', 'Presentasi quarterly report', 'pending'),
('Bob Johnson', '081234567892', 'Finance Department', 3, '2024-01-16', '10:00', '12:00', 'Training budget planning', 'approved');
\`\`\`

## 5. Environment Variables

Buat file `.env.local` di root project:
\`\`\`env
# Database Configuration
DATABASE_URL="postgresql://room_booking_user:your_secure_password@localhost:5432/room_booking_system"

# Alternative format
DB_HOST=localhost
DB_PORT=5432
DB_NAME=room_booking_system
DB_USER=room_booking_user
DB_PASSWORD=your_secure_password
\`\`\`

## 6. Koneksi dari Next.js

### Install Dependencies:
\`\`\`bash
npm install pg @types/pg
# atau
yarn add pg @types/pg
\`\`\`

### Database Connection (lib/db.ts):
\`\`\`typescript
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Atau menggunakan konfigurasi terpisah:
  // host: process.env.DB_HOST,
  // port: parseInt(process.env.DB_PORT || '5432'),
  // database: process.env.DB_NAME,
  // user: process.env.DB_USER,
  // password: process.env.DB_PASSWORD,
})

export default pool
\`\`\`

## 7. Backup dan Restore

### Backup Database:
\`\`\`bash
pg_dump -U room_booking_user -h localhost room_booking_system > backup.sql
\`\`\`

### Restore Database:
\`\`\`bash
psql -U room_booking_user -h localhost room_booking_system < backup.sql
\`\`\`

## 8. Maintenance

### Monitoring Koneksi:
\`\`\`sql
-- Lihat koneksi aktif
SELECT * FROM pg_stat_activity WHERE datname = 'room_booking_system';

-- Lihat ukuran database
SELECT pg_size_pretty(pg_database_size('room_booking_system'));
\`\`\`

### Optimasi Performance:
\`\`\`sql
-- Analyze tables untuk update statistik
ANALYZE bookings;
ANALYZE rooms;

-- Vacuum untuk cleanup
VACUUM bookings;
VACUUM rooms;
\`\`\`

## 9. Security Best Practices

1. **Gunakan password yang kuat** untuk database user
2. **Batasi akses network** - hanya allow dari aplikasi server
3. **Regular backup** database
4. **Monitor log** untuk aktivitas mencurigakan
5. **Update PostgreSQL** secara berkala
6. **Gunakan SSL** untuk koneksi production

## 10. Troubleshooting

### Connection Issues:
\`\`\`bash
# Test koneksi
psql -U room_booking_user -h localhost -d room_booking_system

# Check PostgreSQL service
# Windows: services.msc
# Linux: sudo systemctl status postgresql
# macOS: brew services list | grep postgresql
\`\`\`

### Permission Issues:
\`\`\`sql
-- Grant semua permission jika diperlukan
GRANT ALL ON ALL TABLES IN SCHEMA public TO room_booking_user;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO room_booking_user;
\`\`\`

Setelah setup selesai, aplikasi Room Booking System siap digunakan dengan database PostgreSQL!
