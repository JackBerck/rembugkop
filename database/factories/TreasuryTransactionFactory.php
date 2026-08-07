<?php

namespace Database\Factories;

use App\Enums\TransactionCategory;
use App\Enums\TransactionType;
use App\Models\TreasuryTransaction;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<TreasuryTransaction>
 */
class TreasuryTransactionFactory extends Factory
{
    public function definition(): array
    {
        $type = fake()->randomElement(TransactionType::cases());
        $category = $type === TransactionType::Income
            ? fake()->randomElement([TransactionCategory::AssetRental, TransactionCategory::Dues])
            : fake()->randomElement([TransactionCategory::Operational, TransactionCategory::AssetProcurement]);

        $amount = fake()->randomElement([50000, 75000, 100000, 150000, 200000, 250000, 300000, 500000]);
        $transactionDate = fake()->dateTimeBetween('-6 months', 'now')->format('Y-m-d');
        $recordedBy = 1; // Will be overridden in seeder

        // Hash chain — seeder sets previous_hash correctly
        $hash = hash('sha256', ''.$type->value.$category->value.$amount.$transactionDate.$recordedBy);

        return [
            'type' => $type,
            'category' => $category,
            'amount' => $amount,
            'description' => $this->generateDescription($type, $category),
            'reference_type' => null,
            'reference_id' => null,
            'recorded_by' => $recordedBy,
            'transaction_date' => $transactionDate,
            'previous_hash' => null,
            'hash' => $hash,
            'created_at' => now(),
        ];
    }

    private function generateDescription(TransactionType $type, TransactionCategory $category): string
    {
        return match ($category) {
            TransactionCategory::AssetRental => 'Pendapatan sewa '.fake()->randomElement(['traktor tangan', 'gedung serbaguna', 'tenda hajatan', 'mobil pick-up', 'mesin penggiling padi']),
            TransactionCategory::Dues => 'Iuran wajib anggota bulan '.now()->format('F Y'),
            TransactionCategory::AssetProcurement => 'Pembelian '.fake()->randomElement(['alat semprot hama baru', 'mesin pemotong rumput', 'terpal cadangan', 'ban traktor']),
            TransactionCategory::Operational => 'Biaya '.fake()->randomElement(['perawatan traktor', 'bensin operasional', 'servis mesin giling', 'alat tulis kantor', 'listrik gudang']),
            TransactionCategory::Other => fake()->sentence(6),
        };
    }

    public function income(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => TransactionType::Income,
            'category' => TransactionCategory::AssetRental,
        ]);
    }

    public function expense(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => TransactionType::Expense,
            'category' => fake()->randomElement([TransactionCategory::Operational, TransactionCategory::AssetProcurement]),
        ]);
    }
}
