<?php

namespace Database\Seeders;

use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Enums\ReservationStatus;
use App\Models\AssetReservation;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Database\Seeder;

class PaymentSeeder extends Seeder
{
    public function run(): void
    {
        $pengurus = User::where('role', 'pengurus')->get();

        // Create payments for completed and approved reservations
        $reservations = AssetReservation::whereIn('status', [
            ReservationStatus::Completed->value,
            ReservationStatus::Approved->value,
        ])->get();

        foreach ($reservations as $reservation) {
            $method = fake()->randomElement(PaymentMethod::cases());
            $isPaid = $reservation->status === ReservationStatus::Completed;

            // Completed reservations should have paid payments
            $status = $isPaid
                ? PaymentStatus::Paid
                : fake()->randomElement([PaymentStatus::Pending, PaymentStatus::Paid]);

            Payment::create([
                'reservation_id' => $reservation->id,
                'amount' => $reservation->calculated_price, // matches exactly
                'method' => $method,
                'gateway_provider' => $method === PaymentMethod::Gateway ? fake()->randomElement(['midtrans', 'xendit']) : null,
                'gateway_transaction_id' => $method === PaymentMethod::Gateway
                    ? 'TXN-'.strtoupper(fake()->unique()->bothify('??####??####'))
                    : null,
                'gateway_status' => $method === PaymentMethod::Gateway
                    ? ($status === PaymentStatus::Paid ? 'settlement' : 'pending')
                    : null,
                'status' => $status,
                'recorded_by' => $method === PaymentMethod::Manual ? $pengurus->random()->id : null,
                'paid_at' => $status === PaymentStatus::Paid
                    ? fake()->dateTimeBetween('-2 months', 'now')->format('Y-m-d H:i:s')
                    : null,
            ]);
        }
    }
}
