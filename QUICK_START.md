# 🚀 Quick Start Guide - Room Booking System

## Langkah 1: Install Dependencies
\`\`\`bash
npm install
\`\`\`

## Langkah 2: Setup PostgreSQL
Pastikan PostgreSQL sudah terinstall dan berjalan di komputer Anda.

### Windows (menggunakan installer PostgreSQL):
1. Download dari https://www.postgresql.org/download/windows/
2. Install dengan password default: `postgres`
3. Pastikan service PostgreSQL berjalan

### macOS (menggunakan Homebrew):
\`\`\`bash
brew install postgresql
brew services start postgresql
\`\`\`

### Ubuntu/Linux:
\`\`\`bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
\`\`\`

## Langkah 3: Setup Database Otomatis
\`\`\`bash
# Set password PostgreSQL (jika berbeda dari 'postgres')
export POSTGRES_PASSWORD=your_postgres_password

# Jalankan setup database
npm run setup-db
\`\`\`

## Langkah 4: Buat File Environment
\`\`\`bash
# Copy template environment
cp .env.local.example .env.local
\`\`\`

## Langkah 5: Jalankan Aplikasi
\`\`\`bash
npm run dev
\`\`\`

Aplikasi akan berjalan di: http://localhost:3000

## 🔧 Troubleshooting

### Error: "Missing script: setup-db"
\`\`\`bash
# Pastikan Anda di direktori yang benar
pwd

# Refresh npm cache
npm cache clean --force

# Install ulang dependencies
rm -rf node_modules package-lock.json
npm install

# Coba lagi
npm run setup-db
\`\`\`

### Error: "Connection refused"
\`\`\`bash
# Cek status PostgreSQL
# Windows:
services.msc (cari PostgreSQL)

# macOS:
brew services list | grep postgresql

# Linux:
sudo systemctl status postgresql

# Test koneksi database
npm run test-db
\`\`\`

### Error: "Database does not exist"
\`\`\`bash
# Reset dan setup ulang database
npm run reset-db
npm run setup-db
\`\`\`

## 📋 Scripts yang Tersedia

- `npm run dev` - Jalankan aplikasi development
- `npm run setup-db` - Setup database lengkap
- `npm run test-db` - Test koneksi database
- `npm run reset-db` - Reset database (hapus semua data)
- `npm run build` - Build aplikasi untuk production
- `npm run start` - Jalankan aplikasi production

## 🎯 Login Default

Setelah setup berhasil, Anda bisa login dengan:
- **Admin**: admin@pelni.com
- **User**: user@pelni.com

## 📞 Bantuan

Jika masih ada masalah, cek file `LOCAL_SETUP.md` untuk panduan detail atau `POSTGRESQL_SETUP.md` untuk setup manual PostgreSQL.
