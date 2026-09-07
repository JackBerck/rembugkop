<?php

use App\Http\Controllers\Dashboard\AssetController as DashboardAssetController;
use App\Http\Controllers\Dashboard\ReservationController as DashboardReservationController;
use App\Http\Controllers\Public\AssetCatalogController;
use App\Http\Controllers\Public\MyReservationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Halaman Publik Bebas Akses (Tanpa Login)
|--------------------------------------------------------------------------
*/
Route::inertia('/', 'welcome')->name('home');
Route::inertia('/kontak', 'public/kontak')->name('kontak');
Route::inertia('/faq', 'public/faq')->name('faq');
Route::inertia('/kebijakan-privasi', 'public/kebijakan-privasi')->name('kebijakan-privasi');
Route::inertia('/syarat-ketentuan', 'public/syarat-ketentuan')->name('syarat-ketentuan');
Route::inertia('/panduan-penggunaan', 'public/panduan-penggunaan')->name('panduan-penggunaan');

/*
|--------------------------------------------------------------------------
| Verification Pending — anggota baru setelah register
|--------------------------------------------------------------------------
*/
Route::get('/verification-pending', function () {
    return Inertia::render('auth/verification-pending');
})->middleware('auth')->name('verification.pending');

Route::get('/aset', [AssetCatalogController::class, 'index'])->name('asset-catalog');
Route::get('/aset/{asset}', [AssetCatalogController::class, 'show'])->name('asset-detail');

/*
|--------------------------------------------------------------------------
| Anggota Terverifikasi — Reservasi & Beranda
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:anggota', 'member.verified'])->group(function () {
    Route::inertia('/beranda', 'beranda')->name('beranda');

    // Reservasi saya
    Route::get('/reservasi-saya', [MyReservationController::class, 'index'])->name('my-reservations');
    Route::delete('/reservasi-saya/{reservation}', [MyReservationController::class, 'cancel'])->name('my-reservations.cancel');

    // Ajukan reservasi baru
    Route::post('/aset/{asset}/reservasi', [AssetCatalogController::class, 'store'])->name('reservations.store');
});

/*
|--------------------------------------------------------------------------
| Dashboard Pengurus & Super Admin
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:pengurus,super_admin'])->prefix('dashboard')->name('dashboard.')->group(function () {
    Route::inertia('/', 'dashboard')->name('home');

    // Manajemen Aset
    Route::resource('assets', DashboardAssetController::class);

    // Manajemen Reservasi
    Route::get('reservations', [DashboardReservationController::class, 'index'])->name('reservations.index');
    Route::get('reservations/{reservation}', [DashboardReservationController::class, 'show'])->name('reservations.show');
    Route::patch('reservations/{reservation}/approve', [DashboardReservationController::class, 'approve'])->name('reservations.approve');
    Route::patch('reservations/{reservation}/reject', [DashboardReservationController::class, 'reject'])->name('reservations.reject');
});

require __DIR__.'/settings.php';
