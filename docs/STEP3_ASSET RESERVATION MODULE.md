# PROMPT — Step 3: Modul Aset & Reservasi RembugKop.id

> Cara pakai: jalankan setelah Step 1 (Seeder & Factory) dan Step 2 (Auth & Role Middleware) selesai. Modul ini butuh `AssetReservationPolicy` dan `ProposalPolicy` yang sudah di-scaffold di Step 2 — **lengkapi policy yang sudah ada, jangan bikin file baru yang tabrakan**. Rujuk `DATABASE_SCHEME.MD` untuk struktur tabel `assets`, `asset_reservations`, `media`, dan `APP_REFERENCE.md` §2 untuk styling halaman katalog/booking.

## Konteks

Modul ini punya dua sisi yang saling terhubung lewat data yang sama:
- **Sisi pengurus** (`/dashboard/assets`, `/dashboard/reservations`) — kelola aset, approve/reject reservasi.
- **Sisi publik/anggota** (`/aset`, `/aset/{asset}`, `/reservasi-saya`) — lihat katalog, ajukan reservasi, pantau status reservasi sendiri.

Bangun **sisi pengurus dulu** sampai bisa CRUD aset dengan data nyata, baru sisi publik — supaya begitu halaman katalog dibuat, datanya sudah ada isinya, bukan tabel kosong.

## Langkah Awal (wajib dicek sebelum menulis kode)

1. Baca ulang `app/Policies/AssetReservationPolicy.php` dan `app/Policies/ProposalPolicy.php` dari Step 2 — modul ini akan **melengkapi** `AssetReservationPolicy`, bukan menimpa method yang sudah ada (`create`, `approve` sudah ada, tinggal tambah/sesuaikan method lain).
2. Cek apakah `app/Models/Media.php` sudah ada (dibuat waktu Step 1 untuk `MediaFactory`/`MediaSeeder`). Kalau sudah ada, pakai model itu untuk semua penyimpanan foto di modul ini — jangan bikin sistem upload gambar terpisah.
3. Cek `config/filesystems.php` — pastikan disk `public` sudah dikonfigurasi dan `php artisan storage:link` sudah pernah dijalankan (kalau belum, jalankan dulu sebelum test upload foto).

## Tugas

### 1. Lengkapi `AssetReservationPolicy`

Sesuaikan/tambahkan method berikut ke `app/Policies/AssetReservationPolicy.php` (jangan bikin `class` baru):

```php
public function viewAny(User $user): bool
{
    // pengurus/super_admin lihat semua; anggota lihat punya sendiri (difilter di controller/query, bukan di sini)
    return true;
}

public function view(User $user, AssetReservation $reservation): bool
{
    return $user->id === $reservation->user_id
        || $user->isPengurus()
        || $user->isAdmin();
}

public function reject(User $user, AssetReservation $reservation): bool
{
    return ($user->isPengurus() || $user->isAdmin())
        && $reservation->status === ReservationStatus::Pending;
}

public function cancel(User $user, AssetReservation $reservation): bool
{
    return $user->id === $reservation->user_id
        && $reservation->status === ReservationStatus::Pending;
}
```

### 2. `AssetPolicy` (baru)

Buat policy baru di `app/Policies/AssetPolicy.php`:

```php
namespace App\Policies;

use App\Models\Asset;
use App\Models\User;

class AssetPolicy
{
    public function create(User $user): bool
    {
        return $user->isPengurus() || $user->isAdmin();
    }

    public function update(User $user, Asset $asset): bool
    {
        return $user->isPengurus() || $user->isAdmin();
    }

    public function delete(User $user, Asset $asset): bool
    {
        return ($user->isPengurus() || $user->isAdmin())
            && ! $asset->reservations()->whereIn('status', ['pending', 'approved', 'ongoing'])->exists();
    }
}
```

> Catatan: `delete` sengaja menolak kalau aset masih ada reservasi aktif — cegah pengurus tidak sengaja hapus aset yang lagi disewa orang. Kalau butuh "nonaktifkan" tanpa hapus, cukup update `status` ke `inactive`, bukan delete beneran.

Katalog & detail aset (lihat-lihat) **tidak butuh policy** — itu halaman publik, cukup route biasa tanpa `authorize()`.

### 3. Sisi Pengurus — CRUD Aset

Buat Action (bukan logic langsung di controller, sesuai `TECHNICAL_REFERENCE.md` §1) untuk yang melibatkan upload foto, karena ada logic non-trivial (validasi banyak file, urutan, primary photo):

