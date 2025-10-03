# Tech Stack – Caelum Secretary (Monolith)

Aplikasi ini dirancang sebagai monolith Node.js yang sederhana, cepat, dan mudah dirawat. Fokus pada komponen rakitan (modular, minimal dependency), dengan backend Fastify, database SQLite, frontend Vue + TailwindCSS, dan integrasi AI menggunakan Google Generative AI (Gemini).

---

## Tujuan Desain
- **Monolith sederhana**: satu codebase, deployment mudah, latensi rendah antara UI, API, dan DB.
- **Kinerja**: Fastify sebagai HTTP server yang cepat.
- **Portabilitas**: SQLite sebagai single-file DB, cocok untuk desktop/server kecil.
- **DX (Developer Experience)**: Vue 3 + Vite untuk dev server cepat dan HMR.
- **AI Assist**: Integrasi Gemini untuk insight berbasis konteks data pengguna.

---

## Komponen Utama
- **Runtime**: Node.js LTS (≥ 20.x)
- **Server**: Fastify
  - @fastify/static – serve aset frontend build
  - @fastify/cors – CORS untuk pengembangan/ekstensi klien
  - @fastify/formbody – parsing form/urlencoded (opsional)
- **Database**: SQLite
  - better-sqlite3 – binding SQLite sinkron yang stabil dan cepat untuk monolith
  - Alternatif: sqlite3 (async) bila diperlukan
- **Frontend**: Vue 3 + Vite
  - @vitejs/plugin-vue
  - TailwindCSS + PostCSS + Autoprefixer
- **AI (Gemini)**: @google/generative-ai (server-side)
- **Testing (opsional)**: Vitest (frontend), tap/uvu/jest (server)
- **Linter/Format**: ESLint + Prettier

---

## Struktur Direktori yang Disarankan (Gaya Laravel 12)
```
/ (root)
├─ app/
│  ├─ Http/
│  │  ├─ Controllers/          # Controller (logic HTTP, validasi, formatting response)
│  │  └─ Middleware/           # Middleware Fastify (opsional)
│  ├─ Models/                  # Model (akses SQLite via better-sqlite3)
│  └─ Services/                # (opsional) Orkestrasi domain/AI
├─ server/
│  ├─ index.js                 # entry Fastify (bootstrap server)
│  ├─ routes/
│  │  ├─ web.js                # rute web (SSR/statik) -> delegasi ke controller
│  │  └─ api.js                # rute API -> delegasi ke controller
│  ├─ views/                   # View server-side (opsional SSR/HTML sederhana)
│  ├─ lib/
│  │  ├─ db.js                 # koneksi better-sqlite3
│  │  └─ gemini.js             # klien Gemini (server-side)
│  └─ bootstrap.js             # inisialisasi plugin Fastify (cors, static, dll)
├─ config/                     # konfigurasi aplikasi (env mapping, constants)
├─ database/
│  ├─ migrations/              # file migrasi schema SQL
│  ├─ seeders/                 # seeder awal
│  └─ sqlite/                  # lokasi file DB
│     └─ sqlite.db             # (jangan commit, .gitignore)
├─ resources/
│  ├─ index.html
│  ├─ src/
│  │  ├─ main.js               # bootstrap Vue
│  │  ├─ App.vue
│  │  ├─ pages/                # Client-side Views (Dashboard, Calendar, Projects, Chat)
│  │  └─ components/
│  ├─ vite.config.js
│  ├─ tailwind.config.js
│  ├─ postcss.config.js
│  └─ package.json             # script frontend
├─ public/                      # aset statis (favicon, icons)
├─ techstack.md
├─ README.md
└─ package.json                 # script root untuk orkestrasi dev/build
```

### Konvensi Folder ala Laravel 12
- **`app/Http/Controllers`**: controller Fastify (HTTP logic) menggantikan `server/controllers` sebelumnya.
- **`app/Models`**: model akses DB (SQLite) menggantikan `server/models` sebelumnya.
- **`server/routes`**: analog `routes/web.php` dan `routes/api.php` → dipisah `web.js` dan `api.js`.
- **`resources/`**: analog `resources/` Laravel untuk View (Vue + Tailwind, Vite) dan asset sumber.
- **`public/`**: root dokumen yang disajikan ke browser; hasil build frontend dikirim ke sini.
- **`database/`**: migrasi dan seeder seperti Laravel; lokasi file DB berada di `database/sqlite/sqlite.db`.
- **`config/`**: konfigurasi terpusat (konstanta, mapping env) mirip `config/*.php`.

---

## Arsitektur MVC
- **Model (M)**
  - Lokasi: `app/Models/`
  - Tanggung jawab: operasi data terhadap SQLite menggunakan `better-sqlite3`.
  - Bentuk: fungsi/kelas per entitas (`Project.js`, `Task.js`, dst) yang melakukan CRUD dan mapping hasil query ke objek.

- **View (V)**
  - Utama: Client-side views di `resources/src/pages/` dengan Vue 3 + TailwindCSS.
  - Opsional: Server-side `server/views/` (mis. render HTML sederhana untuk halaman health/status atau fallback SSR ringan).

- **Controller (C)**
  - Lokasi: `app/Http/Controllers/`
  - Tanggung jawab: logika HTTP, validasi input, komposisi data dari Model, pemanggilan Gemini via `server/lib/gemini.js`, dan formatting response.
  - Rute didefinisikan di `server/routes/` (`web.js`/`api.js`) dan mendelegasikan ke controller.

