<?php

namespace Database\Seeders;

use App\Models\Asset;
use App\Models\Media;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class MediaSeeder extends Seeder
{
    /**
     * Asset name → image filename mapping (from docs §2).
     *
     * @var array<string, string>
     */
    private array $assetImages = [
        'Traktor Tangan' => 'traktor-tangan.jpg',
        'Mesin Penggiling Padi' => 'mesin-giling-padi.jpg',
        'Alat Semprot Hama (Power Sprayer)' => 'alat-semprot-hama.jpg',
        'Mesin Pemotong Rumput' => 'mesin-pemotong-rumput.jpg',
        'Gedung Serbaguna' => 'gedung-serbaguna.jpg',
        'Tenda & Terpal Hajatan' => 'tenda-hajatan.jpg',
        'Kursi & Meja Lipat (set 50 buah)' => 'kursi-meja-acara.jpg',
        'Mobil Pick-up Angkut' => 'mobil-pickup.jpg',
    ];

    public function run(): void
    {
        $uploader = User::where('role', 'super_admin')->first()
            ?? User::where('role', 'pengurus')->first();

        $assets = Asset::whereIn('name', array_keys($this->assetImages))->get();

        foreach ($assets as $asset) {
            $filename = $this->assetImages[$asset->name] ?? null;

            if (! $filename) {
                continue;
            }

            $storagePath = "seeders/assets/{$filename}";

            // Check if physical file exists — skip if not (per docs §4)
            if (! Storage::disk('public')->exists($storagePath)) {
                Log::warning("MediaSeeder: file belum tersedia, skip. Path: public/{$storagePath}");

                continue;
            }

            // Skip if already seeded
            $exists = Media::where('mediable_type', 'App\\Models\\Asset')
                ->where('mediable_id', $asset->id)
                ->where('collection', 'photos')
                ->where('is_primary', true)
                ->exists();

            if ($exists) {
                continue;
            }

            Media::create([
                'mediable_type' => 'App\\Models\\Asset',
                'mediable_id' => $asset->id,
                'collection' => 'photos',
                'path' => $storagePath,
                'is_primary' => true,
                'order_number' => 0,
                'caption' => $asset->name,
                'uploaded_by' => $uploader?->id,
                'created_at' => now(),
            ]);
        }

        // KTP and bukti_transfer are NOT generated here (per docs §4)
    }
}
