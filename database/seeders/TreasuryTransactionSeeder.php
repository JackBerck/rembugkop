<?php

namespace Database\Seeders;

use App\Enums\PaymentStatus;
use App\Enums\TransactionCategory;
use App\Enums\TransactionType;
use App\Models\Payment;
use App\Models\TreasuryTransaction;
use App\Models\User;
use Illuminate\Database\Seeder;

class TreasuryTransactionSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('role', 'super_admin')->first()
            ?? User::where('role', 'pengurus')->first();

        $previousHash = null;

        // 1. Income from paid payments (morph reference to Payment)
        $paidPayments = Payment::where('status', PaymentStatus::Paid)->with('reservation.asset')->get();

        foreach ($paidPayments as $payment) {
            $previousHash = $this->createTransaction(
                type: TransactionType::Income,
                category: TransactionCategory::AssetRental,
                amount: (float) $payment->amount,
                description: 'Pendapatan sewa '.($payment->reservation->asset->name ?? 'aset koperasi'),
                referenceType: 'App\\Models\\Payment',
                referenceId: $payment->id,
                recordedBy: $admin->id,
                transactionDate: $payment->paid_at?->toDateString() ?? now()->toDateString(),
                previousHash: $previousHash,
            );
        }

        // 2. Income: dues (iuran anggota)
        $duesData = [
            ['description' => 'Iuran wajib anggota bulan Januari', 'amount' => 1500000],
            ['description' => 'Iuran wajib anggota bulan Februari', 'amount' => 1500000],
            ['description' => 'Iuran wajib anggota bulan Maret', 'amount' => 1425000],
            ['description' => 'Iuran pokok anggota baru (5 anggota)', 'amount' => 500000],
        ];

        foreach ($duesData as $dues) {
            $previousHash = $this->createTransaction(
                type: TransactionType::Income,
                category: TransactionCategory::Dues,
                amount: $dues['amount'],
                description: $dues['description'],
                referenceType: null,
                referenceId: null,
                recordedBy: $admin->id,
                transactionDate: fake()->dateTimeBetween('-4 months', '-1 month')->format('Y-m-d'),
                previousHash: $previousHash,
            );
        }

        // 3. Expenses: operational & procurement
        $expenses = [
            ['category' => TransactionCategory::Operational, 'description' => 'Biaya perawatan traktor tangan', 'amount' => 350000],
            ['category' => TransactionCategory::Operational, 'description' => 'Bensin operasional mobil pick-up', 'amount' => 200000],
            ['category' => TransactionCategory::Operational, 'description' => 'Servis mesin penggiling padi', 'amount' => 500000],
            ['category' => TransactionCategory::Operational, 'description' => 'Alat tulis kantor koperasi', 'amount' => 85000],
            ['category' => TransactionCategory::Operational, 'description' => 'Biaya listrik gudang dan kantor', 'amount' => 275000],
            ['category' => TransactionCategory::AssetProcurement, 'description' => 'Beli terpal pengganti yang rusak', 'amount' => 450000],
            ['category' => TransactionCategory::AssetProcurement, 'description' => 'Ban baru untuk traktor tangan', 'amount' => 320000],
            ['category' => TransactionCategory::Operational, 'description' => 'Biaya rapat anggota tahunan (RAT)', 'amount' => 1200000],
        ];

        foreach ($expenses as $expense) {
            $previousHash = $this->createTransaction(
                type: TransactionType::Expense,
                category: $expense['category'],
                amount: $expense['amount'],
                description: $expense['description'],
                referenceType: null,
                referenceId: null,
                recordedBy: $admin->id,
                transactionDate: fake()->dateTimeBetween('-5 months', '-1 week')->format('Y-m-d'),
                previousHash: $previousHash,
            );
        }
    }

    /**
     * Create a treasury transaction and return the hash for chain continuity.
     */
    private function createTransaction(
        TransactionType $type,
        TransactionCategory $category,
        float $amount,
        string $description,
        ?string $referenceType,
        ?int $referenceId,
        int $recordedBy,
        string $transactionDate,
        ?string $previousHash,
    ): string {
        $hash = hash('sha256', ($previousHash ?? '').$type->value.$category->value.$amount.$transactionDate.$recordedBy);

        TreasuryTransaction::create([
            'type' => $type,
            'category' => $category,
            'amount' => $amount,
            'description' => $description,
            'reference_type' => $referenceType,
            'reference_id' => $referenceId,
            'recorded_by' => $recordedBy,
            'transaction_date' => $transactionDate,
            'previous_hash' => $previousHash,
            'hash' => $hash,
            'created_at' => now(),
        ]);

        return $hash;
    }
}
