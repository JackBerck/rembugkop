<?php

namespace Database\Seeders;

use App\Enums\AssetStatus;
use App\Models\Asset;
use App\Models\AssetCategory;
use App\Models\User;
use Illuminate\Database\Seeder;

class AssetSeeder extends Seeder
{
    /**
     * 8 fixed assets from docs §2. Idempotent via updateOrCreate.
     */
    public function run(): void
    {
        $creator = User::whereIn('role', ['super_admin', 'pengurus'])->first();

        $pertanian = AssetCategory::where('name', 'Alat Pertanian')->first();
        $acara = AssetCategory::where('name', 'Perlengkapan Acara')->first();
        $kendaraan = AssetCategory::where('name', 'Kendaraan')->first();
        $bangunan = AssetCategory::where('name', 'Bangunan/Gedung')->first();

        $assets = [
            [
                'name' => 'Traktor Tangan',
                'category_id' => $pertanian?->id,
                'description' => 'Traktor tangan milik koperasi untuk membantu pengolahan lahan sawah anggota. Kapasitas 1 unit, tersedia untuk disewa harian.',
                'location' => 'Gudang Utama Desa',
                'hourly_rate' => null,
                'daily_rate' => 150000,
                'status' => AssetStatus::Available,
                'image' => 'traktor-tangan.jpg',
            ],
            [
                'name' => 'Mesin Penggiling Padi',
                'category_id' => $pertanian?->id,
                'description' => 'Mesin penggiling padi berkapasitas besar untuk mengolah hasil panen anggota. Termasuk operator mesin.',
                'location' => 'Gudang Utama Desa',
                'hourly_rate' => null,
                'daily_rate' => 200000,
                'status' => AssetStatus::Available,
                'image' => 'mesin-giling-padi.jpg',
            ],
            [
                'name' => 'Alat Semprot Hama (Power Sprayer)',
                'category_id' => $pertanian?->id,
                'description' => 'Power sprayer bertenaga mesin untuk penyemprotan pestisida/herbisida di lahan pertanian. Kapasitas tangki 16 liter.',
                'location' => 'Gudang Utama Desa',
                'hourly_rate' => 15000,
                'daily_rate' => 75000,
                'status' => AssetStatus::Available,
                'image' => 'alat-semprot-hama.jpg',
            ],
            [
                'name' => 'Mesin Pemotong Rumput',
                'category_id' => $pertanian?->id,
                'description' => 'Mesin pemotong rumput gendong bertenaga bensin untuk perawatan lahan dan pematang sawah.',
                'location' => 'Pelataran Koperasi',
                'hourly_rate' => 10000,
                'daily_rate' => 60000,
                'status' => AssetStatus::Available,
                'image' => 'mesin-pemotong-rumput.jpg',
            ],
            [
                'name' => 'Gedung Serbaguna',
                'category_id' => $bangunan?->id,
                'description' => 'Gedung serbaguna koperasi berkapasitas ±200 orang, dilengkapi meja dan kursi, cocok untuk acara pernikahan, rapat, dan kegiatan desa.',
                'location' => 'Pelataran Koperasi',
                'hourly_rate' => null,
                'daily_rate' => 500000,
                'status' => AssetStatus::Available,
                'image' => 'gedung-serbaguna.jpg',
            ],
            [
                'name' => 'Tenda & Terpal Hajatan',
                'category_id' => $acara?->id,
                'description' => 'Set tenda hajatan ukuran 6x9 meter lengkap dengan terpal dan tiang. Cocok untuk acara pernikahan, selamatan, dan arisan.',
                'location' => 'Gudang Timur Desa',
                'hourly_rate' => null,
                'daily_rate' => 250000,
                'status' => AssetStatus::Available,
                'image' => 'tenda-hajatan.jpg',
            ],
            [
                'name' => 'Kursi & Meja Lipat (set 50 buah)',
                'category_id' => $acara?->id,
                'description' => 'Set 50 kursi plastik dan 10 meja lipat untuk kegiatan acara. Tersedia per set atau satuan sesuai kebutuhan.',
                'location' => 'Gudang Timur Desa',
                'hourly_rate' => null,
                'daily_rate' => 150000,
                'status' => AssetStatus::Available,
                'image' => 'kursi-meja-acara.jpg',
            ],
            [
                'name' => 'Mobil Pick-up Angkut',
                'category_id' => $kendaraan?->id,
                'description' => 'Mobil pick-up koperasi untuk mengangkut hasil panen, distribusi barang, dan kebutuhan logistik anggota. Termasuk sopir.',
                'location' => 'Pelataran Koperasi',
                'hourly_rate' => null,
                'daily_rate' => 300000,
                'status' => AssetStatus::Available,
                'image' => 'mobil-pickup.jpg',
            ],
        ];

        foreach ($assets as $assetData) {
            unset($assetData['image']); // image handled by MediaSeeder
            Asset::updateOrCreate(
                ['name' => $assetData['name']],
                array_merge($assetData, ['created_by' => $creator->id])
            );
        }
    }
}
