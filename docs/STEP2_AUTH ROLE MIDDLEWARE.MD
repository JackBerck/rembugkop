# PROMPT — Step 2: Auth & Role Middleware RembugKop.id

> Cara pakai: jalankan setelah Step 1 (Seeder & Factory) selesai dan `php artisan migrate:fresh --seed` berhasil. Modul ini memanfaatkan **Laravel Fortify** yang sudah terpasang (`app/Actions/Fortify/CreateNewUser.php`) dan komponen Inertia React di `resources/js/pages/auth/`. Rujuk `TECHNICAL_REFERENCE.md` §5 untuk Policy dan `APP_REFERENCE.md` §2 untuk styling.

## Konteks

3 role: `super_admin`, `pengurus`, `anggota` (`UserRole`). Registrasi publik **hanya untuk role `anggota`** — akun `pengurus` dan `super_admin` dibuat manual (seeder / admin panel).

Anggota yang baru mendaftar tidak otomatis bisa langsung menyewa aset atau melakukan voting — mereka wajib melalui **verifikasi NIK** (`member_profiles.verification_status` = `VerificationStatus::Pending`) oleh pengurus. Ada dua lapis gate:
1. **Role** (`UserRole::Anggota`)
2. **Status Verifikasi** (`VerificationStatus::Verified`)

## Langkah Awal (wajib dicek sebelum menulis kode)

1. Cek `app/Actions/Fortify/CreateNewUser.php` — Fortify sudah terpasang. Modifikasi action ini untuk registrasi anggota + profil.
2. Cek `bootstrap/app.php` — daftarkan alias middleware custom di sini (`$middleware->alias(...)`).
3. Cek `app/Enums/` — WAJIB gunakan Enum yang sudah ada: `UserRole`, `UserStatus`, `VerificationStatus`, `ReservationStatus`, `ProposalStatus`.

---

## Detail Tugas & Spesifikasi Implementation

### 1. Registrasi Anggota (Fortify `CreateNewUser`)

Extend `app/Actions/Fortify/CreateNewUser.php` dengan `DB::transaction()` untuk menghasilkan **dua record atomic**: `User` + `MemberProfile`.

Input Form: `name`, `email`, `phone`, `password`, `password_confirmation`, `national_id` (16 digit NIK, unique di `member_profiles`), `address`.

```php
// Di dalam App\Actions\Fortify\CreateNewUser::create()
return DB::transaction(function () use ($input) {
    $user = User::create([
        'name' => $input['name'],
        'email' => $input['email'],
        'phone' => $input['phone'],
        'password' => Hash::make($input['password']),
        'role' => UserRole::Anggota,
        'status' => UserStatus::Active,
    ]);

    $user->memberProfile()->create([
        'member_number' => 'KOP-'.date('Y').'-'.str_pad((string) (MemberProfile::max('id') + 1), 4, '0', STR_PAD_LEFT),
        'national_id' => $input['national_id'], // di-cast encrypted di model
        'address' => $input['address'],
        'joined_at' => now(),
        'principal_savings' => 100000.00,
        'mandatory_savings_total' => 0.00,
        'verification_status' => VerificationStatus::Pending,
    ]);

    return $user;
});
```

Aturan Validasi:
- `national_id`: `['required', 'digits:16', 'unique:member_profiles,national_id']`
- `address`: `['required', 'string', 'max:500']`
- `phone`: `['required', 'string', 'regex:/^08[0-9]{8,11}$/']`

Setelah registrasi sukses, arahkan user ke halaman "Menunggu Verifikasi NIK" (`resources/js/pages/auth/verification-pending.tsx`), bukan langsung ke fitur transaksi.

### 2. Redirect Setelah Login

Modifikasi callback/response login Fortify:
- Role `super_admin` & `pengurus` → `/dashboard`
- Role `anggota` → `/beranda` (atau `/verification-pending` jika `verification_status` masih `pending`)

### 3. Middleware Role Custom (`EnsureUserHasRole`)

Buat middleware `app/Http/Middleware/EnsureUserHasRole.php`:

```php
namespace App\Http\Middleware;

use App\Enums\UserRole;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user || ! in_array($user->role->value, $roles, true)) {
            abort(403, 'Anda tidak memiliki akses ke halaman ini.');
        }

        return $next($request);
    }
}
```

