# Requirements Document

## Introduction

Fitur `public-base-view` membangun pondasi tampilan publik (tanpa login) untuk platform RembugKop.id — modernisasi koperasi desa Indonesia. Cakupannya meliputi: komponen Navbar dan Footer yang shared dan responsif, file navigasi terpusat TypeScript, `PublicLayout` sebagai wrapper halaman publik, serta halaman-halaman publik itu sendiri yang dikelompokkan per kategori (halaman utama dan halaman legal).

Semua halaman yang sudah ada (`asset-catalog.tsx`, `asset-detail.tsx`) dibungkus dengan `PublicLayout` — tidak dibangun ulang dari nol. Halaman Beranda baru (`/`) menggantikan `welcome.tsx` bawaan Laravel.

Design system mengacu pada token warna RembugKop (Rice White, Ink Umber, Moss Sage, Telaga Teal, Anyaman Beige, Bata Merah Pudar), tipografi Plus Jakarta Sans (heading) + Inter (body), dan motif anyaman sebagai elemen dekoratif signature.

---

## Glossary

- **PublicLayout**: Komponen React layout yang membungkus semua halaman publik dengan Navbar dan Footer.
- **Navbar**: Komponen navigasi atas yang shared, responsif, dan mobile-friendly.
- **Footer**: Komponen footer bawah yang shared, berisi tautan penting dan identitas platform.
- **PublicNavigation**: File TypeScript terpusat di `resources/js/config/public-navigation.ts` yang mendefinisikan seluruh item navigasi publik — diimpor oleh Navbar dan Footer.
- **NavItem**: Tipe TypeScript yang sudah ada di `resources/js/types/navigation.ts`, berisi `title`, `href`, dan opsi `icon`.
- **Halaman Utama**: Kelompok halaman di `resources/js/pages/public/` — Beranda (`/`), Tentang (`/tentang`), FAQ (`/faq`), Katalog Aset (`/aset`), dan Detail Aset (`/aset/{id}`).
- **Halaman Legal**: Kelompok halaman di `resources/js/pages/legal/` — Kebijakan Privasi (`/kebijakan-privasi`) dan Syarat & Ketentuan (`/syarat-ketentuan`). Konten bersifat statis untuk MVP.
- **Design Token**: Token warna dan tipografi RembugKop yang terdefinisi di `APP_REFERENCE.MD` dan perlu diterapkan ke `resources/css/app.css`.
- **Motif Anyaman**: Pola garis tipis tradisional yang dipakai sebagai tekstur dekoratif dengan opacity 4–8% di elemen hero/divider.
- **Wayfinder**: Library yang menghasilkan fungsi TypeScript dari named Laravel routes, diimpor dari `@/routes/`.

---

## Requirements

### Requirement 1: CSS Variables Design Token RembugKop

**User Story:** Sebagai developer, saya ingin CSS variables di `app.css` mencerminkan design token RembugKop, supaya seluruh komponen yang menggunakan token Tailwind (`bg-primary`, `text-foreground`, dll.) otomatis tampil sesuai identitas visual platform tanpa perlu override manual per komponen.

#### Acceptance Criteria

1. THE `app.css` SHALL mendefinisikan CSS variable `--background` dengan nilai oklch yang setara dengan Rice White `#F5F6F0`.
2. THE `app.css` SHALL mendefinisikan CSS variable `--foreground` dengan nilai oklch yang setara dengan Ink Umber `#2C2A24`.
3. THE `app.css` SHALL mendefinisikan CSS variable `--primary` dengan nilai oklch yang setara dengan Moss Sage `#57795C`, dan `--primary-foreground` dengan nilai oklch yang setara dengan putih `#FFFFFF`.
4. THE `app.css` SHALL mendefinisikan CSS variable `--secondary` dengan nilai oklch yang setara dengan Telaga Teal `#356169`, dan `--secondary-foreground` dengan nilai oklch yang setara dengan putih `#FFFFFF`.
5. THE `app.css` SHALL mendefinisikan CSS variable `--muted` dengan nilai oklch yang setara dengan Anyaman Beige `#E7E2D3`.
6. THE `app.css` SHALL mendefinisikan CSS variable `--destructive` dengan nilai oklch yang setara dengan Bata Merah Pudar `#B1503A`.
7. THE `app.css` SHALL mendefinisikan `--font-sans` menggunakan font Inter sebagai font body utama.
8. THE `app.css` SHALL mendefinisikan rule `@layer base` yang menerapkan font Plus Jakarta Sans untuk elemen `h1`, `h2`, `h3`, `h4`, dan class `.font-heading`, serta Inter untuk `body`.
9. THE `app.css` SHALL menghapus atau menonaktifkan blok `.dark {}` karena dark mode tidak dibutuhkan untuk MVP.

