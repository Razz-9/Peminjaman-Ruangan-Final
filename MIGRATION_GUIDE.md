# 🔄 Migration Guide: localStorage → PostgreSQL

## Data yang Akan Dipindahkan:

### 🏢 **Rooms (3 ruangan):**
- Lambelu Lt.1 TI
- Leuser Lt.1 Pengamanan  
- Awu Lt.3

### 📅 **Bookings (6 booking):**
- Jane Cooper → Lambelu (Approved)
- Floyd Miles → Leuser (Pending)
- Ronald Richards → Awu (Rejected)
- Darlene Robertson → Lambelu (Approved)
- Courtney Henry → Leuser (Active)
- Jerome Bell → Awu (Completed)

### 👤 **Admin:**
- Username: `admin`
- Password: `password`

## 🚀 **Setup Commands:**

### **Quick Setup (Recommended):**
\`\`\`bash
npm run db:full-setup
\`\`\`

### **Step by Step:**
\`\`\`bash
# 1. Start PostgreSQL
npm run docker:up

# 2. Create database
npm run create-db

# 3. Setup with all data
npm run setup-db-with-data

# 4. Verify
npm run check-db
\`\`\`

### **Only Migrate Data (if tables exist):**
\`\`\`bash
npm run migrate-data
\`\`\`

## 🔧 **Troubleshooting:**

### **Reset Everything:**
\`\`\`bash
npm run docker:down
npm run docker:up
npm run db:reset
\`\`\`

### **Check Status:**
\`\`\`bash
npm run check-db