```php
// app/Actions/Asset/StoreAssetWithPhotosAction.php
class StoreAssetWithPhotosAction
{
    public function execute(array $assetData, array $photos, User $creator): Asset
    {
        return DB::transaction(function () use ($assetData, $photos, $creator) {
            $asset = Asset::create([...$assetData, 'created_by' => $creator->id]);

            foreach ($photos as $index => $photo) {
                $path = $photo->store('assets/' . $asset->id, 'public');
                Media::create([
                    'mediable_type' => Asset::class,
                    'mediable_id' => $asset->id,
                    'collection' => 'photos',
                    'path' => $path,
                    'is_primary' => $index === 0,
                    'order_number' => $index,
                    'uploaded_by' => $creator->id,
                ]);
            }

            return $asset;
        });
    }
}
```

Validasi upload (di `StoreAssetRequest`): tipe file `jpg,jpeg,png,webp`, maksimal 2MB per file, maksimal 5 foto per aset, minimal 1 foto wajib diisi (aset tanpa foto tidak boleh dipublikasikan ke katalog).

Form field aset: `name`, `category_id`, `description`, `location`, `hourly_rate` (nullable), `daily_rate` (nullable) — **minimal salah satu tarif harus diisi**, validasi custom di FormRequest kalau keduanya kosong.

Halaman yang dibuat:
- `resources/js/pages/dashboard/assets/index.tsx` — tabel daftar aset (thumbnail foto utama, nama, kategori, tarif, status), tombol edit/nonaktifkan.
- `resources/js/pages/dashboard/assets/create.tsx` & `edit.tsx` — form dengan multi-upload foto (preview sebelum submit, drag untuk urutan kalau sempat, kalau tidak cukup urutan sesuai upload).
- Container `max-w-7xl` untuk index (tabel), `max-w-3xl` untuk form create/edit (sesuai `APP_REFERENCE.md` §2 layout).

### 4. Sisi Publik — Katalog & Detail Aset

- `resources/js/pages/public/asset-catalog.tsx` — grid card aset (foto utama, nama, kategori badge, tarif mulai dari). Filter by kategori. Container `max-w-5xl`.
- `resources/js/pages/public/asset-detail.tsx` — galeri semua foto (bukan cuma primary), deskripsi, lokasi, tarif lengkap, kalender ketersediaan (tampilkan reservasi `approved`/`ongoing` yang ada supaya anggota tahu kapan aset kosong), form ajukan reservasi.

Route publik ini bisa diakses semua role yang login (bahkan sebelum verified) — tapi tombol "Ajukan Reservasi" di-disable dengan pesan jelas kalau `verification_status` belum `verified` (pesan sesuai `APP_REFERENCE.md` §2 voice: jelaskan kenapa & apa langkah berikutnya, bukan cuma tombol abu-abu tanpa penjelasan).

### 5. Booking Flow — Cegah Overlap di Level Aplikasi

**Jangan percaya harga dari client.** `calculated_price` selalu dihitung ulang di server dari `asset.hourly_rate`/`asset.daily_rate` × durasi asli — kalau request kirim `calculated_price`, abaikan/timpa nilai itu.

```php
// app/Http/Requests/StoreReservationRequest.php
public function withValidator(Validator $validator): void
{
    $validator->after(function ($validator) {
        $overlap = AssetReservation::query()
            ->where('asset_id', $this->asset_id)
            ->overlapping(
                Carbon::parse($this->start_datetime),
                Carbon::parse($this->end_datetime)
            )
            ->exists();

        if ($overlap) {
            $validator->errors()->add('start_datetime', 'Aset sudah dibooking di rentang waktu tersebut. Silakan pilih jadwal lain.');
        }
    });
}
```

Gunakan scope `overlapping()` yang sudah didefinisikan di model `AssetReservation` (lihat `DATABASE_SCHEME.MD` §3) — jangan tulis ulang query overlap dengan logic berbeda.

Bungkus proses create reservation dalam `DB::transaction()` dengan **row lock** (`lockForUpdate()`) di query pengecekan overlap, supaya dua orang yang submit booking bersamaan untuk slot yang sama tidak lolos berdua (race condition klasik booking system):

