# TECHNICAL_REFERENCE.md — RembugKop.id

Acuan coding standard untuk proyek RembugKop.id (Laravel 13 + Inertia.js v3 + React 19 + TailwindCSS v4 + ShadCN UI + Wayfinder). Dokumen ini hidup — update kalau ada keputusan baru selama development.

---

## 1. Struktur Layer & Tanggung Jawab

Prinsip dasar: **controller setipis mungkin**, logic bisnis pindah ke Action/Service, query kompleks pindah ke Model (scope) atau Query Object/Repository kalau sudah rumit.

```
app/
├── Actions/          # satu class = satu use case (single responsibility)
├── Http/
│   ├── Controllers/  # cuma orchestrate: terima request → panggil Action/Service → return response
│   ├── Requests/      # validasi & authorization per endpoint
│   └── Resources/     # bentuk data yang dikirim ke frontend (Inertia props / JSON)
├── Models/            # relasi, scope, accessor/mutator, cast
├── Services/           # logic yang dipakai lintas Action (mis. hitung tarif sewa, hash chain kas)
├── Policies/           # otorisasi per model
└── Traits/             # perilaku reusable lintas model (dipakai secukupnya, lihat §3)
```

### Kapan pakai Controller vs Action vs Service?

| Situasi | Pakai |
|---|---|
| CRUD standar, logic simpel | Langsung di Controller (method `store`, `update`, dst) |
| Satu proses bisnis spesifik (mis. "ApproveReservation", "CastVote", "RecordManualPayment") | **Action class** — 1 class, 1 method `execute()`/`handle()`, gampang di-test terpisah |
| Logic dipakai berulang di banyak Action/Controller (mis. kalkulasi tarif, generate hash treasury) | **Service class** |
| Perilaku generik lintas model tanpa state (mis. `HasUuid`, `Auditable`) | **Trait** |

**Contoh pola Action** (bukan menaruh semua logic di controller):

```php
// app/Actions/Reservation/ApproveReservationAction.php
use App\Enums\ReservationStatus;
use App\Models\AssetReservation;
use App\Models\User;

class ApproveReservationAction
{
    public function execute(AssetReservation $reservation, User $approver): AssetReservation
    {
        abort_if($reservation->status !== ReservationStatus::Pending, 422, 'Reservasi sudah diproses.');

        $reservation->update([
            'status' => ReservationStatus::Approved,
            'approved_by' => $approver->id,
        ]);

        return $reservation;
    }
}
```

```php
// Controller tinggal orchestrate
public function approve(AssetReservation $reservation, ApproveReservationAction $action)
{
    $this->authorize('approve', $reservation);
    $action->execute($reservation, auth()->user());

    return back()->with('success', 'Reservasi disetujui.');
}
```

Kenapa bukan taruh langsung di controller? Karena `ApproveReservationAction` bisa dipanggil ulang dari command/job (mis. auto-approve setelah pembayaran gateway sukses) tanpa duplikasi logic.

### Kapan butuh Trait, kapan enggak

Trait itu gampang disalahgunakan jadi "tempat sampah logic". Aturan pakai:
- **Pakai trait** kalau perilakunya benar-benar generik & lintas model tanpa dependency ke konteks spesifik model (contoh: `HasUuid`, `Filterable`, `GeneratesHashChain`).
- **Jangan pakai trait** kalau isinya spesifik ke satu model — taruh langsung di model itu saja, jangan dipaksa jadi trait "biar rapi".
- Trait bukan pengganti Service. Kalau butuh dependency injection (call API eksternal, dsb), itu tanda harus jadi Service, bukan trait.

---

## 2. Model

- Model **hanya** berisi: relasi, scope query, accessor/mutator (`Attribute::make()`), cast, dan constant/enum terkait model itu sendiri.
- Jangan taruh logic bisnis kompleks (kalkulasi harga, kirim notifikasi, dsb) di dalam model — itu tugas Action/Service.
- Selalu definisikan `$fillable` (bukan `$guarded = []`) supaya eksplisit field mana yang boleh mass-assignment.
- Selalu definisikan `$casts` untuk enum, decimal, dan datetime — jangan format manual di controller/blade.

