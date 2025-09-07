# 🚀 **Panduan Migrasi Data ke PostgreSQL**

## **Step 1: Setup PostgreSQL**
\`\`\`bash
# Start PostgreSQL container
npm run docker:up

# Wait 10 detik untuk PostgreSQL ready
\`\`\`

## **Step 2: Create Database & User**
\`\`\`bash
# Create database dan user
npm run create-db
\`\`\`

## **Step 3: Setup Database dengan Data Lama**
\`\`\`bash
# Setup database dengan semua data localStorage
npm run setup-db-with-data
\`\`\`

## **Step 4: Verify Setup**
\`\`\`bash
# Check apakah semua data berhasil dimigrate
npm run check-db
\`\`\`

## **🎯 One Command Setup:**
\`\`\`bash
# Semua dalam satu command
npm run db:full-setup
\`\`\`

---

## **📊 Data yang Akan Dimigrate:**

### **🏢 Rooms (3 ruangan):**
- ✅ Lambelu Lt.1 TI
- ✅ Leuser Lt.1 Pengamanan  
- ✅ Awu Lt.3

### **📅 Bookings (6 booking):**
- ✅ Jane Cooper → Lambelu (Approved)
- ✅ Floyd Miles → Leuser (Pending)
- ✅ Ronald Richards → Awu (Rejected)
- ✅ Darlene Robertson → Lambelu (Approved)
- ✅ Courtney Henry → Leuser (Active)
- ✅ Jerome Bell → Awu (Completed)

### **👤 Admin:**
- ✅ Username: `admin`
- ✅ Password: `password`

---

## **🔧 Troubleshooting:**

### **Reset Semua:**
\`\`\`bash
npm run docker:down
npm run docker:up
npm run db:reset
\`\`\`

### **Check Status:**
\`\`\`bash
npm run check-db
\`\`\`

---

## **✨ Update Fitur Baru:**

### **🤖 Smart Assistant:**
- ✅ Suggest waktu optimal **BESOK** (bukan hari ini)
- ✅ Analisis slot waktu terbaik
- ✅ Tips format 24 jam

### **⏰ Form Booking:**
- ✅ Format waktu 24 jam (00:00 - 23:59)
- ✅ Validasi format waktu
- ✅ Icon clock di input
- ✅ Booking hanya untuk besok atau setelahnya

### **🚫 Validasi Baru:**
- ✅ Tidak bisa booking hari ini
- ✅ Minimal durasi 15 menit
- ✅ Format waktu 24 jam wajib