---

### Requirement 2: File Navigasi Terpusat (`PublicNavigation`)

**User Story:** Sebagai developer, saya ingin satu file TypeScript terpusat yang mendefinisikan semua item navigasi publik, supaya perubahan navigasi cukup dilakukan di satu tempat tanpa menyentuh Navbar dan Footer secara terpisah.

#### Acceptance Criteria

1. THE `PublicNavigation` SHALL berada di path `resources/js/config/public-navigation.ts`.
2. THE `PublicNavigation` SHALL mengekspor konstanta `mainNavItems` bertipe `NavItem[]` yang berisi item navigasi utama: Beranda (`/`), Tentang (`/tentang`), FAQ (`/faq`), dan Katalog Aset menggunakan Wayfinder route function `assetCatalog()`.
3. THE `PublicNavigation` SHALL mengekspor konstanta `legalNavItems` bertipe `NavItem[]` yang berisi: Kebijakan Privasi (`/kebijakan-privasi`) dan Syarat & Ketentuan (`/syarat-ketentuan`).
4. THE `PublicNavigation` SHALL menggunakan tipe `NavItem` yang diimpor dari `@/types/navigation`.
5. THE `PublicNavigation` SHALL menggunakan Wayfinder route functions dari `@/routes/` untuk setiap route yang sudah memiliki named route di Laravel (seperti `asset-catalog`), dan URL string literal hanya untuk route yang belum memiliki named route.
6. IF sebuah route yang dirujuk di `PublicNavigation` tidak memiliki named route Laravel, THEN THE `PublicNavigation` SHALL menggunakan URL path string literal sebagai fallback sementara dengan komentar `// TODO: add named route`.

---

### Requirement 3: Komponen Navbar

**User Story:** Sebagai pengunjung platform, saya ingin melihat navigasi atas yang jelas dan responsif di setiap halaman publik, supaya saya dapat berpindah antar halaman dengan mudah baik dari desktop maupun perangkat mobile.

#### Acceptance Criteria

1. THE `Navbar` SHALL berada di `resources/js/components/public/navbar.tsx`.
2. THE `Navbar` SHALL menampilkan logo/nama platform "RembugKop.id" di sisi kiri yang merupakan tautan ke halaman Beranda (`/`).
3. THE `Navbar` SHALL menampilkan item navigasi dari `mainNavItems` pada `PublicNavigation` di desktop (lebar layar `md` ke atas).
4. THE `Navbar` SHALL menampilkan tombol CTA "Masuk" yang mengarah ke route login Laravel Fortify di sisi kanan pada desktop.
5. WHEN pengguna mengakses halaman dari perangkat dengan lebar layar di bawah `md`, THE `Navbar` SHALL menyembunyikan item navigasi dan CTA, dan menampilkan tombol hamburger (ikon menu).
6. WHEN pengguna menekan tombol hamburger pada mobile, THE `Navbar` SHALL menampilkan menu navigasi yang dapat ditutup (drawer/dropdown), memuat seluruh `mainNavItems` ditambah tombol "Masuk".
7. WHEN pengguna menekan tombol hamburger kembali atau menekan item navigasi di menu mobile, THE `Navbar` SHALL menutup menu navigasi mobile.
8. THE `Navbar` SHALL menandai item navigasi yang aktif (halaman saat ini) dengan gaya visual yang berbeda menggunakan Inertia's `usePage()` hook untuk mendeteksi URL aktif.
9. THE `Navbar` SHALL memiliki latar belakang `bg-background` dengan efek `border-b border-border` untuk memisahkan dari konten halaman.
10. IF elemen interaktif di Navbar (tombol, tautan nav) memiliki area sentuh, THEN THE `Navbar` SHALL memastikan area sentuh minimal 44×44px untuk aksesibilitas pengguna mobile termasuk lansia.

