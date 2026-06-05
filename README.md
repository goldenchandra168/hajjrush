# 🕋 Haji Rush — Petualangan Spiritual

> **Temple Run meets Hajj Spirituality** — Game edukasi Islam untuk anak-anak dan keluarga

[![Live Demo](https://img.shields.io/badge/🎮%20Live%20Demo-Play%20Now-gold)](https://USERNAME.github.io/haji-rush/)
[![License](https://img.shields.io/badge/License-Free%20Islamic%20Education-green)](#)
[![Golden Flow](https://img.shields.io/badge/By-Golden%20Flow%20%40goldenflow.id-blue)](https://instagram.com/goldenflow.id)

---

## 📖 Tentang Game

**Haji Rush** adalah game runner spiritual berbasis web yang menggabungkan keseruan bermain dengan edukasi ibadah Haji dan Umroh. Cocok untuk anak-anak usia 7-15 tahun dan siapa saja yang ingin belajar ritual haji dengan cara yang menyenangkan.

### ✨ Fitur Utama

| Fitur | Detail |
|-------|--------|
| 🕹️ Gameplay | One-button runner + slide mechanic |
| ⭐ Ihram Meter | Spiritual health bar unik — bukan blood/HP biasa! |
| 🗺️ 3 Fase Perjalanan | Madinah → Mekkah → Arafah |
| 🕌 Checkpoint Ritual | Mini-game Tawaf, Sa'i, dan Wukuf |
| 📚 Fun Facts | 15+ fakta Islam muncul saat bermain |
| 🤲 Doa Interaktif | Popup doa lengkap Arab + Latin + Arti |
| 🏆 Leaderboard | Via Google Sheets (gratis!) |
| 👤 Login System | Auto-remember via localStorage |
| 📱 Mobile Support | Touch-friendly, responsive |

---

## 🎮 Cara Bermain

| Kontrol | Aksi |
|---------|------|
| `SPACE` / Tap | **Lompat** — hindari batu & obstacle |
| `↓` / Swipe Bawah | **Slide** — hindari kotor unta |
| `💧 Zamzam` | Kumpulkan = +nyawa +poin +ihram |
| `⭐ Ihram Meter` | Jaga agar tetap penuh → Invincible! |

### 3 Fase Perjalanan
1. **🌙 Fase 1: Miqat** — Madinah, suasana subuh, obstacle batu & pohon kurma
2. **🕌 Fase 2: Thawaf Road** — Mekkah siang hari, kerumunan jamaah & unta
3. **🌅 Fase 3: Arafah** — Padang Arafah saat maghrib, heat wave & batu besar

### Checkpoint System
- **Tawaf**: Tap Ka'bah 7 kali (seperti tawaf sesungguhnya!)
- **Sa'i**: Tap cepat 10x dalam 5 detik
- **Wukuf**: Tahan Space/Tap 3 detik (belajar sabar!)

---

## 🚀 Deploy ke GitHub Pages (5 Menit!)

### Step 1: Clone / Upload ke GitHub
```bash
# Option A: Clone dan push
git clone https://github.com/YOURUSERNAME/haji-rush
# Upload file: index.html, style.css, game.js, gsheets.js

# Option B: Upload manual di GitHub.com
# → New Repository → Upload Files → Drag semua file
```

### Step 2: Aktifkan GitHub Pages
1. Buka repo di GitHub → **Settings**
2. Sidebar: **Pages**
3. Source: **Deploy from branch** → `main` → `/ (root)`
4. Klik **Save**
5. Tunggu 2-3 menit → Game live di:
   ```
   https://YOURUSERNAME.github.io/haji-rush/
   ```

### Step 3: Setup Google Sheets (Opsional — untuk Leaderboard)
1. Buka [Google Sheets](https://sheets.google.com) → Buat sheet baru
2. **Extensions** → **Apps Script**
3. Copy kode dari bagian komentar di `gsheets.js` ke editor Apps Script
4. **Deploy** → **New Deployment** → **Web App**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Klik **Deploy** → Copy URL yang muncul
6. Buka `gsheets.js` → Paste URL ke variabel `GAS_URL`:
   ```javascript
   const GAS_URL = "https://script.google.com/macros/s/YOUR_ID/exec";
   ```
7. Commit & push ke GitHub → Leaderboard aktif! 🎉

---

## 📁 Struktur File

```
haji-rush/
├── index.html    → UI utama + modal (login, menu, game over)
├── style.css     → Pixel art Islamic theme
├── game.js       → Game engine (canvas, physics, gameplay)
├── gsheets.js    → Google Sheets integration + Apps Script code
└── README.md     → Dokumentasi ini
```

---

## 🎨 Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Rendering | HTML5 Canvas (vanilla JS) |
| Styling | CSS3 + Google Fonts (Press Start 2P + Amiri) |
| Storage | localStorage (client-side, auto) |
| Backend | Google Apps Script + Sheets (gratis!) |
| Hosting | GitHub Pages (gratis!) |
| Framework | None — pure HTML/CSS/JS |

---

## 📞 Kontak & Info Umroh/Haji

Game ini dibuat oleh **Golden Flow** — layanan perjalanan Umroh & Haji terpercaya.

**Hubungi kami:**

| Platform | Link |
|----------|------|
| 💬 WhatsApp | [+62 895-3224-12300](https://wa.me/62895322412300) |
| 📸 Instagram | [@goldenflow.id](https://instagram.com/goldenflow.id) |
| 🧵 Threads | [@goldenflow.id](https://threads.net/@goldenflow.id) |
| 📘 Facebook | [@goldenflow.id](https://facebook.com/goldenflow.id) |

---

## ❤️ Dukung Pengembangan (Infaq)

Jika game ini bermanfaat dan Anda ingin mendukung pengembangan lebih lanjut:

> **Bank Syariah Indonesia (BSI)**
> No. Rekening: **7167474505**
> Atas Nama: **Golden Chandra Oentoro**

*Jazakallahu khairan atas dukungannya* 🤲

---

## 🗓️ Roadmap

- [x] MVP: Runner 3 fase + checkpoint + login
- [x] Leaderboard via Google Sheets
- [x] Mobile touch support
- [ ] Audio: Talbiyah + adzan adaptif
- [ ] Karakter unlockable (Haji Mabrur, Nenek Hafsah, dll)
- [ ] Event Ramadan: Tarawih Run mode
- [ ] Event Idul Adha: Hewan kurban runner!
- [ ] PWA: Install sebagai app

---

## 📜 Lisensi

Free untuk edukasi Islam. Dilarang digunakan untuk kepentingan komersial tanpa izin.

*Semoga bermanfaat dan menjadi amal jariyah* 🕋✨

---

<div align="center">
  Made with ❤️ by <a href="https://instagram.com/goldenflow.id">Golden Flow</a><br>
  <em>"Perjalanan seribu mil dimulai dengan satu langkah — atau satu lompatan!"</em>
</div>
