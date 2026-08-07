<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * Dependency order:
     *   1. AssetCategorySeeder   — no dependencies
     *   2. UserSeeder            — no dependencies (creates users + member_profiles)
     *   3. AssetSeeder           — needs asset_categories + users
     *   4. ProposalSeeder        — needs users + assets
     *   5. VoteSeeder            — needs proposals + users
     *   6. AssetReservationSeeder — needs assets + users
     *   7. PaymentSeeder         — needs asset_reservations
     *   8. TreasuryTransactionSeeder — needs payments
     *   9. MediaSeeder           — needs assets (file-safe, skips missing)
     */
    public function run(): void
    {
        $this->call([
            AssetCategorySeeder::class,
            UserSeeder::class,
            AssetSeeder::class,
            ProposalSeeder::class,
            VoteSeeder::class,
            AssetReservationSeeder::class,
            PaymentSeeder::class,
            TreasuryTransactionSeeder::class,
            MediaSeeder::class,
        ]);
    }
}
