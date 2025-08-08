# 📚 Story App – Platform Berbagi Cerita dengan Lokasi

Story App adalah aplikasi web berbasis **Next.js + React + TypeScript** untuk berbagi cerita yang dilengkapi foto dan lokasi geografis. Pengguna dapat membuat cerita dengan judul, deskripsi, foto (upload atau dari kamera), dan lokasi di peta interaktif, lalu membagikannya ke publik.

> ⚠️ **Status Proyek:**  
> Aplikasi ini sudah berfungsi dan mencakup sebagian besar fitur utama (~90% selesai), namun masih dalam tahap improvement dan refactoring. Anda bisa menggunakannya, tetapi beberapa kode dan fitur mungkin masih berubah pada rilis berikutnya.

## ✨ Fitur Utama

- 🔐 **Autentikasi Pengguna** – Login & Registrasi dengan validasi
- 📝 **Buat Cerita** – Judul, deskripsi, dan gambar (upload file atau ambil langsung via kamera)
- 🗺️ **Lokasi Interaktif** – Pilih titik di peta atau gunakan lokasi saat ini
- 📍 **Visualisasi Peta** – Semua cerita ditampilkan dalam peta Leaflet.js
- 🎨 **UI Modern & Responsif** – Menggunakan Tailwind CSS & shadcn/ui
- ⚡ **Optimasi Performa** – Lazy loading, React Context, dan auto-save draft

## 🛠️ Tech Stack

**Frontend:**
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS + shadcn/ui
- Leaflet.js
- react-hook-form + Zod
- react-hot-toast

**Backend API:**
- Endpoint: https://backend-dstory-production.up.railway.app

## 📂 Struktur Proyek (Ringkas)

```
src/
 ├── app/                # Halaman Next.js & API Routes
 │   ├── api/             # Proxy API (Auth, Geocode, Stories)
 │   ├── login/           # Halaman login
 │   ├── register/        # Halaman registrasi
 │   ├── stories/         # Halaman tambah cerita
 │   └── page.tsx         # Landing page
 │
 ├── components/          # Komponen UI & fitur (Camera, Map, StoryCard, dll)
 ├── lib/                 # Helper & validasi
 ├── utils/               # Konfigurasi & Context API
 └── styles/              # Global styles
```

## 🚀 Cara Menjalankan

### 1. Clone repository
```bash
git clone https://github.com/username/story-app.git
cd story-app
```

### 2. Install dependencies
```bash
npm install
```

### 3. Buat file `.env.local`
```env
BASE_URL=https://backend-dstory-production.up.railway.app
```

### 4. Jalankan aplikasi
```bash
npm run dev
```

### 5. Buka di browser:
```
http://localhost:3000
```

## 📸 Screenshot

| Halaman       | Preview                                       |
| ------------- | --------------------------------------------- |
| Landing Page  | ![LandingPage](https://github.com/user-attachments/assets/2dbda28a-45ed-40c3-b170-43fb2e43482e) |
| Login         | ![Login](https://github.com/user-attachments/assets/3ff85204-9f7f-4da3-9ab8-b23a1f42ebdb) |
| Register      | ![Register](https://github.com/user-attachments/assets/3f56d896-8e45-4e38-9b2b-41cd3ab6a7f3) |
| Tambah Cerita | ![AddStory](https://github.com/user-attachments/assets/aa1b5f45-117c-46ad-ac76-e351dd585fc7) |

## 🗒️ Catatan Pengembangan

- [ ] Refactor kode untuk efisiensi & maintainability
- [ ] Tambahkan fitur edit story & Detail Story
- [ ] Tingkatkan validasi input & error handling
- [ ] Implementasi infinite scroll di daftar story
- [ ] Optimalisasi performa peta
      
