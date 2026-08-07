# Skema Database — RembugKop.id

Konteks: single-tenant (satu koperasi), voting one-member-one-vote, pembayaran hybrid (manual + payment gateway). Stack: Laravel 13 + PostgreSQL/MySQL.

---

## 1. Modul Autentikasi & Keanggotaan

### `users`
Akun login untuk semua role.

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | bigint PK | |
| name | varchar | |
| email | varchar unique | |
| phone | varchar | |
| password | varchar | |
| role | enum('super_admin','pengurus','anggota') | |
| status | enum('active','inactive','suspended') | default active |
| email_verified_at | timestamp nullable | |
| created_at, updated_at | timestamp | |

> Role cukup 3 nilai tetap → enum lebih simpel daripada tabel `roles` terpisah. Kalau nanti butuh permission granular per pengurus (mis. bendahara vs sekretaris), baru pecah ke Spatie Laravel-Permission.

### `member_profiles`
Detail keanggotaan koperasi + validasi NIK/KTP. 1:1 dengan `users` (role = anggota, atau pengurus yang juga anggota).

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | bigint PK | |
| user_id | bigint FK → users, unique | |
| member_number | varchar unique | nomor keanggotaan koperasi |
| national_id | varchar(16) unique | NIK dienkripsi (Laravel `encrypted` cast) |
| address | text | |
| joined_at | date | |
| principal_savings | decimal(15,2) default 0 | untuk transparansi, tidak dipakai sbg bobot suara |
| mandatory_savings_total | decimal(15,2) default 0 | |
| verification_status | enum('pending','verified','rejected') | |
| verified_by | bigint FK → users nullable | |
| verified_at | timestamp nullable | |

---

## 2. Modul Rembug Digital (Voting)

### `proposals`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | bigint PK | |
| title | varchar | |
| description | text | |
| type | enum('asset_procurement','policy','other') | |
| related_asset_id | bigint FK → assets nullable | isi kalau proposal pengadaan aset baru |
| proposed_by | bigint FK → users | pengurus pengaju |
| status | enum('draft','open','approved','rejected','executed') | |
| voting_start | timestamp nullable | |
| voting_end | timestamp nullable | |
| created_at, updated_at | timestamp | |

### `votes`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | bigint PK | |
| proposal_id | bigint FK → proposals | |
| user_id | bigint FK → users | |
| choice | enum('agree','disagree') | |
| voted_at | timestamp | |

**Unique constraint**: `(proposal_id, user_id)` — mengunci one-member-one-vote di level database, bukan cuma validasi aplikasi.

---

## 3. Modul Aset & Reservasi

### `asset_categories`
| Kolom | Tipe |
|---|---|
| id | bigint PK |
| name | varchar |

### `assets`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | bigint PK | |
| category_id | bigint FK → asset_categories nullable | |
| name | varchar | |
| description | text | |
| location | varchar | |
| hourly_rate | decimal(15,2) nullable | tarif per jam |
| daily_rate | decimal(15,2) nullable | tarif per hari |
| status | enum('available','maintenance','inactive') | |
| created_by | bigint FK → users | pengurus yang input |
| created_at, updated_at | timestamp | |

### `asset_reservations`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | bigint PK | |
| asset_id | bigint FK → assets | |
| user_id | bigint FK → users | penyewa |
| start_datetime | timestamp | |
| end_datetime | timestamp | |
| duration_type | enum('hourly','daily') | |
| calculated_price | decimal(15,2) | dihitung otomatis dari tarif × durasi |
| status | enum('pending','approved','ongoing','completed','cancelled','rejected') | |
| approved_by | bigint FK → users nullable | |
| notes | text nullable | |
| created_at, updated_at | timestamp | |

> Cegah double-booking: index `(asset_id, start_datetime, end_datetime)` + validasi overlap di application layer (query `WHERE asset_id = ? AND status IN ('approved','ongoing') AND start < ? AND end > ?`) sebelum insert. Untuk konkurensi ketat, bisa tambah row-level lock atau `unique` constraint berbasis exclusion (PostgreSQL `EXCLUDE USING gist` kalau pakai Postgres).

---

## 4. Modul Pembayaran (Hybrid: manual + gateway)

### `payments`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | bigint PK | |
| reservation_id | bigint FK → asset_reservations | |
| amount | decimal(15,2) | |
| method | enum('manual','gateway') | |
| gateway_provider | varchar nullable | mis. midtrans, xendit |
| gateway_transaction_id | varchar nullable unique | |
| gateway_status | varchar nullable | raw status dari provider |
| status | enum('pending','paid','failed','refunded') | |
| recorded_by | bigint FK → users nullable | pengurus yang input (khusus manual) |
| paid_at | timestamp nullable | |
| created_at, updated_at | timestamp | |

---

## 4b. Modul Lampiran / Media (Polymorphic)

