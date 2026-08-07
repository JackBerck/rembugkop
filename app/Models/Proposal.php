<?php

namespace App\Models;

use App\Enums\ProposalStatus;
use App\Enums\ProposalType;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $title
 * @property string $description
 * @property ProposalType $type
 * @property int|null $related_asset_id
 * @property int $proposed_by
 * @property ProposalStatus $status
 * @property Carbon|null $voting_start
 * @property Carbon|null $voting_end
 */
class Proposal extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'type',
        'related_asset_id',
        'proposed_by',
        'status',
        'voting_start',
        'voting_end',
    ];

    protected function casts(): array
    {
        return [
            'type' => ProposalType::class,
            'status' => ProposalStatus::class,
            'voting_start' => 'datetime',
            'voting_end' => 'datetime',
        ];
    }

    public function proposer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'proposed_by');
    }

    public function relatedAsset(): BelongsTo
    {
        return $this->belongsTo(Asset::class, 'related_asset_id');
    }

    public function votes(): HasMany
    {
        return $this->hasMany(Vote::class);
    }

    public function scopeOpen(Builder $query): Builder
    {
        return $query->where('status', ProposalStatus::Open);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', ProposalStatus::Open)
            ->where('voting_start', '<=', now())
            ->where('voting_end', '>=', now());
    }

    public function agreeCount(): int
    {
        return $this->votes()->where('choice', 'agree')->count();
    }

    public function disagreeCount(): int
    {
        return $this->votes()->where('choice', 'disagree')->count();
    }

    public function isVotingOpen(): bool
    {
        return $this->status === ProposalStatus::Open
            && $this->voting_start?->isPast()
            && $this->voting_end?->isFuture();
    }
}
