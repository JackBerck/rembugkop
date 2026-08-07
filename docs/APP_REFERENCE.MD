# APP_REFERENCE.md — RembugKop.id

Dokumen acuan produk + desain untuk RembugKop.id. Dipakai sebagai konteks utama saat vibe-coding (AI perlu tahu *kenapa* produk ini ada, bukan cuma *apa* fiturnya) dan sebagai design system supaya konsisten di semua halaman.

---

## 1. Tentang Produk

**Nama**: RembugKop.id
**Tagline**: "Satu Rembug, Transparan Pengelolaannya, Berdaya Asetnya."

### Latar Belakang

Koperasi desa/KUD adalah fondasi ekonomi akar rumput di Indonesia. Tapi banyak koperasi desa stagnan karena dua hal: aset fisik (traktor, mesin giling, gedung serbaguna) dikelola manual dan sering menganggur, dan partisipasi anggota pasif karena minim transparansi pencatatan kas — yang ujungnya bikin krisis kepercayaan warga terhadap pengurus.

### Masalah yang Diselesaikan

1. **Minim transparansi finansial** — laporan kas tidak real-time, rawan manipulasi, sulit diaudit anggota grassroot.
2. **Aset menganggur (low utility)** — aset produktif desa tidak punya katalog publik yang bisa diakses warga.
3. **Manajemen pemesanan manual** — buku fisik rawan double-booking dan bentrok jadwal.
4. **Partisipasi pasif** — RAT (Rapat Anggota Tahunan) cuma setahun sekali, tidak ada ruang keterlibatan harian.

### Solusi

Platform web terpadu dengan tiga pilar:
- **Rembug Digital** — musyawarah/voting digital berbasis prinsip DAO (tanpa kerumitan blockchain), warga bersuara soal pengadaan aset & kebijakan.
- **Sewa Aset Koperasi** — katalog aset fisik desa dengan kalender interaktif, cegah bentrok jadwal, tarif otomatis.
- **Real-Time Treasury Dashboard** — arus kas terbuka untuk seluruh anggota, riwayat transaksi immutable (hash-chain).

### Keunikan (Unique Value Proposition)

- **Siklus Ekonomi Tertutup**: warga bermusyawarah beli aset → aset disewakan → hasil sewa kembali ke kas bersama. Uang berputar di dalam komunitas, bukan keluar.
- **Prinsip DAO Berorientasi Lokal**: transparansi ala DAO, dikemas sesuai tradisi rembug/musyawarah desa — bukan teknologi asing yang dipaksakan.
- **Double-Impact**: menyelesaikan krisis transparansi tata kelola *dan* mengoptimalkan aset fisik desa dalam satu platform.

### Elevator Pitch

RembugKop adalah platform modernisasi ekosistem koperasi desa yang mendemokratisasi tata kelola lewat Rembug Digital (micro-voting berbasis prinsip DAO) dan mengoptimalkan utilitas aset fisik lewat sistem reservasi silang terintegrasi. Warga berpartisipasi menentukan pengadaan aset, menyewakannya secara transparan, dan memantau kas desa secara real-time.

### Target Pengguna

| Role | Kebutuhan utama |
|---|---|
| **Warga/Anggota** | Lihat & sewa aset, ikut voting proposal, pantau kas — mayoritas awam teknologi, rentang usia luas termasuk lansia |
| **Pengurus Koperasi** | Kelola aset, approve reservasi, ajukan proposal, catat kas manual |
| **Super Admin** | Kelola user, role, dan pengawasan sistem keseluruhan |

> Implikasi penting buat desain: target user **bukan** anak muda urban melek teknologi. UI harus jelas, tulisan cukup besar, alur singkat, istilah bahasa Indonesia yang familiar — bukan jargon teknis/fintech ala startup Jakarta.

### Stack Teknis

Laravel 13 + Inertia.js v3 · React 19 + TailwindCSS v4 + ShadCN UI · Laravel Fortify (Passkeys & 2FA) + Wayfinder · MySQL/PostgreSQL

---

## 2. Arah Desain

### Prinsip

Minimalis, modern, simpel. Warna lembut, bukan mencolok — karena target user lintas kalangan (termasuk warga desa yang lebih tua/kurang familiar teknologi) butuh tampilan yang tenang, tidak membingungkan, dan terasa terpercaya (ingat: ini platform yang membawa isu kepercayaan/transparansi kas).

Nuansa yang ingin dibangun: **kehangatan gotong-royong desa** dipadukan **ketenangan sebuah dashboard keuangan yang bisa dipercaya**. Bukan nuansa "startup fintech Jakarta", bukan juga "website pemerintahan kaku".

### Token Warna

6 warna inti, dinamai berdasarkan hal-hal yang akrab di desa — supaya konsisten dipakai dan gampang diingat maknanya:

