<?php

namespace App\Policies;

use App\Enums\ReservationStatus;
use App\Enums\VerificationStatus;
use App\Models\AssetReservation;
use App\Models\User;

class AssetReservationPolicy
{
    /**
     * Anggota terverifikasi bisa membuat reservasi baru.
     */
    public function create(User $user): bool
    {
        return $user->isAnggota()
            && $user->memberProfile?->verification_status === VerificationStatus::Verified;
    }

    /**
     * Pengurus/admin bisa menyetujui reservasi yang masih pending.
     */
    public function approve(User $user, AssetReservation $reservation): bool
    {
        return ($user->isPengurus() || $user->isAdmin())
            && $reservation->status === ReservationStatus::Pending;
    }

    /**
     * Pengurus/admin bisa menolak reservasi yang masih pending.
     */
    public function reject(User $user, AssetReservation $reservation): bool
    {
        return ($user->isPengurus() || $user->isAdmin())
            && $reservation->status === ReservationStatus::Pending;
    }

    /**
     * Anggota bisa membatalkan reservasi miliknya sendiri (hanya jika masih pending).
     */
    public function cancel(User $user, AssetReservation $reservation): bool
    {
        return $user->id === $reservation->user_id
            && $reservation->status === ReservationStatus::Pending;
    }

    /**
     * Anggota lihat reservasi miliknya sendiri, pengurus/admin lihat semua.
     */
    public function view(User $user, AssetReservation $reservation): bool
    {
        return $user->id === $reservation->user_id
            || $user->isPengurus()
            || $user->isAdmin();
    }

    /**
     * Pengurus/admin bisa lihat semua reservasi.
     */
    public function viewAny(User $user): bool
    {
        return $user->isPengurus() || $user->isAdmin();
    }
}
