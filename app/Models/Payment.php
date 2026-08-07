<?php

namespace App\Models;

use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $reservation_id
 * @property string $amount
 * @property PaymentMethod $method
 * @property string|null $gateway_provider
 * @property string|null $gateway_transaction_id
 * @property string|null $gateway_status
 * @property PaymentStatus $status
 * @property int|null $recorded_by
 * @property Carbon|null $paid_at
 */
class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'reservation_id',
        'amount',
        'method',
        'gateway_provider',
        'gateway_transaction_id',
        'gateway_status',
        'status',
        'recorded_by',
        'paid_at',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'method' => PaymentMethod::class,
            'status' => PaymentStatus::class,
            'paid_at' => 'datetime',
        ];
    }

    public function reservation(): BelongsTo
    {
        return $this->belongsTo(AssetReservation::class, 'reservation_id');
    }

    public function recorder(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }

    /**
     * Polymorphic media (payment proof / bukti transfer).
     */
    public function media(): MorphMany
    {
        return $this->morphMany(Media::class, 'mediable');
    }

    public function proofOfPayment(): MorphMany
    {
        return $this->morphMany(Media::class, 'mediable')
            ->where('collection', 'bukti_transfer');
    }

    public function isPaid(): bool
    {
        return $this->status === PaymentStatus::Paid;
    }

    public function isManual(): bool
    {
        return $this->method === PaymentMethod::Manual;
    }
}