### Pemetaan Teknis
- `Fastify routes` → memanggil `Controller` terkait.
- `Controller` → memanggil `Model` (`app/Models`) untuk DB dan/atau `lib/gemini.js` untuk AI.
- `Vue pages/components` → konsumsi API dari Controller melalui endpoint `/api/*`.

### Contoh Alur Request
1. `GET /api/projects`
   - `server/routes/api.js` → `ProjectsController.list()` → `app/Models/Project.findAll(db)` → hasil dikembalikan sebagai JSON.
2. `POST /api/projects/:id/tasks`
   - Validasi payload di controller → `app/Models/Task.create(db, payload)` → response 201.
3. `POST /api/chat`
   - Controller mengumpulkan konteks dari beberapa model (events, projects, tasks, profile) → membentuk prompt JSON → panggil `lib/gemini.js` → kirim hasil ke klien.

### Validasi & Error Handling
- Gunakan schema Fastify (JSON Schema) pada rute untuk validasi request/response.
- Tangani error terpusat di controller (mapping error DB ke HTTP code yang tepat).

---

## Alur Build & Serve
- **Pengembangan**
  - Vite dev server berjalan di port (mis. 5173) untuk HMR.
  - Fastify berjalan di port (mis. 3000) untuk API.
  - Gunakan proxy Vite ke Fastify untuk endpoint `/api/*` atau sebaliknya.
- **Produksi**
  - Build frontend: `vite build` menghasilkan output ke `public/` (contoh: `public/assets` atau `public/dist`).
  - Fastify menggunakan `@fastify/static` untuk menyajikan konten di `public/` dan menangani API.

---

## Dependensi yang Direkomendasikan
- Server
  - fastify
  - @fastify/static
  - @fastify/cors
  - @fastify/formbody (opsional)
  - better-sqlite3
  - @google/generative-ai
  - dotenv (muat variabel env)
- Frontend
  - vue
  - vite
  - @vitejs/plugin-vue
  - tailwindcss
  - postcss
  - autoprefixer
- Dev (opsional)
  - eslint
  - prettier
  - concurrently (menjalankan server & web bersamaan saat dev)
  - cross-env

---

## Variabel Lingkungan
- `GEMINI_API_KEY` – kunci API Google Generative AI.
- `PORT` – port Fastify (default 3000).
- `NODE_ENV` – `development` / `production`.
- `DATABASE_PATH` – path file SQLite (default `server/db/sqlite.db`).

Contoh `.env` (jangan commit):
```
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
NODE_ENV=development
DATABASE_PATH=./server/db/sqlite.db
```

---

## Pola Integrasi Gemini
- Backend-only: panggilan API Gemini dilakukan di server (`server/lib/gemini.js`) untuk menjaga keamanan kunci API.
- Frontend memanggil endpoint server mis. `POST /api/chat` dengan payload konteks (ringkasan jadwal/project) yang dihasilkan dari DB.
- Server menyiapkan prompt dengan data terstruktur (JSON) + persona, lalu meneruskan ke Gemini dan mengembalikan hasil ke klien.

Keamanan:
- Jangan expose kunci API ke browser.
- Rate limit endpoint AI jika diperlukan.

---

## Skema Data Minimal (SQLite)
- `projects (id, name, client, tech_stack, created_at)`
- `project_requirements (id, project_id, title, description)`
- `tasks (id, project_id, title, status, due_date)`
- `events (id, title, starts_at, ends_at, location, notes)`
- `profile (id, name, role, preferences_json, ai_persona)`

Catatan: Simpan preferensi dan persona sebagai JSON string untuk fleksibilitas.

---

## Rute API Inti (Contoh)
- `GET /api/health` – health check
- `GET /api/projects` / `POST /api/projects`
- `GET /api/projects/:id` / `PUT /api/projects/:id` / `DELETE /api/projects/:id`
- `GET /api/projects/:id/tasks` / `POST /api/projects/:id/tasks`
- `GET /api/events` / `POST /api/events`
- `POST /api/chat` – endpoint Gemini (server-side)
- `GET /api/export` – ekspor JSON untuk konteks AI

---

## Frontend (Vue + Tailwind)
- Gunakan **Composition API** untuk state lokal.
- State global ringan via **Pinia** (opsional) agar tetap sederhana.
- Komponen utama: `DashboardPage`, `CalendarPage`, `ProjectsPage`, `ChatPage`.
- Tailwind untuk styling utilitas dan konsistensi desain.

---

## Testing & Kualitas Kode (Opsional)
- Unit test server (services) dan frontend (komponen).
- ESLint + Prettier untuk konsistensi formatting.
- Basic CI: lint + test di push/PR.

---

## Langkah Implementasi Ringkas
1. Inisialisasi `package.json` root, tambahkan `concurrently` untuk skrip dev.
2. Setup `server/` dengan Fastify, koneksi better-sqlite3, dan rute dasar.
3. Setup `web/` dengan Vite + Vue + Tailwind, halaman inti, dan proxy ke `/api` saat dev.
4. Tambahkan build pipeline: `vite build` dan serve `web/dist/` oleh Fastify.
5. Buat endpoint `POST /api/chat` yang memanggil Gemini menggunakan `@google/generative-ai`.
6. Tambah schema SQL dan seed minimal, plus util ekspor JSON untuk konteks AI.

---

## Catatan Produksi
- Simpan `sqlite.db` di volume yang persisten.
- Tambahkan backup berkala.
- Konfigurasi CORS hanya bila perlu.
- Atur logging Fastify sesuai kebutuhan (pino).

---

Dokumen ini menjadi acuan implementasi awal agar pengembangan konsisten dengan visi: monolith Node.js + Fastify, SQLite, Vue + Tailwind, dan integrasi Gemini.