| Nama | Hex | Peran | Kenapa |
|---|---|---|---|
| **Rice White** (background) | `#F5F6F0` | Latar utama | Putih hangat sedikit kehijauan, bukan putih steril rumah sakit — terasa seperti kertas/beras, bukan layar dingin |
| **Ink Umber** (foreground) | `#2C2A24` | Teks utama | Coklat gelap hampir hitam — kontras cukup untuk keterbacaan lansia, tapi lebih lembut dari hitam pekat |
| **Moss Sage** (primary) | `#57795C` | Tombol utama, link, elemen brand | Hijau lumut — asosiasi pertanian, gotong-royong, pertumbuhan. Warna paling sering muncul di UI |
| **Telaga Teal** (accent/secondary) | `#356169` | Highlight dashboard kas, CTA sekunder, elemen "transparansi" | Teal dalam — air jernih/telaga, dipakai khusus di area yang berhubungan dengan kepercayaan & data finansial supaya terasa beda dari aksi umum (hijau) |
| **Anyaman Beige** (muted) | `#E7E2D3` | Border, divider, card background, disabled state | Krem anyaman bambu — netral, dipakai luas tapi tidak pernah jadi pusat perhatian |
| **Bata Merah Pudar** (destructive/warning) | `#B1503A` | Kas keluar, tolak voting, error — **hanya semantik, tidak dekoratif** | Merah bata pudar, bukan merah alarm terang — tetap dalam nuansa "lembut" tapi tetap jelas menandakan negatif/perhatian |

**Aturan pemakaian penting**: `Bata Merah Pudar` HANYA untuk makna negatif/peringatan (expense, reject, error). Jangan dipakai dekoratif. `Telaga Teal` dikhususkan untuk konteks finansial/transparansi (dashboard kas, badge "Terverifikasi") supaya warga belajar mengasosiasikan warna itu dengan "ini area yang bisa dipercaya/diaudit". Di luar dua warna semantik itu, `Moss Sage` adalah warna aksi/brand default.

CSS variables (format shadcn/ui, sesuaikan HSL persis pakai color converter saat implementasi):

```css
:root {
  --background: 72 25% 96%;      /* Rice White #F5F6F0 */
  --foreground: 40 14% 16%;      /* Ink Umber #2C2A24 */

  --primary: 128 16% 39%;        /* Moss Sage #57795C */
  --primary-foreground: 0 0% 100%;

  --secondary: 190 33% 27%;      /* Telaga Teal #356169 */
  --secondary-foreground: 0 0% 100%;
  --accent: 190 33% 27%;         /* alias ke secondary untuk highlight finansial */
  --accent-foreground: 0 0% 100%;

  --muted: 45 30% 88%;           /* Anyaman Beige #E7E2D3 */
  --muted-foreground: 40 10% 40%;

  --destructive: 11 48% 45%;     /* Bata Merah Pudar #B1503A */
  --destructive-foreground: 0 0% 100%;

  --border: 45 30% 85%;
  --card: 0 0% 100%;
  --card-foreground: 40 14% 16%;
  --radius: 0.75rem;
}
```

> Belum perlu dark mode di MVP — target user desa umumnya browsing siang hari/light mode default. Skip dulu supaya fokus, bisa ditambah belakangan.

### Tipografi

Dua peran font, sengaja **tidak** pakai serif kontras-tinggi (terlalu "editorial/majalah", kurang cocok buat dashboard data dan pengguna lintas usia yang butuh keterbacaan maksimal):

