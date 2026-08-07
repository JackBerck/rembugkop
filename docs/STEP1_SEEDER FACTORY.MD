# PROMPT — Step 1: Seeder & Factory RembugKop.id

> Cara pakai: taruh file ini bareng `DATABASE_SCHEME.MD`, `APP_REFERENCE.MD`, dan `TECHNICAL_REFERENCE.MD` di `/docs`, lalu jadikan ini prompt utama ke coding agent. Migration, Model, dan Enum sudah dibuat sebelumnya — **jangan buat ulang**, rujuk struktur dan nama kolom yang sudah ada.

## Konteks

RembugKop.id adalah platform koperasi desa (single-tenant) dengan 3 modul: Rembug Digital (voting), Sewa Aset (reservasi), dan Treasury (kas transparan). Skema tabel lengkap ada di `docs/DATABASE_SCHEME.MD` — rujuk file tersebut sebagai sumber kebenaran struktur tabel dan relasi.

## Tugas

Buat **Factory** untuk setiap model dan **Seeder** yang menghasilkan dataset dummy realistis (bukan `Lorem ipsum` / `Test User 1`), agar saat dijalankan aplikasi langsung tampak seperti koperasi desa aktif berjalan.

### 0. Langkah Awal (wajib sebelum menulis kode)

1. Cek `app/Models/` — pastikan semua model (`User`, `MemberProfile`, `AssetCategory`, `Asset`, `AssetReservation`, `Payment`, `Media`, `TreasuryTransaction`, `AuditLog`, `Proposal`, `Vote`) beserta relasinya digunakan dengan benar.
2. Cek `app/Enums/` — WAJIB gunakan Enum yang sudah ada:
   - `UserRole` (`super_admin`, `pengurus`, `anggota`)
   - `UserStatus` (`active`, `inactive`, `suspended`)
   - `VerificationStatus` (`pending`, `verified`, `rejected`)
   - `AssetStatus` (`available`, `maintenance`, `inactive`)
   - `DurationType` (`hourly`, `daily`)
   - `ReservationStatus` (`pending`, `approved`, `ongoing`, `completed`, `cancelled`, `rejected`)
   - `PaymentMethod` (`manual`, `gateway`)
   - `PaymentStatus` (`pending`, `paid`, `failed`, `refunded`)
   - `TransactionType` (`income`, `expense`)
   - `TransactionCategory` (`asset_rental`, `dues`, `asset_procurement`, `operational`, `other`)
   - `ProposalType` (`asset_procurement`, `policy`, `other`)
   - `ProposalStatus` (`draft`, `open`, `approved`, `rejected`, `executed`)
   - `VoteChoice` (`agree`, `disagree`)
   **Jangan buat enum baru** dan **jangan gunakan raw string/hardcoded string** di factory.
3. Pastikan `config/app.php` / `.env` locale Faker mengarah ke `id_ID` (`FAKER_LOCALE=id_ID`).

---

### 1. Factory per Model & Ketentuan Field (English Column Names)

Urutan dependency:

1. **`UserFactory`**
   - Field: `name` (Faker `id_ID`), `email`, `phone` (`08xxxxxxxxxx`), `password`, `role` (`UserRole::Anggota`, state `pengurus()` & `superAdmin()`), `status` (`UserStatus::Active`).
2. **`MemberProfileFactory`** (1:1 dengan `User`)
   - Field:
     - `member_number`: Format berurutan realistis (mis. `KOP-2024-0001`).
     - `national_id`: NIK 16 digit valid Indonesia (mis. `fake()->numerify('33##########0###')`). Catatan: Model di-cast sebagai `encrypted`.
     - `address`: Alamat desa Indonesia.
     - `joined_at`: Sebar 1–3 tahun terakhir.
     - `principal_savings`: Rp100.000,00.
     - `mandatory_savings_total`: Bertambah seiring lama keanggotaan.
     - `verification_status`: `VerificationStatus::Verified` (state `pending()` / `rejected()`).
     - `verified_by`: User ID pengurus/admin (nullable).
     - `verified_at`: Timestamp verifikasi (nullable).
3. **`AssetCategorySeeder`** (Seeder idempotent, bukan factory acak)
   - Set kategori tetap: `Alat Pertanian`, `Perlengkapan Acara`, `Kendaraan`, `Bangunan/Gedung`. Gunakan `updateOrCreate`.
4. **`AssetFactory`**
   - Field: `category_id`, `name` (lihat §2), `description`, `location` (mis. "Gudang Utama Desa", "Pelataran Koperasi"), `hourly_rate` / `daily_rate`, `status` (`AssetStatus::Available`), `created_by` (User ID admin/pengurus).
5. **`ProposalFactory`**
   - Field: `title` & `description` (realistis konteks desa, lihat §3), `type` (`ProposalType`), `related_asset_id` (nullable), `proposed_by` (User ID anggota/pengurus), `status` (`ProposalStatus`), `voting_start`, `voting_end`. Sebar status di `draft`, `open`, `approved`, `rejected`, `executed`.
6. **`VoteFactory`**
   - Field: `proposal_id`, `user_id`, `choice` (`VoteChoice::Agree` / `VoteChoice::Disagree`), `voted_at`.
   - Constraint unique `(proposal_id, user_id)` wajib dijaga di seeder.
7. **`AssetReservationFactory`**
   - Field: `asset_id`, `user_id`, `start_datetime`, `end_datetime`, `duration_type` (`DurationType::Daily` / `DurationType::Hourly`), `calculated_price` (sesuai tarif aset × durasi), `status` (`ReservationStatus`), `approved_by` (nullable), `notes`.
   - Tanggal **tidak boleh overlap** untuk aset yang sama pada status `approved`/`ongoing`.
