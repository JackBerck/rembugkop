<?php

namespace App\Policies;

use App\Enums\ReservationStatus;
use App\Models\Asset;
use App\Models\User;

class AssetPolicy
{
    /**
     * Hanya pengurus/admin yang bisa membuat aset baru.
     */
    public function create(User $user): bool
    {
        return $user->isPengurus() || $user->isAdmin();
    }

    /**
     * Hanya pengurus/admin yang bisa mengedit aset.
     */
    public function update(User $user, Asset $asset): bool
    {
        return $user->isPengurus() || $user->isAdmin();
    }

    /**
     * Aset hanya bisa dihapus kalau tidak punya reservasi aktif (pending/approved/ongoing).
     * Untuk "nonaktifkan" tanpa hapus, gunakan update status → inactive.
     */
    public function delete(User $user, Asset $asset): bool
    {
        return ($user->isPengurus() || $user->isAdmin())
            && ! $asset->reservations()
                ->whereIn('status', [
                    ReservationStatus::Pending->value,
                    ReservationStatus::Approved->value,
                    ReservationStatus::Ongoing->value,
                ])
                ->exists();
    }

    /**
     * Semua user bisa melihat aset (katalog publik).
     */
    public function view(User $user, Asset $asset): bool
    {
        return true;
    }

    /**
     * Semua user bisa melihat daftar aset (katalog publik).
     */
    public function viewAny(User $user): bool
    {
        return true;
    }
}