### `media`
Satu tabel untuk semua kebutuhan file/gambar: galeri foto aset (bisa banyak), foto KTP anggota (satu), bukti transfer pembayaran (satu), dst.

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | bigint PK | |
| mediable_type | varchar | nama model, mis. `Asset`, `MemberProfile`, `Payment` |
| mediable_id | bigint | id record terkait |
| collection | varchar | pengelompokan dalam satu model, mis. `photos`, `ktp`, `bukti_transfer` |
| path | varchar | path file di storage |
| is_primary | boolean default false | penanda foto sampul/utama (khusus collection yang boleh multi) |
| order_number | int default 0 | urutan tampil di galeri |
| caption | varchar nullable | |
| uploaded_by | bigint FK → users nullable | |
| created_at | timestamp | |

**Index**: `(mediable_type, mediable_id, collection)`.

> Kolom `collection` yang bikin tabel ini aman dipakai untuk kasus 1-foto (ktp, bukti transfer) maupun multi-foto (galeri aset) — tinggal validasi di application layer: collection `ktp` dan `bukti_transfer` maksimal 1 row per record, collection `photos` boleh banyak dengan `is_primary` buat nentuin cover image.
>
> Alternatif kalau mau hemat waktu development: pakai package `spatie/laravel-medialibrary`, yang sudah implementasi pola persis ini plus fitur generate thumbnail/conversion otomatis — lumayan membantu buat kejar deadline GEMASTIK daripada bikin dari nol.

---

## 5. Modul Kas & Audit Trail

### `treasury_transactions`
Semua arus kas masuk/keluar, jadi sumber data untuk dashboard real-time.

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | bigint PK | |
| type | enum('income','expense') | |
| category | enum('asset_rental','dues','asset_procurement','operational','other') | |
| amount | decimal(15,2) | |
| description | text | |
| reference_type | varchar nullable | polymorphic: `Payment`, `Proposal`, dll |
| reference_id | bigint nullable | |
| recorded_by | bigint FK → users | |
| transaction_date | date | |
| previous_hash | varchar nullable | hash record sebelumnya |
| hash | varchar | SHA-256 dari (data + previous_hash) |
| created_at | timestamp | |

> Kolom `hash`/`previous_hash` bikin hash-chain sederhana ala blockchain-lite — cocok banget sama klaim "prinsip DAO tanpa kerumitan blockchain" di pitch kamu. Setiap insert dihitung ulang hash-nya; kalau ada baris diubah manual di DB, hash chain jadi tidak match dan ketahuan. Ini nilai jual bagus untuk juri GEMASTIK karena langsung menjawab poin "immutable audit trail".

### `audit_logs` (opsional tapi direkomendasikan)
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | bigint PK | |
| user_id | bigint FK → users nullable | |
| action | varchar | created/updated/deleted |
| model_type | varchar | |
| model_id | bigint | |
| old_values | json nullable | |
| new_values | json nullable | |
| ip_address | varchar nullable | |
| created_at | timestamp | |

Bisa pakai package `spatie/laravel-activitylog` supaya tidak perlu handle manual di tiap controller.

---

## Relasi Ringkas

```
users ─┬─< member_profiles
       ├─< proposals (proposed_by)
       ├─< votes
       ├─< assets (created_by)
       ├─< asset_reservations (user_id / approved_by)
       └─< payments (recorded_by)

assets ──< asset_reservations ──< payments
proposals ──< votes
payments / proposals ──< treasury_transactions (via reference_type/id)

media >── (polymorphic) ── assets / member_profiles / payments
```

## Catatan Desain

- **Kenapa `member_profiles` dipisah dari `users`**: super_admin & sebagian pengurus belum tentu perlu data NIK/simpanan. Memisahkan bikin tabel `users` tetap ringan dan generik.
- **Kenapa `votes` unique per (proposal_id, user_id)**: karena kamu pilih one-member-one-vote, constraint database jauh lebih aman daripada cuma validasi di controller.
- **Kenapa `payments` terpisah dari `treasury_transactions`**: `payments` adalah transaksi granular per reservasi (bisa gagal/pending di gateway), sedangkan `treasury_transactions` adalah buku kas yang sudah final — hanya payment yang `status = paid` yang diteruskan jadi entry kas. Ini juga memudahkan kalau nanti ada expense yang bukan dari payment (mis. beli aset baru, biaya operasional).
- **Index yang wajib**: `asset_reservations(asset_id, start_datetime, end_datetime)`, `votes(proposal_id, user_id)` unique, `treasury_transactions(transaction_date)`, `payments(gateway_transaction_id)` unique, `media(mediable_type, mediable_id, collection)`.
- **Kenapa `media` polymorphic**: satu pola untuk semua kebutuhan lampiran (foto aset multi, KTP single, bukti transfer single) daripada bikin kolom `*_path` tersebar di banyak tabel atau tabel terpisah per jenis file.

Kalau mau, saya bisa lanjutkan buat migration file Laravel-nya langsung dari skema ini.