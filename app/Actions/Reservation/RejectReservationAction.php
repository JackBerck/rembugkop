<?php

namespace App\Actions\Reservation;

use App\Enums\ReservationStatus;
use App\Models\AssetReservation;
use App\Models\User;

class RejectReservationAction
{
    public function execute(AssetReservation $reservation, User $rejector, string $reason): AssetReservation
    {
        $reservation->update([
            'status' => ReservationStatus::Rejected,
            'notes' => $reason,
            'approved_by' => $rejector->id,
        ]);

        return $reservation->fresh();
    }
}