```php
use App\Enums\ReservationStatus;

class AssetReservation extends Model
{
    protected $fillable = ['asset_id', 'user_id', 'start_datetime', 'end_datetime', 'duration_type', 'calculated_price', 'status', 'approved_by', 'notes'];

    protected $casts = [
        'start_datetime' => 'datetime',
        'end_datetime' => 'datetime',
        'calculated_price' => 'decimal:2',
        'status' => ReservationStatus::class, // pakai native PHP Enum, bukan string mentah
    ];

    public function asset(): BelongsTo { return $this->belongsTo(Asset::class); }
    public function renter(): BelongsTo { return $this->belongsTo(User::class, 'user_id'); }
    public function payments(): HasMany { return $this->hasMany(Payment::class); }

    public function scopeOverlapping(Builder $query, Carbon $start, Carbon $end): Builder
    {
        return $query->where('start_datetime', '<', $end)
                     ->where('end_datetime', '>', $start)
                     ->whereIn('status', [ReservationStatus::Approved, ReservationStatus::Ongoing]);
    }
}
```

**Rekomendasi**: pakai native PHP 8.1+ Enum (`ReservationStatus::Pending`) untuk kolom `status`, bukan string biasa. Lebih type-safe, autocomplete jalan, dan menghindari typo `'aproved'` yang lolos ke production.

---

## 3. Penanganan N+1 Query

`with()` di query builder (`Model::with('relasi')->get()`) sudah benar arahnya, tapi ini beberapa penyempurnaan yang sering kelewat:

### 3.1 Cegah N+1 dari awal development, bukan pas ketahuan lambat

Di `AppServiceProvider::boot()` (khusus environment lokal/testing), aktifkan:

```php
public function boot(): void
{
    Model::preventLazyLoading(! app()->isProduction());
    Model::preventSilentlyDiscardingAttributes(! app()->isProduction());
}
```

Efeknya: begitu ada kode yang tidak sengaja lazy-load relasi (akses `$reservation->asset->name` tanpa eager load), aplikasi langsung throw exception di local/testing — ketahuan dari awal, bukan pas sudah production dan dashboard lemot.

### 3.2 Eager load spesifik kolom, jangan tarik semua

```php
// Kurang efisien — tarik semua kolom assets
AssetReservation::with('asset')->get();

// Lebih efisien — tarik kolom yang dipakai saja
AssetReservation::with('asset:id,name,tarif_per_jam,tarif_per_hari')->get();
```

### 3.3 `load()` vs `with()` vs `loadMissing()`

- `with()` — eager load saat query awal (paling umum).
- `load()` — eager load setelah model sudah di-fetch (mis. di dalam Action setelah `find()`), tapi **selalu load ulang** walau relasinya sudah pernah dimuat.
- `loadMissing()` — sama seperti `load()` tapi **skip** kalau relasi sudah dimuat sebelumnya. Lebih aman dipakai default di dalam Resource/transformer supaya tidak query dobel kalau dipanggil dari beberapa tempat.

```php
// Di dalam Resource, gunakan loadMissing agar aman dipanggil dari mana saja
public function toArray(Request $request): array
{
    $this->resource->loadMissing(['asset:id,name', 'payments']);
    // ...
}
```

### 3.4 `withCount()` / `withSum()` / `withExists()` daripada load relasi penuh cuma buat hitung

```php
// Kalau cuma butuh jumlah vote per proposal, jangan load semua row votes
Proposal::withCount(['votes as setuju_count' => fn ($q) => $q->where('choice', VoteChoice::Agree)])->get();

// Kalau cuma butuh cek "apakah user ini sudah vote", jangan load relasi penuh
Proposal::withExists(['votes as has_voted' => fn ($q) => $q->where('user_id', auth()->id())])->get();
```

