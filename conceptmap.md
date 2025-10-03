# **Concept Map – “Caelum Secretary”**

*(nama opsional, bisa diganti, Caelum = langit/ruang tak terbatas, cocok buat AI assistant)*

---

## 1. Judul Aplikasi

**Caelum Secretary**
“Sekretaris digital dengan AI yang membantu mengelola jadwal, project, dan aktivitas seorang indie software engineer.”

---

## 2. Deskripsi Singkat

Caelum Secretary adalah aplikasi personal assistant berbasis web/app yang menggabungkan manajemen kegiatan, project, dan AI conversation dalam satu ekosistem. AI tidak mengontrol langsung modul-modul, tetapi hadir di halaman chat untuk memberikan insight, rekomendasi, dan menyusun prioritas berdasarkan data yang ada.

---

## 3. Latar Belakang

* Seorang **indie software engineer** sering kewalahan mengatur jadwal meeting, project, dan task coding.
* Tools manajemen project yang ada (seperti Trello, Notion, Asana) kadang terlalu berat atau tidak personal.
* Dibutuhkan aplikasi yang **sederhana, personal, dan punya kecerdasan kontekstual**.
* Dengan bantuan AI + data terstruktur (JSON), sistem bisa berperan sebagai sekretaris pribadi yang membantu user tetap fokus.

---

## 4. Tujuan

1. Memberikan platform sederhana untuk mengelola jadwal dan project.
2. Menyediakan ruang chat AI yang personal, terhubung dengan data user.
3. Membantu user memprioritaskan kegiatan tanpa kehilangan kendali penuh.
4. Menjadi pusat informasi produktivitas yang konsisten dan personal.

---

## 5. Modul Utama

1. **Dashboard**

   * Ringkasan kegiatan & project aktif.
2. **Manajemen Kegiatan & Kalender**

   * CRUD jadwal.
   * Reminder notifikasi.
3. **Manajemen Project**

   * List project (nama, client, tech stack).
   * Halaman detail project (requirement, task, catatan).
4. **Halaman Chat (AI Assistant)**

   * Chat UI.
   * AI membaca konteks dari JSON.
   * AI memberi saran prioritas, ide, atau pengingat.
5. **Pengaturan & Profil**

   * Info pribadi user (bio, preferensi kerja).
   * Personality AI.
   * Export/import JSON.

---

## 6. Fitur-Fitur

* **Kegiatan & Kalender**

  * Tambah/edit/hapus jadwal.
  * Lihat kalender mingguan/bulanan.
* **Project Management**

  * Tambah/edit project.
  * Tambah requirement feature.
  * Tambah task dengan status (todo/in-progress/done).
* **AI Chat**

  * Berbasis Gemini API.
  * Menggunakan JSON sebagai meta konteks.
  * Bisa menjawab pertanyaan tentang jadwal & project.
* **Data Handling**

  * Export JSON (untuk meta konteks AI).
  * Auto update JSON setiap ada perubahan.
* **User Personalization**

  * Profil user & preferensi kerja.
  * Personality AI customizable.

---

## 7. User Flow

**a. Setup Awal**
User buat akun → isi profil (nama, role, preferensi kerja, tech stack).

**b. Manajemen Kegiatan**
User tambah jadwal (misal meeting client).
→ Data tersimpan di DB.
→ JSON auto-update.

**c. Manajemen Project**
User bikin project baru → isi tech stack, client, requirement.
→ Tambah task (status: todo/done).
→ JSON auto-update.

**d. Interaksi dengan AI**
User buka halaman chat → tanya ke AI:

* “Apa prioritas minggu ini?”
* “Project mana yang perlu aku selesaikan dulu?”
  Sistem generate konteks:
* JSON (jadwal + project + task).
* Personality AI.
  → AI balas sesuai konteks.

**e. Siklus Berulang**
User update data → JSON update → AI selalu dapat konteks terbaru.

---

## 8. Kesimpulan

Caelum Secretary bukan sekadar aplikasi manajemen kegiatan biasa, tetapi **sebuah sekretaris digital personal**. Dengan pemisahan jelas antara modul manajemen data (jadwal, project) dan modul AI (chat), aplikasi ini tetap **ringan, fleksibel, dan aman**, sambil tetap memberikan kecerdasan tambahan lewat AI yang paham konteks user.
Hasil akhirnya: user (indie software engineer) punya ruang kerja yang rapi, personal, dan didukung AI yang berperan sebagai partner produktivitas.

---