- **Heading**: [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) — geometric-humanist, hangat tapi tetap modern, dukungan karakter Bahasa Indonesia bagus, mulai lazim dipakai di aplikasi sipil/fintech Indonesia jadi terasa familiar & terpercaya. Pakai weight 600–700 untuk judul.
- **Body/UI**: [Inter](https://fonts.google.com/specimen/Inter) — salah satu font paling teruji untuk keterbacaan di ukuran kecil dan tabel data. Pakai untuk paragraf, label form, tabel kas/reservasi.
- **Angka finansial** (dashboard kas, tarif sewa): aktifkan `font-variant-numeric: tabular-nums` di Inter supaya digit rata kolom — penting untuk tabel kas yang gampang dibaca.

Skala tipografi mengikuti utility yang sudah kamu punya (`title-font-size`, `subtitle-font-size`, `normal-font-size`, `small-font-size`) — jangan bikin skala baru, cukup pasang `font-heading`/`font-body` di atasnya.

```css
@layer base {
  h1, h2, h3, h4, .font-heading {
    font-family: "Plus Jakarta Sans", sans-serif;
  }
  body, .font-body {
    font-family: "Inter", sans-serif;
    font-variant-numeric: tabular-nums;
  }
}
```

### Elemen Signature: Motif Anyaman

Satu elemen visual yang dipakai konsisten dan jadi "ciri" RembugKop: garis tipis pola **anyaman** (motif tenun/bambu tradisional), dipakai sangat halus (opacity 4–8%) sebagai:
- Tekstur background di hero section (bukan gambar besar, cuma garis-garis tipis di pojok/tepi).
- Divider antar section (pengganti garis lurus polos).
- Background empty-state (mis. "belum ada proposal aktif").

Filosofinya: anyaman = hasil kerja bersama, helai-helai individual yang jadi kuat kalau disatukan — mewakili semangat gotong-royong & koperasi tanpa harus pakai ilustrasi orang-orangan generik atau ikon "handshake" yang klise. **Ini satu-satunya elemen dekoratif yang "berani"** — di luar itu, desain tetap flat, minim shadow, minim gradient.

### Layout & Struktur Section

Ikuti pola yang sudah kamu tetapkan — container width beda per konteks:

- `max-w-3xl` — konten teks panjang, form single-column (mis. form reservasi, detail proposal)
- `max-w-5xl` — konten campuran teks+card (mis. landing page section, katalog aset preview)
- `max-w-7xl` — dashboard/tabel data (mis. tabel kas, daftar reservasi pengurus)

Contoh pola section, warna disesuaikan per konteks:

```jsx
{/* Hero — landing page */}
<section className="bg-background pt-32 pb-16 text-center text-foreground" data-reveal>
  <div className="container max-w-5xl section-padding-x">
    {/* headline pakai font-heading, tagline pakai normal-font-size */}
  </div>
</section>

{/* Section konten netral, dengan tekstur anyaman tipis di background */}
<section className="bg-muted/40 pt-16 pb-16 text-foreground relative" data-reveal>
  <div className="container max-w-5xl section-padding-x">
    {/* katalog aset / daftar proposal */}
  </div>
</section>

{/* Section finansial/transparansi — pakai secondary (Telaga Teal) sebagai aksen, bukan background penuh */}
<section className="bg-background pt-16 pb-16 text-foreground" data-reveal>
  <div className="container max-w-7xl section-padding-x">
    {/* dashboard kas: border-secondary/20, badge bg-secondary text-secondary-foreground di angka penting */}
  </div>
</section>

{/* CTA penutup */}
<section className="bg-primary pt-16 pb-24 text-center text-primary-foreground" data-reveal>
  <div className="container max-w-3xl section-padding-x">
    {/* ajakan gabung/rembug */}
  </div>
</section>
```

Hindari full-bleed warna gelap besar-besar di banyak section (kesannya berat/menakutkan buat user awam) — pakai `bg-primary`/`bg-secondary` solid hanya untuk section kecil yang butuh penekanan (CTA, banner highlight), sisanya tetap di atas `bg-background`/`bg-muted`.

### Aksesibilitas & Keterbacaan (wajib, bukan opsional)

Karena target user lintas kalangan termasuk lansia dan warga kurang familiar teknologi:
- Jangan turunkan body text di bawah `text-sm` (14px) di mobile — kelas `normal-font-size` yang sudah ada (`text-sm sm:text-base`) itu batas minimum, bukan default aman untuk semua teks. Body copy penting pertimbangkan langsung `text-base`.
- Target sentuh tombol minimal 44×44px, terutama untuk tombol approve/reject/vote yang aksinya penting.
- Kontras warna teks-background minimum rasio AA (4.5:1) — `Ink Umber` di atas `Rice White` sudah aman, tapi hindari taruh teks abu-abu muda di atas `Anyaman Beige`.
- Animasi (`data-reveal` dan sejenis) secukupnya — hormati `prefers-reduced-motion`, jangan bikin transisi yang bikin pusing/lambat dipahami user awam.

### Ikonografi & Gambar

- Ikon: line icon simpel & konsisten ketebalan garis (Lucide, sudah tersedia lewat ShadCN) — hindari icon set campuran gaya.
- Foto: kalau ada foto aset/desa asli, pakai apa adanya (foto traktor/gedung/mesin sungguhan) — lebih dipercaya warga daripada ilustrasi generik "flat design orang-orangan" yang terasa template SaaS.
- Kalau butuh ilustrasi (empty state, onboarding), pertahankan garis motif anyaman sebagai elemen visual utama, bukan karakter kartun.

### Suara & Nada Tulisan (Voice & Tone)

- Bahasa Indonesia baku tapi hangat — bukan bahasa gaul kekinian, bukan juga kaku ala surat dinas.
- Sapaan netral **"Anda"**, bukan "kamu" — supaya sopan untuk semua rentang usia dan status sosial di desa.
- Tulis dari sisi pengguna, bukan sisi sistem: "Ajukan reservasi" bukan "Submit request"; "Kas masuk" bukan "Income transaction logged".
- Kalimat aksi konsisten dari tombol sampai konfirmasi: tombol "Setujui Proposal" → notifikasi "Proposal disetujui", bukan "Sukses!" yang generik.
- Pesan error/kosong jelas kasih tahu apa yang terjadi dan langkah berikutnya, bukan cuma "Terjadi kesalahan". Contoh: "Belum ada proposal aktif. Pengurus bisa mulai rembug baru lewat menu Ajukan Proposal."

---

## 3. Cara Pakai Dokumen Ini

Saat generate komponen/halaman baru (vibe coding), rujuk balik ke bagian §2 untuk token warna, font, dan pola section — jangan improvisasi warna/font baru di luar tabel token. Kalau brief fitur baru butuh warna semantik baru (mis. status "pending" butuh warna sendiri), tambahkan ke tabel token di file ini dulu sebelum dipakai di kode, supaya tetap satu sumber kebenaran.