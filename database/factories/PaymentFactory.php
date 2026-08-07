<?php

namespace Database\Factories;

use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Models\AssetReservation;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Payment>
 */
class PaymentFactory extends Factory
{
    public function definition(): array
    {
        $method = fake()->randomElement(PaymentMethod::cases());
        $status = fake()->randomElement(PaymentStatus::cases());
        $reservation = AssetReservation::factory();

        return [
            'reservation_id' => $reservation,
            'amount' => 0, // Set in seeder to match reservation calculated_price
            'method' => $method,
            'gateway_provider' => $method === PaymentMethod::Gateway ? fake()->randomElement(['midtrans', 'xendit']) : null,
            'gateway_transaction_id' => $method === PaymentMethod::Gateway ? 'TXN-'.strtoupper(fake()->unique()->bothify('??####??####')) : null,
            'gateway_status' => $method === PaymentMethod::Gateway ? fake()->randomElement(['settlement', 'pending', 'deny', 'expire']) : null,
            'status' => $status,
            'recorded_by' => $method === PaymentMethod::Manual ? User::factory()->pengurus() : null,
            'paid_at' => $status === PaymentStatus::Paid ? fake()->dateTimeBetween('-2 months', 'now')->format('Y-m-d H:i:s') : null,
        ];
    }

    public function paid(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => PaymentStatus::Paid,
            'paid_at' => fake()->dateTimeBetween('-2 months', 'now')->format('Y-m-d H:i:s'),
        ]);
    }

    public function manual(): static
    {
        return $this->state(fn (array $attributes) => [
            'method' => PaymentMethod::Manual,
            'gateway_provider' => null,
            'gateway_transaction_id' => null,
            'gateway_status' => null,
        ]);
    }

    public function gateway(): static
    {
        return $this->state(fn (array $attributes) => [
            'method' => PaymentMethod::Gateway,
            'gateway_provider' => fake()->randomElement(['midtrans', 'xendit']),
            'gateway_transaction_id' => 'TXN-'.strtoupper(fake()->bothify('??####??####')),
            'gateway_status' => 'settlement',
        ]);
    }
}