8. **`PaymentFactory`**
   - Field: `reservation_id`, `amount` (match `calculated_price` dari `AssetReservation`), `method` (`PaymentMethod::Manual` / `PaymentMethod::Gateway`), `gateway_provider`, `gateway_transaction_id`, `gateway_status`, `status` (`PaymentStatus::Paid` / `Pending` / `Failed`), `recorded_by`, `paid_at`.
9. **`TreasuryTransactionFactory`**
   - Field: `type` (`TransactionType`), `category` (`TransactionCategory`), `amount`, `description`, `reference_type`, `reference_id`, `recorded_by`, `transaction_date`, `previous_hash`, `hash`, `created_at`.
   - Wajib generate `income` (category `TransactionCategory::AssetRental`) dari `Payment` bertipe `paid` (morph reference ke `Payment`).
   - Tambahkan juga beberapa entry `expense` (category `TransactionCategory::Operational` / `TransactionCategory::AssetProcurement`, mis. "Perawatan traktor", "Beli terpal baru").
   - Hash chain: hitung SHA-256 (`hash = hash('sha256', $previous_hash . $type . $category . $amount . $transaction_date . $recorded_by)`).
10. **`MediaFactory`**
    - Field: `mediable_type`, `mediable_id`, `collection`, `path`, `is_primary`, `order_number`, `caption`, `uploaded_by`, `created_at`.

---

### 2. Daftar Aset Tetap (§2)

Gunakan 8 aset ini secara presisi pada `AssetSeeder`:

| Nama Aset | Kategori | Daily Rate (contoh) | Filename Gambar |
|---|---|---|---|
| Traktor Tangan | Alat Pertanian | Rp150.000 | `traktor-tangan.jpg` |
| Mesin Penggiling Padi | Alat Pertanian | Rp200.000 | `mesin-giling-padi.jpg` |
| Alat Semprot Hama (Power Sprayer) | Alat Pertanian | Rp75.000 | `alat-semprot-hama.jpg` |
| Mesin Pemotong Rumput | Alat Pertanian | Rp60.000 | `mesin-pemotong-rumput.jpg` |
| Gedung Serbaguna | Bangunan/Gedung | Rp500.000 | `gedung-serbaguna.jpg` |
| Tenda & Terpal Hajatan | Perlengkapan Acara | Rp250.000 | `tenda-hajatan.jpg` |
| Kursi & Meja Lipat (set 50 buah) | Perlengkapan Acara | Rp150.000 | `kursi-meja-acara.jpg` |
| Mobil Pick-up Angkut | Kendaraan | Rp300.000 | `mobil-pickup.jpg` |

---

### 3. Contoh Judul/Deskripsi Proposal (§3)

- "Pengadaan Mesin Penggiling Padi Baru" (type: `asset_procurement`) — kondisi mesin lama sering rusak.
- "Perbaikan Atap Gedung Serbaguna" (type: `other`) — bocor musim hujan.
- "Penyesuaian Tarif Sewa Tenda Hajatan" (type: `policy`) — penyesuaian harga terpal baru.
- "Pembelian Mobil Pick-up untuk Distribusi Hasil Panen" (type: `asset_procurement`) — proposal pengadaan aset besar.

---

### 4. Media/Gambar (§4)

File ditaruh manual di: `storage/app/public/seeders/assets/{filename}`.
`MediaSeeder`:
1. Loop aset, cek `Storage::disk('public')->exists("seeders/assets/{$filename}")`.
2. Jika ada → buat record `Media` (`mediable_type` = `Asset`, `collection` = `'photos'`, `path` = path relatif, `is_primary` = true).
3. Jika belum ada → skip dengan log warning (`Log::warning("Media belum tersedia: {$filename}")`).
4. **KTP (`ktp`) dan Bukti Transfer (`bukti_transfer`) JANGAN digenerate.**

---

### 5. Struktur File yang Diharapkan

```
database/
  factories/
    UserFactory.php (update role & status support)
    MemberProfileFactory.php
    AssetFactory.php
    AssetReservationFactory.php
    PaymentFactory.php
    ProposalFactory.php
    VoteFactory.php
    TreasuryTransactionFactory.php
  seeders/
    DatabaseSeeder.php (orkestrasi urutan panggil seeder)
    AssetCategorySeeder.php
    UserSeeder.php          # 1 super_admin, 5 pengurus, 40 anggota
    AssetSeeder.php         # 8 aset tetap dari §2
    ProposalSeeder.php
    VoteSeeder.php
    AssetReservationSeeder.php
    PaymentSeeder.php
    TreasuryTransactionSeeder.php
    MediaSeeder.php
```

---

### 6. Checklist Selesai

- [ ] `php artisan migrate:fresh --seed` berjalan tanpa error dari DB kosong.
- [ ] Nama kolom pada Factory & Seeder menggunakan Bahasa Inggris sesuai Model/Migration (`member_number`, `national_id`, `address`, `joined_at`, `principal_savings`, `mandatory_savings_total`, `verification_status`, dll).
- [ ] Semua status/tipe/kategori menggunakan Enum dari `app/Enums/`.
- [ ] `national_id` (NIK) selalu 16 digit valid & terisi.
- [ ] Unique constraint `(proposal_id, user_id)` pada `votes` terjaga.
- [ ] `asset_reservations` tidak overlap untuk aset & status `approved`/`ongoing` yang sama.
- [ ] `payments.amount` match `asset_reservations.calculated_price`.
- [ ] `treasury_transactions` income bersumber dari payment status `paid` (morph reference ke `Payment`) & hash chain valid.
- [ ] MediaSeeder aman jalan walau file fisik gambar belum tersedia.