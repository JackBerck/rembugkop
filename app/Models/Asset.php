<?php

namespace App\Models;

use App\Enums\AssetStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

/**
 * @property int $id
 * @property int|null $category_id
 * @property string $name
 * @property string $description
 * @property string $location
 * @property string|null $hourly_rate
 * @property string|null $daily_rate
 * @property AssetStatus $status
 * @property int $created_by
 */
class Asset extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'name',
        'description',
        'location',
        'hourly_rate',
        'daily_rate',
        'status',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'hourly_rate' => 'decimal:2',
            'daily_rate' => 'decimal:2',
            'status' => AssetStatus::class,
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(AssetCategory::class, 'category_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function reservations(): HasMany
    {
        return $this->hasMany(AssetReservation::class);
    }

    public function proposals(): HasMany
    {
        return $this->hasMany(Proposal::class, 'related_asset_id');
    }

    /**
     * Polymorphic media (photos gallery).
     */
    public function media(): MorphMany
    {
        return $this->morphMany(Media::class, 'mediable');
    }

    public function photos(): MorphMany
    {
        return $this->morphMany(Media::class, 'mediable')
            ->where('collection', 'photos')
            ->orderBy('order_number');
    }

    public function coverPhoto(): MorphMany
    {
        return $this->morphMany(Media::class, 'mediable')
            ->where('collection', 'photos')
            ->where('is_primary', true);
    }

    public function isAvailable(): bool
    {
        return $this->status === AssetStatus::Available;
    }

    public function scopeAvailable(Builder $query): Builder
    {
        return $query->where('status', AssetStatus::Available);
    }
}
