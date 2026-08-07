<?php

namespace Database\Seeders;

use App\Enums\ProposalStatus;
use App\Enums\ProposalType;
use App\Models\Asset;
use App\Models\Proposal;
use App\Models\User;
use Illuminate\Database\Seeder;

class ProposalSeeder extends Seeder
{
    public function run(): void
    {
        $pengurusList = User::where('role', 'pengurus')->get();
        $assets = Asset::all();

        // Fixed realistic proposals from docs §3
        $fixedProposals = [
            [
                'title' => 'Pengadaan Mesin Penggiling Padi Baru',
                'description' => 'Mesin penggiling padi koperasi saat ini sudah sering mengalami kerusakan dan membutuhkan perbaikan berulang yang menelan biaya cukup besar. Diusulkan pengadaan unit baru untuk meningkatkan layanan kepada anggota pada musim panen.',
                'type' => ProposalType::AssetProcurement,
                'status' => ProposalStatus::Approved,
                'voting_start' => now()->subDays(30)->format('Y-m-d H:i:s'),
                'voting_end' => now()->subDays(16)->format('Y-m-d H:i:s'),
                'related_asset_id' => $assets->where('name', 'Mesin Penggiling Padi')->first()?->id,
            ],
            [
                'title' => 'Perbaikan Atap Gedung Serbaguna',
                'description' => 'Atap gedung serbaguna koperasi mengalami kebocoran parah saat musim hujan, sehingga mengganggu kegiatan rapat anggota dan acara desa lainnya. Diperlukan perbaikan segera untuk mencegah kerusakan yang lebih parah.',
                'type' => ProposalType::Other,
                'status' => ProposalStatus::Executed,
                'voting_start' => now()->subDays(60)->format('Y-m-d H:i:s'),
                'voting_end' => now()->subDays(46)->format('Y-m-d H:i:s'),
                'related_asset_id' => $assets->where('name', 'Gedung Serbaguna')->first()?->id,
            ],
            [
                'title' => 'Penyesuaian Tarif Sewa Tenda Hajatan',
                'description' => 'Harga terpal dan bahan tenda mengalami kenaikan signifikan. Diusulkan penyesuaian tarif sewa tenda dari Rp250.000 menjadi Rp300.000 per hari agar pengelolaan aset tetap berkelanjutan.',
                'type' => ProposalType::Policy,
                'status' => ProposalStatus::Open,
                'voting_start' => now()->subDays(3)->format('Y-m-d H:i:s'),
                'voting_end' => now()->addDays(11)->format('Y-m-d H:i:s'),
                'related_asset_id' => $assets->where('name', 'Tenda & Terpal Hajatan')->first()?->id,
            ],
            [
                'title' => 'Pembelian Mobil Pick-up untuk Distribusi Hasil Panen',
                'description' => 'Selama ini anggota koperasi kesulitan mendistribusikan hasil panen ke pasar karena keterbatasan armada. Pengadaan mobil pick-up diharapkan dapat memperlancar rantai distribusi dan meningkatkan pendapatan anggota.',
                'type' => ProposalType::AssetProcurement,
                'status' => ProposalStatus::Rejected,
                'voting_start' => now()->subDays(45)->format('Y-m-d H:i:s'),
                'voting_end' => now()->subDays(31)->format('Y-m-d H:i:s'),
                'related_asset_id' => null,
            ],
            [
                'title' => 'Penambahan Jam Operasional Penyewaan Aset',
                'description' => 'Beberapa anggota membutuhkan akses alat pertanian di luar jam operasional saat ini (07.00-17.00). Diusulkan perpanjangan jam operasional hingga pukul 19.00 pada hari kerja.',
                'type' => ProposalType::Policy,
                'status' => ProposalStatus::Draft,
                'voting_start' => null,
                'voting_end' => null,
                'related_asset_id' => null,
            ],
            [
                'title' => 'Pengadaan Alat Semprot Hama Tambahan',
                'description' => 'Satu unit alat semprot hama sering antri karena jumlah anggota yang membutuhkan sangat tinggi di musim tanam. Diusulkan pengadaan 2 unit tambahan untuk mengurangi antrean.',
                'type' => ProposalType::AssetProcurement,
                'status' => ProposalStatus::Open,
                'voting_start' => now()->subDays(5)->format('Y-m-d H:i:s'),
                'voting_end' => now()->addDays(9)->format('Y-m-d H:i:s'),
                'related_asset_id' => $assets->where('name', 'Alat Semprot Hama (Power Sprayer)')->first()?->id,
            ],
        ];

        foreach ($fixedProposals as $data) {
            Proposal::create(array_merge($data, [
                'proposed_by' => $pengurusList->random()->id,
            ]));
        }
    }
}
