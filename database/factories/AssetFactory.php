<?php

namespace Database\Factories;

use App\Enums\AssetStatus;
use App\Models\Asset;
use App\Models\AssetCategory;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Asset>
 */
class AssetFactory extends Factory
{
    private static array $assetNames = [
        'Traktor Tangan',
        'Mesin Penggiling Padi',
        'Alat Semprot Hama',
        'Mesin Pemotong Rumput',
        'Gedung Serbaguna',
        'Tenda & Terpal Hajatan',
        'Kursi & Meja Lipat',
        'Mobil Pick-up Angkut',
    ];

    private static array $locations = [
        'Gudang Utama Desa',
        'Pelataran Koperasi',
        'Balai Desa',
        'Lahan Parkir Koperasi',
        'Gudang Timur Desa',
    ];

    public function definition(): array
    {
        $name = fake()->randomElement(self::$assetNames);

        return [
            'category_id' => AssetCategory::factory(),
            'name' => $name,
            'description' => 'Aset koperasi: '.$name.'. Tersedia untuk disewa oleh anggota koperasi dengan mengajukan reservasi terlebih dahulu.',
            'location' => fake()->randomElement(self::$locations),
            'hourly_rate' => fake()->randomElement([null, 15000, 20000, 25000, 30000, 50000]),
            'daily_rate' => fake()->randomElement([75000, 100000, 150000, 200000, 250000, 300000, 500000]),
            'status' => AssetStatus::Available,
            'created_by' => User::factory()->pengurus(),
        ];
    }

    public function maintenance(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => AssetStatus::Maintenance,
        ]);
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => AssetStatus::Inactive,
        ]);
    }
}