---

### Requirement 4: Komponen Footer

**User Story:** Sebagai pengunjung platform, saya ingin melihat footer yang konsisten di semua halaman publik, supaya saya dapat menemukan tautan legal, informasi platform, dan informasi kontak dengan mudah.

#### Acceptance Criteria

1. THE `Footer` SHALL berada di `resources/js/components/public/footer.tsx`.
2. THE `Footer` SHALL menampilkan nama dan tagline platform: "RembugKop.id" dan "Satu Rembug, Transparan Pengelolaannya, Berdaya Asetnya."
3. THE `Footer` SHALL menampilkan kolom tautan dari `legalNavItems` pada `PublicNavigation` (Kebijakan Privasi, Syarat & Ketentuan).
4. THE `Footer` SHALL menampilkan kolom tautan navigasi utama dari `mainNavItems` pada `PublicNavigation`.
5. THE `Footer` SHALL menampilkan teks copyright dengan format "© {tahun_dinamis} RembugKop.id. Hak cipta dilindungi."
6. THE `Footer` SHALL menggunakan warna latar `bg-foreground` (Ink Umber) dengan teks `text-primary-foreground` atau `text-background` untuk menciptakan kontras yang jelas.
7. THE `Footer` SHALL responsif: pada mobile menumpuk kolom-kolom secara vertikal, pada desktop menampilkan kolom secara horizontal.

---

### Requirement 5: PublicLayout

**User Story:** Sebagai developer, saya ingin satu layout wrapper yang sudah menyertakan Navbar dan Footer, supaya setiap halaman publik cukup menggunakan `PublicLayout` tanpa menduplikasi markup navigasi.

#### Acceptance Criteria

1. THE `PublicLayout` SHALL berada di `resources/js/layouts/public-layout.tsx`.
2. THE `PublicLayout` SHALL menerima prop `children` bertipe `React.ReactNode` dan prop opsional `title` bertipe `string`.
3. THE `PublicLayout` SHALL merender komponen `Navbar` di bagian atas, `children` di tengah (sebagai `<main>`), dan komponen `Footer` di bagian bawah dalam struktur halaman penuh (`min-h-screen flex flex-col`).
4. WHEN prop `title` diberikan, THE `PublicLayout` SHALL merender komponen `<Head title={title} />` dari Inertia untuk mengatur `<title>` dokumen HTML.
5. THE `PublicLayout` SHALL menggunakan `bg-background` sebagai warna latar belakang halaman konsisten dengan design token RembugKop.
6. THE `PublicLayout` SHALL mengekspor fungsi komponen sebagai default export dengan tipe props yang eksplisit menggunakan TypeScript.

---

### Requirement 6: Halaman Beranda (`/`)

**User Story:** Sebagai pengunjung baru platform, saya ingin melihat halaman beranda yang menjelaskan nilai dan fitur utama RembugKop.id, supaya saya memahami manfaat platform dan termotivasi untuk mendaftar atau menjelajahi fitur lebih lanjut.

#### Acceptance Criteria

