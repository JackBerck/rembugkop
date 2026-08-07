<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::inertia('/', 'welcome')->name('home');

/*
|--------------------------------------------------------------------------
| Verification Pending — anggota baru setelah register
|--------------------------------------------------------------------------
*/
Route::get('/verification-pending', function () {
    return Inertia::render('auth/verification-pending');
})->middleware('auth')->name('verification.pending');

/*
|--------------------------------------------------------------------------
| Beranda anggota terverifikasi
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:anggota', 'member.verified'])->group(function () {
    Route::inertia('/beranda', 'beranda')->name('beranda');
});

/*
|--------------------------------------------------------------------------
| Dashboard pengurus & super_admin
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:pengurus,super_admin'])->prefix('dashboard')->group(function () {
    Route::inertia('/', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