```php
// app/Actions/Reservation/CreateReservationAction.php
public function execute(array $data, User $renter): AssetReservation
{
    return DB::transaction(function () use ($data, $renter) {
        $asset = Asset::lockForUpdate()->findOrFail($data['asset_id']);

        // cek overlap lagi di dalam transaction (defense kedua, bukan cuma di FormRequest)
        abort_if(
            AssetReservation::where('asset_id', $asset->id)
                ->overlapping($data['start_datetime'], $data['end_datetime'])
                ->exists(),
            422,
            'Slot sudah terisi.'
        );

        $price = $this->calculatePrice($asset, $data['start_datetime'], $data['end_datetime'], $data['duration_type']);

        return AssetReservation::create([
            'asset_id' => $asset->id,
            'user_id' => $renter->id,
            'start_datetime' => $data['start_datetime'],
            'end_datetime' => $data['end_datetime'],
            'duration_type' => $data['duration_type'],
            'calculated_price' => $price,
            'status' => ReservationStatus::Pending,
        ]);
    });
}
```

### 6. Sisi Pengurus — Approval Reservasi

- `resources/js/pages/dashboard/reservations/index.tsx` — tabel reservasi, filter by status, badge warna per status (pakai `Moss Sage` untuk approved/completed, `Bata Merah Pudar` untuk rejected — sesuai `APP_REFERENCE.md` §2 aturan warna semantik, jangan pakai warna sembarang buat badge status).
- Tombol Approve/Reject pakai `ApproveReservationAction` (cek `TECHNICAL_REFERENCE.md` §1 kalau perlu direfresh) dan buat `RejectReservationAction` dengan pola sama, tambahkan field `notes` (alasan reject) wajib diisi saat menolak.

### 7. Update Status Otomatis (approved → ongoing → completed)

Reservasi yang statusnya `approved` seharusnya otomatis jadi `ongoing` waktu `start_datetime` tercapai, dan `completed` waktu `end_datetime` lewat — jangan bergantung pengurus klik manual tiap saat, karena gampang kelupaan dan bikin dashboard kelihatan tidak akurat pas demo.

```php
// app/Console/Commands/UpdateReservationStatuses.php
class UpdateReservationStatuses extends Command
{
    protected $signature = 'reservations:update-statuses';

    public function handle(): void
    {
        AssetReservation::where('status', ReservationStatus::Approved)
            ->where('start_datetime', '<=', now())
            ->update(['status' => ReservationStatus::Ongoing]);

        AssetReservation::where('status', ReservationStatus::Ongoing)
            ->where('end_datetime', '<=', now())
            ->update(['status' => ReservationStatus::Completed]);
    }
}
```

Daftarkan di scheduler (`routes/console.php` untuk Laravel 12+) jalan tiap beberapa menit: `Schedule::command('reservations:update-statuses')->everyFiveMinutes();`

### 8. Halaman "Reservasi Saya" (anggota)

`resources/js/pages/public/my-reservations.tsx` — daftar reservasi milik user login sendiri (query `where user_id = auth()->id()`, **jangan** tampilkan semua reservasi lalu filter di frontend), status badge, tombol batalkan (kalau masih `pending`, pakai policy `cancel` dari §1).

## Checklist Selesai

- [ ] Pengurus bisa CRUD aset lengkap dengan multi-foto, dan foto tersimpan lewat tabel `media` (bukan kolom path baru di `assets`).
- [ ] Aset tanpa foto tidak bisa disimpan (validasi wajib minimal 1 foto).
- [ ] Katalog publik & detail aset bisa diakses tanpa perlu jadi pengurus (`/aset/{asset}`).
- [ ] Anggota belum verified tetap bisa lihat katalog, tapi tombol booking disabled dengan pesan jelas.
- [ ] `calculated_price` selalu dihitung di server dari `hourly_rate`/`daily_rate`, request dari client untuk field itu diabaikan.
- [ ] Overlap booking ditolak di dua lapis: validasi FormRequest (UX cepat) **dan** dalam DB transaction dengan lock (defense sebenarnya terhadap race condition).
- [ ] Test manual: submit 2 booking bersamaan untuk slot sama (mis. pakai 2 tab browser) — pastikan cuma satu yang berhasil.
- [ ] Approve/reject reservasi cuma bisa dilakukan pengurus/super_admin, dan cuma untuk status `pending`.
- [ ] Command `reservations:update-statuses` mengubah status otomatis sesuai waktu, dan sudah terdaftar di scheduler.
- [ ] Anggota cuma bisa lihat & batalkan reservasi miliknya sendiri, tidak bisa lihat/ubah reservasi anggota lain.