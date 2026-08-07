<?php

namespace App\Models;

use App\Enums\DurationType;
use App\Enums\ReservationStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $asset_id
 * @property int $user_id
 * @property Carbon $start_datetime
 * @property Carbon $end_datetime
 * @property DurationType $duration_type
 * @property string $calculated_price
 * @property ReservationStatus $status
 * @property int|null $approved_by
 * @property string|null $notes
 */
class AssetReservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'asset_id',
        'user_id',
        'start_datetime',
        'end_datetime',
        'duration_type',
        'calculated_price',
        'status',
        'approved_by',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'start_datetime' => 'datetime',
            'end_datetime' => 'datetime',
            'duration_type' => DurationType::class,
            'calculated_price' => 'decimal:2',
            'status' => ReservationStatus::class,
        ];
    }

    public function asset(): BelongsTo
    {
        return $this->belongsTo(Asset::class);
    }

    public function renter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class, 'reservation_id');
    }

    /**
     * Polymorphic media (payment proof uploads).
     */
    public function media(): MorphMany
    {
        return $this->morphMany(Media::class, 'mediable');
    }

    /**
     * Scope to find overlapping reservations for double-booking prevention.
     */
    public function scopeOverlapping(Builder $query, Carbon $start, Carbon $end): Builder
    {
        return $query
            ->where('start_datetime', '<', $end)
            ->where('end_datetime', '>', $start)
            ->whereIn('status', [
                ReservationStatus::Approved->value,
                ReservationStatus::Ongoing->value,
            ]);
    }

    public function isPending(): bool
    {
        return $this->status === ReservationStatus::Pending;
    }
}