1. THE `Beranda` SHALL berada di `resources/js/pages/public/home.tsx` dan menggantikan peran `welcome.tsx` sebagai halaman utama (`/`).
2. THE `Beranda` SHALL menggunakan `PublicLayout` sebagai wrapper.
3. THE `Beranda` SHALL menampilkan hero section dengan headline utama menggunakan font heading Plus Jakarta Sans (weight 700), tagline platform, dan satu tombol CTA utama "Lihat Katalog Aset" yang mengarah ke route `asset-catalog`.
4. THE `Beranda` SHALL menampilkan section "Fitur Utama" yang memperkenalkan tiga pilar platform: Rembug Digital, Sewa Aset Koperasi, dan Real-Time Treasury Dashboard — masing-masing dengan ikon Lucide, judul, dan deskripsi singkat.
5. THE `Beranda` SHALL menampilkan motif anyaman sebagai tekstur dekoratif di hero section dengan opacity antara 4% hingga 8%.
6. THE `Beranda` SHALL menggunakan pola section sesuai panduan desain: hero di atas `bg-background`, section fitur di atas `bg-muted/40`, dan section CTA penutup di atas `bg-primary text-primary-foreground`.
7. THE `Beranda` SHALL menggunakan `max-w-5xl` sebagai lebar container konten untuk hero dan section fitur.
8. IF pengguna sudah terautentikasi (terdapat prop `auth.user` dari Inertia shared data), THEN THE `Beranda` SHALL menampilkan tombol "Ke Dashboard" sebagai pengganti CTA "Masuk" di hero section.

---

### Requirement 7: Halaman Tentang (`/tentang`)

**User Story:** Sebagai pengunjung yang ingin mengenal lebih jauh tentang platform, saya ingin halaman yang menjelaskan latar belakang, misi, dan tim di balik RembugKop.id, supaya saya merasa yakin dengan legitimasi dan tujuan platform.

#### Acceptance Criteria

1. THE `Tentang` SHALL berada di `resources/js/pages/public/about.tsx`.
2. THE `Tentang` SHALL menggunakan `PublicLayout` sebagai wrapper.
3. THE `Tentang` SHALL menampilkan section latar belakang yang menjelaskan masalah yang diselesaikan platform (transparansi kas, aset menganggur, partisipasi pasif) dalam bahasa Indonesia yang hangat namun baku.
4. THE `Tentang` SHALL menampilkan section misi/visi platform.
5. THE `Tentang` SHALL menggunakan `max-w-3xl` sebagai lebar container untuk konten teks naratif.

---

### Requirement 8: Halaman FAQ (`/faq`)

**User Story:** Sebagai pengunjung yang memiliki pertanyaan tentang cara kerja platform, saya ingin halaman FAQ yang menjawab pertanyaan umum, supaya saya tidak perlu menghubungi pengurus untuk pertanyaan-pertanyaan dasar.

#### Acceptance Criteria

1. THE `FAQ` SHALL berada di `resources/js/pages/public/faq.tsx`.
2. THE `FAQ` SHALL menggunakan `PublicLayout` sebagai wrapper.
3. THE `FAQ` SHALL menampilkan pertanyaan dan jawaban menggunakan komponen accordion dari ShadCN UI (`Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`).
4. THE `FAQ` SHALL memuat minimal 5 butir pertanyaan-jawaban yang relevan dengan konteks platform koperasi desa (cara sewa aset, cara menjadi anggota, keamanan data, dll.).
5. WHEN pengguna mengklik sebuah pertanyaan, THE `FAQ` SHALL menampilkan jawaban dari pertanyaan tersebut dan menutup jawaban lain yang sebelumnya terbuka.
6. THE `FAQ` SHALL menggunakan `max-w-3xl` sebagai lebar container konten.

---

### Requirement 9: Integrasi PublicLayout pada Halaman Katalog Aset yang Sudah Ada

**User Story:** Sebagai pengunjung platform, saya ingin halaman Katalog Aset (`/aset`) dan Detail Aset (`/aset/{id}`) memiliki Navbar dan Footer yang konsisten dengan halaman publik lainnya, supaya pengalaman navigasi terasa menyatu.

#### Acceptance Criteria

1. THE `AssetCatalog` (`resources/js/pages/public/asset-catalog.tsx`) SHALL diperbarui untuk menggunakan `PublicLayout` sebagai wrapper menggantikan div container yang ada saat ini.
2. THE `AssetDetail` (`resources/js/pages/public/asset-detail.tsx`) SHALL diperbarui untuk menggunakan `PublicLayout` sebagai wrapper.
3. WHEN `PublicLayout` diterapkan pada `AssetCatalog`, THE halaman SHALL tetap mempertahankan semua fungsionalitas yang sudah ada (filter kategori, pencarian, pagination, kartu aset) tanpa perubahan perilaku.
4. WHEN `PublicLayout` diterapkan pada `AssetDetail`, THE halaman SHALL tetap mempertahankan semua fungsionalitas yang sudah ada (detail aset, form reservasi) tanpa perubahan perilaku.