### 3.5 Query monitoring saat development

- **Laravel Debugbar** (`barryvdh/laravel-debugbar`) — lihat jumlah query per halaman, langsung ketahuan kalau ada N+1 (query count meledak jadi ratusan pas load daftar aset/reservasi).
- **Laravel Telescope** — lebih detail, cocok untuk debugging query di local, sekaligus monitor job/queue kalau nanti pakai notifikasi async.

Set target kasar: halaman list (index) idealnya < 10 query. Kalau lebih dari itu, cek eager loading.

### 3.6 Inertia-specific: jangan overfetch di `Inertia::render`

Karena Inertia ngirim seluruh props sebagai JSON tiap request, hindari `with('relasi')->get()` lalu lempar Eloquent Collection mentah ke props — pakai API Resource supaya kolom yang dikirim ke frontend eksplisit dan konsisten (juga otomatis menghindari over-fetching kolom sensitif seperti `nik`).

---

## 4. Form Request & Validasi

Semua input dari form (reservasi, proposal, vote, dsb) **wajib** lewat `FormRequest`, jangan validasi manual di controller.

```php
use App\Enums\DurationType;
use App\Enums\UserRole;

class StoreReservationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isAnggota();
    }

    public function rules(): array
    {
        return [
            'asset_id' => ['required', 'exists:assets,id'],
            'start_datetime' => ['required', 'date', 'after:now'],
            'end_datetime' => ['required', 'date', 'after:start_datetime'],
            'duration_type' => ['required', Rule::enum(DurationType::class)],
        ];
    }
}
```

Validasi overlap booking (cek §3 skema database) sebaiknya juga dicek di sini via `withValidator()` supaya error muncul sebagai validation error yang rapi di form React, bukan exception 500.

---

## 5. Otorisasi — Policy, bukan `if` bertebaran

Tiap model yang punya aturan akses (siapa boleh approve reservasi, siapa boleh vote, siapa boleh lihat kas) **wajib** punya Policy, dipanggil via `$this->authorize()` di controller atau `@can` di React lewat props yang dikirim dari backend (mis. `can: { approve: true }`).

```php
use App\Enums\ReservationStatus;

class AssetReservationPolicy
{
    public function approve(User $user, AssetReservation $reservation): bool
    {
        return ($user->isPengurus() || $user->isAdmin()) && $reservation->status === ReservationStatus::Pending;
    }
}
```

Jangan taruh logic `if ($user->role === 'pengurus')` tersebar di controller/blade/React — satu sumber kebenaran di Policy.

---

## 6. Konvensi Frontend (React + Inertia)

- Struktur folder per fitur (`resources/js/pages/Reservations/`, `resources/js/pages/Proposals/`), bukan per tipe file, supaya gampang navigasi.
- Komponen UI generik (button, card, modal) dari ShadCN taruh di `resources/js/components/ui/`, komponen spesifik fitur taruh di folder fitur masing-masing.
- Selalu gunakan **Laravel Wayfinder** untuk URL/route helper di React (`import { reservations } from '@/routes'` atau `@/actions`). Hindari URL string hardcoded.
- Pakai `useForm()` dari Inertia v3 untuk semua form submission (sudah handle loading state, error, dan reset otomatis).
- Props dari backend harus sudah dalam bentuk final siap render (lewat API Resource) — jangan lakukan transformasi data berat (format currency, hitung persentase vote, dsb) di komponen React kalau bisa dihitung sekali di backend.
- TypeScript: definisikan `types/index.d.ts` untuk shape props utama (`Reservation`, `Proposal`, `Asset`, dst) supaya autocomplete jalan dan ketahuan kalau backend berubah shape tanpa sengaja.

---

## 7. Git Branching & Commit Message

### Branching

- `main` — selalu deployable, cuma nerima merge dari `develop` atau hotfix.
- `develop` — integrasi fitur sebelum rilis.
- `feature/<nama-fitur>` — mis. `feature/rembug-voting`, `feature/asset-reservation`.
- `fix/<nama-bug>` — untuk perbaikan bug non-urgent.
- `hotfix/<nama>` — langsung dari `main` untuk bug urgent di production.

