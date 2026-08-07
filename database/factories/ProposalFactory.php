<?php

namespace Database\Factories;

use App\Enums\ProposalStatus;
use App\Enums\ProposalType;
use App\Models\Proposal;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Proposal>
 */
class ProposalFactory extends Factory
{
    private static array $proposals = [
        [
            'title' => 'Pengadaan Mesin Penggiling Padi Baru',
            'description' => 'Mesin penggiling padi koperasi saat ini sudah sering mengalami kerusakan dan membutuhkan perbaikan berulang yang menelan biaya cukup besar. Diusulkan pengadaan unit baru untuk meningkatkan layanan kepada anggota pada musim panen.',
            'type' => ProposalType::AssetProcurement,
        ],
        [
            'title' => 'Perbaikan Atap Gedung Serbaguna',
            'description' => 'Atap gedung serbaguna koperasi mengalami kebocoran parah saat musim hujan, sehingga mengganggu kegiatan rapat anggota dan acara desa lainnya. Diperlukan perbaikan segera untuk mencegah kerusakan yang lebih parah.',
            'type' => ProposalType::Other,
        ],
        [
            'title' => 'Penyesuaian Tarif Sewa Tenda Hajatan',
            'description' => 'Harga terpal dan bahan tenda mengalami kenaikan signifikan. Diusulkan penyesuaian tarif sewa tenda dari Rp250.000 menjadi Rp300.000 per hari agar pengelolaan aset tetap berkelanjutan.',
            'type' => ProposalType::Policy,
        ],
        [
            'title' => 'Pembelian Mobil Pick-up untuk Distribusi Hasil Panen',
            'description' => 'Selama ini anggota koperasi kesulitan mendistribusikan hasil panen ke pasar karena keterbatasan armada. Pengadaan mobil pick-up diharapkan dapat memperlancar rantai distribusi dan meningkatkan pendapatan anggota.',
            'type' => ProposalType::AssetProcurement,
        ],
        [
            'title' => 'Penambahan Jam Operasional Penyewaan Aset',
            'description' => 'Beberapa anggota membutuhkan akses alat pertanian di luar jam operasional saat ini (07.00-17.00). Diusulkan perpanjangan jam operasional hingga pukul 19.00 pada hari kerja.',
            'type' => ProposalType::Policy,
        ],
        [
            'title' => 'Pengadaan Alat Semprot Hama Tambahan',
            'description' => 'Satu unit alat semprot hama sering antri karena jumlah anggota yang membutuhkan sangat tinggi di musim tanam. Diusulkan pengadaan 2 unit tambahan untuk mengurangi antrean.',
            'type' => ProposalType::AssetProcurement,
        ],
    ];

    public function definition(): array
    {
        $data = fake()->randomElement(self::$proposals);
        $status = fake()->randomElement(ProposalStatus::cases());

        $votingStart = null;
        $votingEnd = null;

        if (in_array($status, [ProposalStatus::Open, ProposalStatus::Approved, ProposalStatus::Rejected, ProposalStatus::Executed])) {
            $votingStart = fake()->dateTimeBetween('-2 months', '-1 week');
            $votingEnd = (clone $votingStart)->modify('+14 days');
        }

        if ($status === ProposalStatus::Open) {
            $votingStart = fake()->dateTimeBetween('-1 week', 'now');
            $votingEnd = (clone $votingStart)->modify('+14 days');
        }

        return [
            'title' => $data['title'],
            'description' => $data['description'],
            'type' => $data['type'],
            'related_asset_id' => null,
            'proposed_by' => User::factory()->pengurus(),
            'status' => $status,
            'voting_start' => $votingStart?->format('Y-m-d H:i:s'),
            'voting_end' => $votingEnd?->format('Y-m-d H:i:s'),
        ];
    }

    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => ProposalStatus::Draft,
            'voting_start' => null,
            'voting_end' => null,
        ]);
    }

    public function open(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => ProposalStatus::Open,
            'voting_start' => now()->subDays(3)->format('Y-m-d H:i:s'),
            'voting_end' => now()->addDays(11)->format('Y-m-d H:i:s'),
        ]);
    }

    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => ProposalStatus::Approved,
            'voting_start' => now()->subDays(20)->format('Y-m-d H:i:s'),
            'voting_end' => now()->subDays(6)->format('Y-m-d H:i:s'),
        ]);
    }

    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => ProposalStatus::Rejected,
            'voting_start' => now()->subDays(30)->format('Y-m-d H:i:s'),
            'voting_end' => now()->subDays(16)->format('Y-m-d H:i:s'),
        ]);
    }
}
