<?php

namespace App\Actions\Asset;

use App\Models\Asset;
use App\Models\Media;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class StoreAssetWithPhotosAction
{
    /**
     * Create an asset and persist all photos atomically.
     *
     * @param  array<string, mixed>  $assetData
     * @param  UploadedFile[]  $photos
     */
    public function execute(array $assetData, array $photos, User $creator): Asset
    {
        return DB::transaction(function () use ($assetData, $photos, $creator): Asset {
            $asset = Asset::create([...$assetData, 'created_by' => $creator->id]);

            foreach ($photos as $index => $photo) {
                $path = $photo->store('assets/'.$asset->id, 'public');

                Media::create([
                    'mediable_type' => Asset::class,
                    'mediable_id' => $asset->id,
                    'collection' => 'photos',
                    'path' => $path,
                    'is_primary' => $index === 0,
                    'order_number' => $index,
                    'uploaded_by' => $creator->id,
                    'created_at' => now(),
                ]);
            }

            return $asset;
        });
    }
}
