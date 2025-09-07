# 📋 PELNI Room Booking System - Dokumentasi Lengkap

## 🏗️ **Arsitektur Sistem**

### **Frontend Framework**
- **Next.js 14** dengan App Router
- **TypeScript** untuk type safety
- **Tailwind CSS** untuk styling
- **shadcn/ui** untuk komponen UI

### **State Management**
- **React Context API** untuk global state
- **Local Storage** untuk persistensi data
- **Custom Hooks** untuk logic reusability

---

## 🎯 **Fitur Utama Sistem**

### **1. Multi-Language Support (🌐)**
- **Bahasa Indonesia** dan **English**
- Toggle bahasa di header sidebar
- Semua text menggunakan translation system
- Persistensi pilihan bahasa di localStorage

### **2. Authentication System (🔐)**
- **Admin Login** dengan username/password
- **Session Management** dengan localStorage
- **Route Protection** untuk halaman admin
- **Auto-redirect** berdasarkan status login

### **3. Room Management (🏢)**
- **CRUD Operations** untuk ruangan
- **Image Upload** dengan preview
- **Amenities Management** dengan checkbox
- **Room Status** (active/inactive)

### **4. Booking System (📅)**
- **User Booking** dengan form validation
- **Time Conflict Detection** 
- **Status Management** (pending/approved/rejected/active/completed)
- **Rejection Reasons** untuk booking yang ditolak

### **5. Smart Assistant (🤖)**
- **AI-powered suggestions** berdasarkan pola booking
- **Room utilization analysis**
- **Peak hours insights**
- **Quick actions** dan shortcuts
- **Real-time statistics**

---

## 📁 **Struktur Folder**

