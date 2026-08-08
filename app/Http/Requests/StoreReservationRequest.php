<?php

namespace App\Http\Requests;

use App\Models\AssetReservation;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Carbon;
use Illuminate\Validation\Validator;

class StoreReservationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', AssetReservation::class);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'asset_id' => ['required', 'integer', 'exists:assets,id'],
            'start_datetime' => ['required', 'date', 'after:now'],
            'end_datetime' => ['required', 'date', 'after:start_datetime'],
            'duration_type' => ['required', 'string', 'in:hourly,daily'],
            'notes' => ['nullable', 'string', 'max:500'],
        ];
    }

    /**
     * First-pass overlap check for fast UX feedback (before hitting the DB transaction).
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            if ($validator->errors()->isNotEmpty()) {
                return; // Don't run if basic rules already failed
            }

            $overlap = AssetReservation::query()
                ->where('asset_id', $this->asset_id)
                ->overlapping(
                    Carbon::parse($this->start_datetime),
                    Carbon::parse($this->end_datetime)
                )
                ->exists();

            if ($overlap) {
                $validator->errors()->add(
                    'start_datetime',
                    'Aset sudah dibooking di rentang waktu tersebut. Silakan pilih jadwal lain.'
                );
            }
        });
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'start_datetime.after' => 'Waktu mulai harus di masa depan.',
            'end_datetime.after' => 'Waktu selesai harus setelah waktu mulai.',
        ];
    }
}
