<?php

namespace Database\Factories;

use App\Enums\DurationType;
use App\Enums\ReservationStatus;
use App\Models\Asset;
use App\Models\AssetReservation;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AssetReservation>
 */
class AssetReservationFactory extends Factory
{
    public function definition(): array
    {
        $durationType = fake()->randomElement(DurationType::cases());
        $startDatetime = fake()->dateTimeBetween('-3 months', '+1 month');

        if ($durationType === DurationType::Hourly) {
            $hours = fake()->numberBetween(1, 8);
            $endDatetime = (clone $startDatetime)->modify("+{$hours} hours");
        } else {
            $days = fake()->numberBetween(1, 5);
            $endDatetime = (clone $startDatetime)->modify("+{$days} days");
        }

        return [
            'asset_id' => Asset::factory(),
            'user_id' => User::factory(),
            'start_datetime' => $startDatetime->format('Y-m-d H:i:s'),
            'end_datetime' => $endDatetime->format('Y-m-d H:i:s'),
            'duration_type' => $durationType,
            'calculated_price' => 0, // Set explicitly in seeder based on actual asset rates
            'status' => ReservationStatus::Pending,
            'approved_by' => null,
            'notes' => fake()->optional(0.4)->sentence(),
        ];
    }

    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => ReservationStatus::Approved,
        ]);
    }

    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => ReservationStatus::Completed,
        ]);
    }

    public function cancelled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => ReservationStatus::Cancelled,
        ]);
    }

    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => ReservationStatus::Rejected,
        ]);
    }
}
