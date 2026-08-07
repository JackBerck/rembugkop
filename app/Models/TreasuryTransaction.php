<?php

namespace App\Models;

use App\Enums\TransactionCategory;
use App\Enums\TransactionType;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property TransactionType $type
 * @property TransactionCategory $category
 * @property string $amount
 * @property string $description
 * @property string|null $reference_type
 * @property int|null $reference_id
 * @property int $recorded_by
 * @property Carbon $transaction_date
 * @property string|null $previous_hash
 * @property string $hash
 * @property Carbon $created_at
 */
class TreasuryTransaction extends Model
{
    use HasFactory;

    /**
     * Immutable audit trail — no updates allowed.
     * Only created_at, no updated_at.
     */
    public $timestamps = false;

    protected $fillable = [
        'type',
        'category',
        'amount',
        'description',
        'reference_type',
        'reference_id',
        'recorded_by',
        'transaction_date',
        'previous_hash',
        'hash',
        'created_at',
    ];

    protected function casts(): array
    {
        return [
            'type' => TransactionType::class,
            'category' => TransactionCategory::class,
            'amount' => 'decimal:2',
            'transaction_date' => 'date',
            'created_at' => 'datetime',
        ];
    }

    public function recorder(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }

    /**
     * Polymorphic reference to Payment or Proposal that triggered this transaction.
     */
    public function reference(): MorphTo
    {
        return $this->morphTo('reference');
    }

    public function scopeIncome(Builder $query): Builder
    {
        return $query->where('type', TransactionType::Income);
    }

    public function scopeExpense(Builder $query): Builder
    {
        return $query->where('type', TransactionType::Expense);
    }

    public function scopeForPeriod(Builder $query, Carbon $from, Carbon $to): Builder
    {
        return $query->whereBetween('transaction_date', [$from->toDateString(), $to->toDateString()]);
    }
}
