<?php

namespace App\Actions\Reservation;

use App\Enums\DurationType;
use App\Enums\ReservationStatus;
use App\Models\Asset;
use App\Models\AssetReservation;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class CreateReservationAction
{
    /**
     * Create a reservation with DB-level lock to prevent race conditions.
     * calculated_price is always computed server-side — never trusted from client.
     *
     * @param  array<string, mixed>  $data
     */
    public function execute(array $data, User $renter): AssetReservation
    {
        return DB::transaction(function () use ($data, $renter): AssetReservation {
            // Row-level lock prevents concurrent bookings for the same slot
            $asset = Asset::lockForUpdate()->findOrFail($data['asset_id']);

            $start = Carbon::parse($data['start_datetime']);
            $end = Carbon::parse($data['end_datetime']);

            // Double-check overlap inside transaction (defense against race condition)
            abort_if(
                AssetReservation::where('asset_id', $asset->id)
                    ->overlapping($start, $end)
                    ->exists(),
                422,
                'Slot sudah terisi. Silakan pilih jadwal lain.'
            );

            $price = $this->calculatePrice(
                $asset,
                $start,
                $end,
                DurationType::from($data['duration_type'])
            );

            return AssetReservation::create([
                'asset_id' => $asset->id,
                'user_id' => $renter->id,
                'start_datetime' => $start,
                'end_datetime' => $end,
                'duration_type' => $data['duration_type'],
                'calculated_price' => $price,
                'status' => ReservationStatus::Pending,
                'notes' => $data['notes'] ?? null,
            ]);
        });
    }

    private function calculatePrice(Asset $asset, Carbon $start, Carbon $end, DurationType $durationType): float
    {
        if ($durationType === DurationType::Hourly && $asset->hourly_rate) {
            return $start->diffInHours($end) * (float) $asset->hourly_rate;
        }

        $days = max(1, $start->diffInDays($end));

        return $days * (float) $asset->daily_rate;
    }
}
