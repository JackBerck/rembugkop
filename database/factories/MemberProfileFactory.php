<?php

namespace Database\Factories;

use App\Enums\VerificationStatus;
use App\Models\MemberProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MemberProfile>
 */
class MemberProfileFactory extends Factory
{
    private static int $sequence = 0;

    public function definition(): array
    {
        self::$sequence++;
        $joinedAt = fake()->dateTimeBetween('-3 years', '-1 month');

        // Mandatory savings grows proportionally to membership duration
        $joinedAtCarbon = \Carbon\Carbon::parse($joinedAt->format('Y-m-d'));
        $monthsActive = $joinedAtCarbon->diffInMonths(now());
        $mandatorySavingsTotal = $monthsActive * 25000;

        return [
            'member_number' => 'KOP-'.date('Y', strtotime($joinedAt->format('Y-m-d'))).'-'.str_pad(self::$sequence, 4, '0', STR_PAD_LEFT),
            'national_id' => fake()->numerify('33##########0###'), // 16-digit NIK format
            'address' => fake()->streetAddress().', '.fake()->city(),
            'joined_at' => $joinedAt->format('Y-m-d'),
            'principal_savings' => 100000.00,
            'mandatory_savings_total' => $mandatorySavingsTotal,
            'verification_status' => VerificationStatus::Verified,
            'verified_by' => null,
            'verified_at' => fake()->dateTimeBetween($joinedAt, 'now')->format('Y-m-d H:i:s'),
        ];
    }

    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'verification_status' => VerificationStatus::Pending,
            'verified_by' => null,
            'verified_at' => null,
        ]);
    }

    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'verification_status' => VerificationStatus::Rejected,
            'verified_by' => null,
            'verified_at' => null,
        ]);
    }

    public function verifiedBy(User $verifier): static
    {
        return $this->state(fn (array $attributes) => [
            'verified_by' => $verifier->id,
        ]);
    }
}