\`\`\`
app/
├── admin/
│   └── login/                 # Admin login page
├── dashboard/                 # Admin dashboard
│   ├── booking/              # Admin booking management
│   ├── history/              # Admin booking history
│   ├── rooms/                # Admin room management
│   └── settings/             # Admin settings
├── user/                     # User area
│   ├── booking/              # User booking form
│   ├── history/              # User booking history
│   └── rooms/                # User room information
├── layout.tsx                # Root layout
└── page.tsx                  # Home redirect

components/
├── ui/                       # shadcn/ui components
├── language-toggle.tsx       # Language switcher
└── smart-booking-assistant.tsx # AI assistant

contexts/
├── AuthContext.tsx           # Authentication state
├── DataContext.tsx           # Data management
└── LanguageContext.tsx       # Language management
\`\`\`

---

## 🔄 **Flow Sistem**

### **User Flow:**
1. **Landing** → Auto redirect ke `/user` atau `/dashboard`
2. **User Area** → Browse rooms, make bookings, view history
3. **Admin Login** → Modal login dari sidebar
4. **Admin Panel** → Manage rooms, bookings, settings

### **Booking Flow:**
1. **User** → Fill booking form → Submit
2. **System** → Validate time conflicts → Save as "pending"
3. **Admin** → Review booking → Approve/Reject with reason
4. **User** → Receive notification → View updated status

---

## 🎨 **Design System**

### **Color Palette:**
- **Primary**: Blue (#2563eb)
- **Success**: Green (#16a34a)
- **Warning**: Yellow (#ca8a04)
- **Error**: Red (#dc2626)
- **Gray Scale**: #f8fafc → #1e293b

### **Typography:**
- **Headings**: Inter font, bold weights
- **Body**: Inter font, regular/medium
- **Sizes**: text-xs → text-3xl

### **Components:**
- **Cards**: Subtle shadows, rounded corners
- **Buttons**: Consistent padding, hover states
- **Forms**: Clear labels, validation states
- **Tables**: Zebra striping, hover effects

---

## 🔧 **Technical Implementation**

### **Context Providers:**
\`\`\`typescript
// Language Context
const { language, setLanguage, t } = useLanguage()

// Auth Context  
const { user, login, logout, isAuthenticated } = useAuth()

// Data Context
const { rooms, bookings, addBooking, updateBookingStatus } = useData()
\`\`\`

### **Smart Assistant Logic:**
\`\`\`typescript
// Analisis pola booking
const todayBookings = bookings.filter(b => 
  b.bookingDate === today && 
  (b.status === "approved" || b.status === "active")
)

// Room utilization
const roomUsage = rooms.map(room => ({
  room,
  utilizationRate: (roomBookings.length / totalBookings) * 100
}))

// Peak hours analysis
const peakHours = bookings.reduce((acc, booking) => {
  const hour = parseInt(booking.startTime.split(':')[0])
  acc[hour] = (acc[hour] || 0) + 1
  return acc
}, {})
\`\`\`

### **Time Conflict Detection:**
\`\`\`typescript
const checkTimeConflict = (roomId, date, startTime, endTime) => {
  const dateBookings = bookings.filter(
    (booking) =>
      booking.roomId === roomId &&
      booking.bookingDate === date &&
      (booking.status === "approved" || booking.status === "pending")
  )

  return dateBookings.some((booking) => {
    const bookingStart = booking.startTime
    const bookingEnd = booking.endTime

    return (
      (startTime >= bookingStart && startTime < bookingEnd) ||
      (endTime > bookingStart && endTime <= bookingEnd) ||
      (startTime <= bookingStart && endTime >= bookingEnd)
    )
  })
}
\`\`\`

### **Translation System:**
\`\`\`typescript
// Translation keys
const translations = {
  id: {
    "nav.dashboard": "Dashboard",
    "booking.title": "Booking Ruangan",
    "status.approved": "Disetujui"
  },
  en: {
    "nav.dashboard": "Dashboard", 
    "booking.title": "Room Booking",
    "status.approved": "Approved"
  }
}

// Usage
const { t } = useLanguage()
<h1>{t("booking.title")}</h1>
\`\`\`

---

## 📊 **Data Structure**

### **Room Object:**
\`\`\`typescript
interface Room {
  id: string
  name: string
  capacity: string
  floor: string
  amenities: string[]
  description: string
  image: string
  isActive: boolean
}
\`\`\`

### **Booking Object:**
\`\`\`typescript
interface Booking {
  id: string
  roomId: string
  name: string
  phone: string
  unitKerja: string
  bookingDate: string
  startTime: string
  endTime: string
  status: "pending" | "approved" | "rejected" | "active" | "completed"
  notes?: string
  rejectionReason?: string
  createdAt: string
}
\`\`\`

---

## 🚀 **Fitur Smart Assistant**

### **Analisis yang Dilakukan:**
1. **Booking Density** - Menganalisis kepadatan booking per hari
2. **Room Utilization** - Tingkat penggunaan setiap ruangan
3. **Peak Hours** - Jam-jam tersibuk dalam sistem
4. **Availability Patterns** - Pola ketersediaan ruangan

### **Jenis Suggestions:**
- **🕐 Optimal Time**: Saran waktu terbaik untuk booking
- **🏢 Hidden Gem**: Ruangan yang jarang digunakan
- **📊 Peak Insight**: Informasi jam sibuk
- **🌅 Tomorrow Planning**: Perencanaan untuk besok
- **⚡ Quick Tips**: Tips praktis booking

### **Priority System:**
- **High**: Saran penting yang perlu segera diperhatikan
- **Medium**: Saran berguna untuk optimasi
- **Low/Tip**: Tips umum dan informasi tambahan

---

## 🔒 **Security & Validation**

### **Input Validation:**
- **Form Validation** dengan required fields
- **Time Validation** (end time > start time)
- **Date Validation** (tidak bisa booking masa lalu)
- **File Upload Validation** (size, type)

### **Authentication:**
- **Simple Auth** dengan hardcoded credentials (demo)
- **Session Management** dengan localStorage
- **Route Protection** dengan useEffect guards

---

## 📱 **Responsive Design**

### **Breakpoints:**
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

### **Adaptive Features:**
- **Sidebar** collapse pada mobile
- **Table** horizontal scroll pada mobile
- **Grid** responsive columns
- **Modal** full-width pada mobile

---

## 🎯 **Performance Optimizations**

### **React Optimizations:**
- **useCallback** untuk event handlers
- **useMemo** untuk computed values
- **Lazy Loading** untuk komponen besar
- **Code Splitting** dengan dynamic imports

### **Data Management:**
- **localStorage** untuk persistensi
- **Context** untuk global state
- **Debounced Search** untuk performance
- **Pagination** untuk large datasets

---

## 🔧 **Development Setup**

### **Prerequisites:**
\`\`\`bash
Node.js >= 18
npm atau yarn
\`\`\`

### **Installation:**
\`\`\`bash
npm install
npm run dev
\`\`\`

### **Build:**
\`\`\`bash
npm run build
npm start
\`\`\`

---

## 🚀 **Deployment Considerations**

### **Environment Variables:**
\`\`\`env
NEXT_PUBLIC_APP_URL=https://your-domain.com
DATABASE_URL=your-database-url
\`\`\`

### **Database Migration:**
- Convert localStorage to real database
- Setup proper authentication
- Implement API endpoints
- Add data validation

---

## 📈 **Future Enhancements**

### **Planned Features:**
1. **Real Database** integration (PostgreSQL/MySQL)
2. **Email Notifications** untuk booking updates
3. **Calendar Integration** (Google Calendar, Outlook)
4. **Mobile App** dengan React Native
5. **Advanced Analytics** dashboard
6. **Multi-tenant** support
7. **API Documentation** dengan Swagger
8. **Unit Testing** dengan Jest
9. **E2E Testing** dengan Playwright
10. **CI/CD Pipeline** dengan GitHub Actions

### **Technical Improvements:**
- **Server-Side Rendering** optimization
- **Image Optimization** dengan Next.js Image
- **Caching Strategy** dengan Redis
- **Rate Limiting** untuk API
- **Error Monitoring** dengan Sentry
- **Performance Monitoring** dengan Vercel Analytics

---

## 🎨 **UI/UX Highlights**

### **Smart Assistant Features:**
- **Minimalist Design** yang konsisten dengan sistem
- **Non-intrusive** floating button
- **Context-aware** suggestions
- **Priority-based** color coding
- **Quick Actions** untuk navigasi cepat

### **Language System:**
- **Seamless Switching** tanpa reload
- **Persistent Preference** di localStorage
- **Complete Translation** untuk semua text
- **Consistent Terminology** antar bahasa

### **Filter System:**
- **Advanced Filtering** dengan multiple criteria
- **Visual Filter Counter** untuk active filters
- **Quick Clear** untuk reset semua filter
- **Real-time Results** tanpa page reload

---

## 📋 **Summary**

**PELNI Room Booking System** adalah aplikasi web modern yang menggabungkan:

✅ **Multi-language support** (ID/EN)  
✅ **Smart AI Assistant** dengan analisis real-time  
✅ **Advanced filtering** dan search  
✅ **Responsive design** untuk semua device  
✅ **Clean architecture** dengan TypeScript  
✅ **Modern UI/UX** dengan shadcn/ui  
✅ **Real-time conflict detection**  
✅ **Comprehensive booking management**  

Sistem ini dirancang untuk **scalability**, **maintainability**, dan **user experience** yang optimal, dengan arsitektur yang mudah dikembangkan untuk fitur-fitur masa depan.
