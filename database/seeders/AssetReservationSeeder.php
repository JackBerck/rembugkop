<?php

namespace Database\Seeders;

use App\Enums\DurationType;
use App\Enums\ReservationStatus;
use App\Models\Asset;
use App\Models\AssetReservation;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class AssetReservationSeeder extends Seeder
{
    public function run(): void
    {
        $assets = Asset::all();
        $anggota = User::where('role', 'anggota')->get();
        $pengurus = User::where('role', 'pengurus')->get();

        // Track occupied slots per asset to prevent overlap for approved/ongoing
        $occupiedSlots = []; // asset_id => [[start, end], ...]

        $statuses = [
            ReservationStatus::Completed,
            ReservationStatus::Completed,
            ReservationStatus::Completed,
            ReservationStatus::Approved,
            ReservationStatus::Pending,
            ReservationStatus::Cancelled,
            ReservationStatus::Rejected,
        ];

        foreach ($assets as $asset) {
            $occupiedSlots[$asset->id] = [];

            // Each asset gets 8–15 reservations spread over 3 months
            $count = rand(8, 15);

            for ($i = 0; $i < $count; $i++) {
                $status = $statuses[array_rand($statuses)];
                $durationType = $asset->hourly_rate ? fake()->randomElement(DurationType::cases()) : DurationType::Daily;

                // Generate a non-overlapping slot for approved/ongoing statuses
                [$start, $end] = $this->generateSlot($durationType, $occupiedSlots[$asset->id], $status);

                if ($start === null) {
                    continue; // Skip if can't find a valid slot after retries
                }

                // Calculate price from actual asset rates
                $calculatedPrice = $this->calculatePrice($asset, $durationType, $start, $end);

                $approver = ($status === ReservationStatus::Approved || $status === ReservationStatus::Completed)
                    ? $pengurus->random()->id
                    : null;

                $reservation = AssetReservation::create([
                    'asset_id' => $asset->id,
                    'user_id' => $anggota->random()->id,
                    'start_datetime' => $start->format('Y-m-d H:i:s'),
                    'end_datetime' => $end->format('Y-m-d H:i:s'),
                    'duration_type' => $durationType,
                    'calculated_price' => $calculatedPrice,
                    'status' => $status,
                    'approved_by' => $approver,
                    'notes' => fake()->optional(0.4)->sentence(),
                ]);

                // Record slot if status could block future bookings
                if (in_array($status, [ReservationStatus::Approved, ReservationStatus::Ongoing])) {
                    $occupiedSlots[$asset->id][] = [$start, $end];
                }
            }
        }
    }

    private function generateSlot(DurationType $durationType, array $occupiedSlots, ReservationStatus $status): array
    {
        $maxRetries = 20;

        for ($attempt = 0; $attempt < $maxRetries; $attempt++) {
            $start = Carbon::now()->subMonths(3)->addDays(rand(0, 110));
            $start->setTime(rand(7, 16), 0, 0);

            if ($durationType === DurationType::Hourly) {
                $hours = rand(1, 8);
                $end = $start->copy()->addHours($hours);
            } else {
                $days = rand(1, 5);
                $end = $start->copy()->addDays($days);
            }

            // For non-blocking statuses, no overlap check needed
            if (! in_array($status, [ReservationStatus::Approved, ReservationStatus::Ongoing])) {
                return [$start, $end];
            }

            // Check overlap against existing approved/ongoing slots
            $overlaps = false;
            foreach ($occupiedSlots as [$slotStart, $slotEnd]) {
                if ($start < $slotEnd && $end > $slotStart) {
                    $overlaps = true;
                    break;
                }
            }

            if (! $overlaps) {
                return [$start, $end];
            }
        }

        return [null, null]; // Could not find non-overlapping slot
    }

    private function calculatePrice(Asset $asset, DurationType $durationType, Carbon $start, Carbon $end): float
    {
        if ($durationType === DurationType::Hourly && $asset->hourly_rate) {
            $hours = $start->diffInHours($end);

            return $hours * (float) $asset->hourly_rate;
        }

        $days = max(1, $start->diffInDays($end));

        return $days * (float) $asset->daily_rate;
    }
}