---

### Requirement 10: Halaman Kebijakan Privasi (`/kebijakan-privasi`)

**User Story:** Sebagai pengunjung platform, saya ingin dapat membaca kebijakan privasi RembugKop.id, supaya saya memahami bagaimana data saya dikelola sebelum memutuskan mendaftar.

#### Acceptance Criteria

1. THE `KebijakanPrivasi` SHALL berada di `resources/js/pages/legal/privacy-policy.tsx`.
2. THE `KebijakanPrivasi` SHALL menggunakan `PublicLayout` sebagai wrapper.
3. THE `KebijakanPrivasi` SHALL menampilkan konten statis kebijakan privasi dalam bahasa Indonesia, mencakup minimal: data apa yang dikumpulkan, bagaimana data digunakan, dan hak pengguna atas datanya.
4. THE `KebijakanPrivasi` SHALL menggunakan `max-w-3xl` sebagai lebar container untuk keterbacaan teks panjang.
5. THE `KebijakanPrivasi` SHALL menampilkan tanggal terakhir diperbarui ("Terakhir diperbarui: [tanggal]") di bagian atas konten.

---

### Requirement 11: Halaman Syarat & Ketentuan (`/syarat-ketentuan`)

**User Story:** Sebagai pengunjung platform, saya ingin dapat membaca syarat dan ketentuan penggunaan RembugKop.id, supaya saya memahami hak dan kewajiban saya sebagai pengguna sebelum mendaftar.

#### Acceptance Criteria

1. THE `SyaratKetentuan` SHALL berada di `resources/js/pages/legal/terms-of-service.tsx`.
2. THE `SyaratKetentuan` SHALL menggunakan `PublicLayout` sebagai wrapper.
3. THE `SyaratKetentuan` SHALL menampilkan konten statis syarat & ketentuan dalam bahasa Indonesia, mencakup minimal: ketentuan penggunaan layanan, kewajiban pengguna, batasan tanggung jawab platform, dan ketentuan penghentian akun.
4. THE `SyaratKetentuan` SHALL menggunakan `max-w-3xl` sebagai lebar container untuk keterbacaan teks panjang.
5. THE `SyaratKetentuan` SHALL menampilkan tanggal terakhir diperbarui ("Terakhir diperbarui: [tanggal]") di bagian atas konten.

---

### Requirement 12: Named Routes Laravel untuk Halaman Publik Baru

**User Story:** Sebagai developer, saya ingin semua halaman publik baru memiliki named route di Laravel, supaya Wayfinder dapat men-generate TypeScript route functions yang bisa diimpor secara type-safe di frontend, tanpa perlu URL string hardcoded.

#### Acceptance Criteria

1. THE `web.php` (atau file routes publik yang relevan) SHALL mendefinisikan named route `home` untuk path `/` yang mengarah ke controller Inertia yang me-render `public/home`.
2. THE `web.php` SHALL mendefinisikan named route `about` untuk path `/tentang` yang mengarah ke controller Inertia yang me-render `public/about`.
3. THE `web.php` SHALL mendefinisikan named route `faq` untuk path `/faq` yang mengarah ke controller Inertia yang me-render `public/faq`.
4. THE `web.php` SHALL mendefinisikan named route `privacy-policy` untuk path `/kebijakan-privasi` yang mengarah ke controller Inertia yang me-render `legal/privacy-policy`.
5. THE `web.php` SHALL mendefinisikan named route `terms-of-service` untuk path `/syarat-ketentuan` yang mengarah ke controller Inertia yang me-render `legal/terms-of-service`.
6. WHEN Wayfinder `php artisan wayfinder:generate` dijalankan setelah named routes di atas didefinisikan, THE Wayfinder SHALL menghasilkan TypeScript route functions yang dapat diimpor oleh `PublicNavigation` dan komponen lain.
