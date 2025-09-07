# Setup Lokal - Room Booking System

## Langkah Cepat Setup Database & Aplikasi

### 1. Install PostgreSQL
\`\`\`bash
# Windows: Download dari https://www.postgresql.org/download/windows/
# macOS: brew install postgresql
# Linux: sudo apt install postgresql postgresql-contrib
\`\`\`

### 2. Setup Database (Otomatis)
\`\`\`bash
# Jalankan script setup otomatis
npm run setup-db
\`\`\`

### 3. Setup Environment Variables
Buat file `.env.local`:
\`\`\`env
DATABASE_URL="postgresql://room_booking_user:password123@localhost:5432/room_booking_system"
NEXTAUTH_SECRET="your-secret-key-here"
\`\`\`

### 4. Install Dependencies & Run
\`\`\`bash
npm install
npm run dev
\`\`\`

Aplikasi akan berjalan di: http://localhost:3000

---

## Setup Manual (Jika Script Otomatis Gagal)

### 1. Buat Database Manual
\`\`\`bash
# Masuk ke PostgreSQL
psql -U postgres

# Buat database dan user
CREATE DATABASE room_booking_system;
CREATE USER room_booking_user WITH PASSWORD 'password123';
GRANT ALL PRIVILEGES ON DATABASE room_booking_system TO room_booking_user;
\q
\`\`\`

### 2. Jalankan Script Database
\`\`\`bash
# Buat tabel
psql -U room_booking_user -d room_booking_system -f scripts/001_create_tables.sql

# Insert data sample
psql -U room_booking_user -d room_booking_system -f scripts/002_seed_data.sql
\`\`\`

### 3. Test Koneksi
\`\`\`bash
npm run test-db
\`\`\`

---

## Perintah Berguna

\`\`\`bash
# Setup database dari awal
npm run setup-db

# Test koneksi database
npm run test-db

# Reset database (hapus semua data)
npm run reset-db

# Backup database
npm run backup-db

# Development server
npm run dev

# Build production
npm run build
npm start
\`\`\`

---

## Troubleshooting

### Error: "database does not exist"
\`\`\`bash
createdb -U postgres room_booking_system
\`\`\`

### Error: "password authentication failed"
\`\`\`bash
# Reset password PostgreSQL
sudo -u postgres psql
ALTER USER postgres PASSWORD 'newpassword';
\`\`\`

### Error: "port 5432 already in use"
\`\`\`bash
# Check process menggunakan port 5432
lsof -i :5432
# Kill process jika perlu
sudo kill -9 <PID>
\`\`\`

### Error: "connection refused"
\`\`\`bash
# Start PostgreSQL service
# Windows: net start postgresql
# macOS: brew services start postgresql  
# Linux: sudo systemctl start postgresql
\`\`\`

---

## Struktur Database

**Tables:**
- `users` - Data pengguna
- `rooms` - Data ruangan
- `bookings` - Data booking ruangan

**Default Login:**
- Admin: admin@pelni.com / admin123
- User: user@pelni.com / user123

---

## Development Tips

1. **Hot Reload**: Aplikasi akan auto-reload saat ada perubahan code
2. **Database Changes**: Jalankan `npm run reset-db` setelah ubah struktur database
3. **Logs**: Check console browser untuk error frontend, terminal untuk error backend
4. **API Testing**: Gunakan Postman atau curl untuk test API endpoints

---

## Production Deployment

1. Setup PostgreSQL di server production
2. Update `DATABASE_URL` dengan credentials production
3. Jalankan `npm run build`
4. Deploy ke Vercel/Netlify atau server sendiri

Untuk detail lengkap, lihat file `POSTGRESQL_SETUP.md`
