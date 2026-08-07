<?php

namespace App\Models;

use App\Enums\VerificationStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $user_id
 * @property string $member_number
 * @property string $national_id
 * @property string $address
 * @property Carbon $joined_at
 * @property string $principal_savings
 * @property string $mandatory_savings_total
 * @property VerificationStatus $verification_status
 * @property int|null $verified_by
 * @property Carbon|null $verified_at
 */
class MemberProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'member_number',
        'national_id',
        'address',
        'joined_at',
        'principal_savings',
        'mandatory_savings_total',
        'verification_status',
        'verified_by',
        'verified_at',
    ];

    protected function casts(): array
    {
        return [
            'joined_at' => 'date',
            'principal_savings' => 'decimal:2',
            'mandatory_savings_total' => 'decimal:2',
            'verification_status' => VerificationStatus::class,
            'verified_at' => 'datetime',
            'national_id' => 'encrypted', // NIK encrypted at rest
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    /**
     * Polymorphic media — KTP document upload (single).
     */
    public function media(): MorphMany
    {
        return $this->morphMany(Media::class, 'mediable');
    }

    public function ktpDocument(): MorphMany
    {
        return $this->morphMany(Media::class, 'mediable')
            ->where('collection', 'ktp');
    }

    public function isVerified(): bool
    {
        return $this->verification_status === VerificationStatus::Verified;
    }
}