Daftarkan alias di `bootstrap/app.php`:

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->alias([
        'role' => \App\Http\Middleware\EnsureUserHasRole::class,
        'member.verified' => \App\Http\Middleware\EnsureMemberIsVerified::class,
    ]);
})
```

Contoh Rute (`routes/web.php`):

```php
Route::middleware(['auth', 'role:pengurus,super_admin'])->prefix('dashboard')->group(function () {
    // Rute internal pengurus/admin
});

Route::middleware(['auth', 'role:anggota', 'member.verified'])->group(function () {
    // Rute transaksi (sewa aset, submit vote)
});

Route::middleware(['auth', 'role:anggota'])->group(function () {
    // Rute baca-saja (katalog aset, status verifikasi mandiri)
});
```

### 4. Middleware Verifikasi Anggota (`EnsureMemberIsVerified`)

Buat middleware `app/Http/Middleware/EnsureMemberIsVerified.php`:

```php
namespace App\Http\Middleware;

use App\Enums\VerificationStatus;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureMemberIsVerified
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        $profile = $user?->memberProfile;

        if (! $profile || $profile->verification_status !== VerificationStatus::Verified) {
            return redirect()->route('verification.pending')
                ->with('warning', 'Akun Anda masih menunggu verifikasi NIK oleh pengurus sebelum dapat melakukan aksi ini.');
        }

        return $next($request);
    }
}
```

### 5. Policy Dasar (`AssetReservationPolicy` & `ProposalPolicy`)

Lengkapi authorization logic berbasis Enum:

```php
// app/Policies/AssetReservationPolicy.php
use App\Enums\ReservationStatus;
use App\Enums\UserRole;
use App\Enums\VerificationStatus;

class AssetReservationPolicy
{
    public function create(User $user): bool
    {
        return $user->isAnggota()
            && $user->memberProfile?->verification_status === VerificationStatus::Verified;
    }

    public function approve(User $user, AssetReservation $reservation): bool
    {
        return ($user->isPengurus() || $user->isAdmin())
            && $reservation->status === ReservationStatus::Pending;
    }
}
```

```php
// app/Policies/ProposalPolicy.php
use App\Enums\ProposalStatus;
use App\Enums\UserRole;
use App\Enums\VerificationStatus;

class ProposalPolicy
{
    public function vote(User $user, Proposal $proposal): bool
    {
        return $user->isAnggota()
            && $user->memberProfile?->verification_status === VerificationStatus::Verified
            && $proposal->status === ProposalStatus::Open
            && ! $proposal->votes()->where('user_id', $user->id)->exists();
    }

    public function propose(User $user): bool
    {
        return $user->isPengurus() || $user->isAdmin();
    }
}
```

### 6. Halaman Auth Frontend (React + Inertia)

File komponen ada di folder `resources/js/pages/auth/`:
- `resources/js/pages/auth/register.tsx` — sesuaikan form register dengan field `national_id` & `address`.
- `resources/js/pages/auth/login.tsx` — form login Fortify.
- `resources/js/pages/auth/verification-pending.tsx` — halaman status "Menunggu Verifikasi NIK" dengan pesan ramah & kontak pengurus.

---

## Checklist Selesai

- [ ] Registrasi publik hanya membuat role `anggota` (`UserRole::Anggota`).
- [ ] Insert `users` + `member_profiles` dibungkus `DB::transaction()` atomic di `CreateNewUser.php`.
- [ ] Kolom profil menggunakan Bahasa Inggris (`national_id`, `address`, `member_number`, `verification_status`).
- [ ] Login redirect dinamis sesuai role & status verifikasi.
- [ ] Middleware `role:pengurus,super_admin` membatasi akses dengan 403.
- [ ] Middleware `member.verified` me-redirect anggota pending ke `verification.pending`.
- [ ] Policy `AssetReservationPolicy::create` dan `ProposalPolicy::vote` mengecek role **dan** status `VerificationStatus::Verified`.
- [ ] `ProposalPolicy::vote` mengecek `ProposalStatus::Open` (bukan `RembugOpen`).