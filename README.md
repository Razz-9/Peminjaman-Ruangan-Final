# Room Booking System - Setup Mudah di VS Code

## Setup Cepat (5 Menit)

### 1. Buka di VS Code
\`\`\`bash
code .
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Setup Database (Pilih salah satu)

**Opsi A - Pakai SQLite (Paling Mudah)**
\`\`\`bash
npm run setup-sqlite
\`\`\`

**Opsi B - Pakai PostgreSQL**
- Install PostgreSQL dari https://www.postgresql.org/download/
- Jalankan: `npm run setup-postgres`

### 4. Jalankan Aplikasi
\`\`\`bash
npm run dev
\`\`\`

Buka http://localhost:3000

## Login Default
- **Admin**: admin@pelni.com / admin123
- **User**: user@pelni.com / user123

## Troubleshooting
- Error npm? → `npm cache clean --force` lalu `npm install`
- Database error? → Restart PostgreSQL service
- Port 3000 busy? → `npm run dev -- -p 3001`

Selesai! 🚀
