<?php

namespace Database\Factories;

use App\Models\Media;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Media>
 */
class MediaFactory extends Factory
{
    public function definition(): array
    {
        return [
            'mediable_type' => 'App\\Models\\Asset',
            'mediable_id' => 1,
            'collection' => 'photos',
            'path' => 'seeders/assets/placeholder.jpg',
            'is_primary' => false,
            'order_number' => 0,
            'caption' => null,
            'uploaded_by' => null,
            'created_at' => now(),
        ];
    }
}
