<?php

namespace App\Actions\Asset;

use App\Models\Asset;
use App\Models\Media;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class UpdateAssetWithPhotosAction
{
    /**
     * Update asset data and optionally replace photos.
     * New photos append after existing ones (or replace if replace_photos=true).
     *
     * @param  array<string, mixed>  $assetData
     * @param  UploadedFile[]  $newPhotos
     */
    public function execute(Asset $asset, array $assetData, array $newPhotos = [], bool $replacePhotos = false): Asset
    {
        return DB::transaction(function () use ($asset, $assetData, $newPhotos, $replacePhotos): Asset {
            $asset->update($assetData);

            if ($replacePhotos) {
                // Delete old media records and files
                foreach ($asset->photos as $media) {
                    Storage::disk('public')->delete($media->path);
                }
                $asset->photos()->delete();
            }

            $existingCount = $asset->photos()->count();

            foreach ($newPhotos as $index => $photo) {
                $path = $photo->store('assets/'.$asset->id, 'public');
                $orderNumber = $existingCount + $index;

                Media::create([
                    'mediable_type' => Asset::class,
                    'mediable_id' => $asset->id,
                    'collection' => 'photos',
                    'path' => $path,
                    'is_primary' => $orderNumber === 0,
                    'order_number' => $orderNumber,
                    'uploaded_by' => auth()->id(),
                    'created_at' => now(),
                ]);
            }

            // Ensure at least one photo is marked as primary
            if ($asset->photos()->where('is_primary', true)->doesntExist()) {
                $asset->photos()->oldest('order_number')->first()?->update(['is_primary' => true]);
            }

            return $asset->fresh();
        });
    }
}
