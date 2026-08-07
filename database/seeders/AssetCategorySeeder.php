<?php

namespace Database\Seeders;

use App\Models\AssetCategory;
use Illuminate\Database\Seeder;

class AssetCategorySeeder extends Seeder
{
    /**
     * Idempotent — safe to run multiple times.
     */
    public function run(): void
    {
        $categories = [
            'Alat Pertanian',
            'Perlengkapan Acara',
            'Kendaraan',
            'Bangunan/Gedung',
        ];

        foreach ($categories as $name) {
            AssetCategory::updateOrCreate(['name' => $name]);
        }
    }
}