Untuk tim kecil/kompetisi kayak GEMASTIK, versi simpelnya cukup: `main` + `feature/*`, merge via PR ke `main` setelah review sendiri/tim, tanpa perlu `develop` kalau timeline mepet.

### Commit Message — Conventional Commits

Format: `<type>(<scope>): <deskripsi singkat>`

| Type | Kapan dipakai |
|---|---|
| `feat` | Fitur baru |
| `fix` | Perbaikan bug |
| `refactor` | Ubah struktur kode tanpa ubah behavior |
| `perf` | Perbaikan performa (mis. fix N+1) |
| `docs` | Perubahan dokumentasi |
| `test` | Nambah/ubah test |
| `chore` | Setup, dependency, config |
| `style` | Formatting, tidak ada perubahan logic |

Contoh:
```
feat(reservation): tambah validasi overlap booking aset
fix(voting): cegah user vote dua kali di proposal sama
perf(dashboard): eager load relasi asset di list reservasi, fix N+1
refactor(payment): pindah logic hitung tarif ke Service
docs(readme): update instruksi setup local environment
```

Aturan tambahan:
- Satu commit = satu perubahan logis. Jangan gabung `feat` + `fix` tidak berhubungan dalam satu commit.
- Body commit (opsional, baris setelah judul) dipakai kalau perlu jelasin *kenapa*, bukan cuma *apa* — kode sudah menjelaskan "apa", commit message menjelaskan "kenapa".
- Kalau kerja tim, tambahkan referensi issue/task kalau pakai tracker: `feat(voting): tambah halaman hasil voting (#12)`.

---

## 8. Testing

- Prioritas: **Feature test** (test endpoint end-to-end lewat HTTP, termasuk otorisasi & validasi) di atas Unit test murni, karena lebih representatif terhadap perilaku aplikasi nyata.
- Wajib ada test untuk business rule yang krusial buat penilaian GEMASTIK:
  - Overlap booking ditolak.
  - User tidak bisa vote dua kali di proposal yang sama (unique constraint + validasi).
  - Hash chain treasury konsisten (test bahwa mengubah 1 row bikin hash tidak match).
  - Role tanpa izin ditolak akses (mis. anggota coba approve reservasi → 403).

```php
it('menolak reservasi yang overlap dengan reservasi lain', function () {
    $asset = Asset::factory()->create();
    AssetReservation::factory()->approved()->for($asset)->create([
        'start_datetime' => now()->addDay(),
        'end_datetime' => now()->addDay()->addHours(2),
    ]);

    $response = $this->actingAs($anggota)->post(route('reservations.store'), [
        'asset_id' => $asset->id,
        'start_datetime' => now()->addDay()->addHour(), // overlap
        'end_datetime' => now()->addDay()->addHours(3),
    ]);

    $response->assertSessionHasErrors();
});
```

---

## 9. Checklist Sebelum Commit / PR

- [ ] Tidak ada query N+1 baru (cek via Debugbar, atau `Model::preventLazyLoading` sudah aktif di local).
- [ ] Input divalidasi lewat FormRequest, bukan manual di controller.
- [ ] Otorisasi lewat Policy, bukan `if` role tersebar.
- [ ] Logic bisnis non-trivial ada di Action/Service, bukan menumpuk di controller.
- [ ] Ada test untuk business rule baru (minimal happy path + 1 edge case).
- [ ] Commit message ikut format Conventional Commits.
- [ ] Tidak ada data sensitif (NIK, password, token gateway) ter-log atau ter-expose ke props frontend tanpa perlu.

---

Dokumen ini bisa terus ditambah seiring development — kalau ada keputusan arsitektur baru (mis. mulai butuh queue/job untuk notifikasi, atau caching untuk dashboard kas), catat di sini juga.