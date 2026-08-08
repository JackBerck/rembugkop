<?php

namespace App\Actions\Reservation;

use App\Enums\ReservationStatus;
use App\Models\AssetReservation;
use App\Models\User;

class ApproveReservationAction
{
    public function execute(AssetReservation $reservation, User $approver): AssetReservation
    {
        $reservation->update([
            'status' => ReservationStatus::Approved,
            'approved_by' => $approver->id,
        ]);

        return $reservation->fresh();
    }
}
