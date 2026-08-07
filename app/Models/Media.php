<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $mediable_type
 * @property int $mediable_id
 * @property string $collection
 * @property string $path
 * @property bool $is_primary
 * @property int $order_number
 * @property string|null $caption
 * @property int|null $uploaded_by
 * @property Carbon $created_at
 */
class Media extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $dateFormat = 'Y-m-d H:i:s';

    protected $fillable = [
        'mediable_type',
        'mediable_id',
        'collection',
        'path',
        'is_primary',
        'order_number',
        'caption',
        'uploaded_by',
        'created_at',
    ];

    protected function casts(): array
    {
        return [
            'is_primary' => 'boolean',
            'order_number' => 'integer',
            'created_at' => 'datetime',
        ];
    }

    /**
     * Polymorphic relationship — belongs to Asset, MemberProfile, or Payment.
     */
    public function mediable(): MorphTo
    {
        return $this->morphTo();
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
