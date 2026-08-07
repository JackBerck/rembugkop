<?php

namespace App\Models;

use App\Enums\VoteChoice;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $proposal_id
 * @property int $user_id
 * @property VoteChoice $choice
 * @property Carbon $voted_at
 */
class Vote extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'proposal_id',
        'user_id',
        'choice',
        'voted_at',
    ];

    protected function casts(): array
    {
        return [
            'choice' => VoteChoice::class,
            'voted_at' => 'datetime',
        ];
    }

    public function proposal(): BelongsTo
    {
        return $this->belongsTo(Proposal::class);
    }

    public function voter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
