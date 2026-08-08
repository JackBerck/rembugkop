<?php

namespace App\Http\Requests;

use App\Models\Asset;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreAssetRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', Asset::class);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'category_id' => ['required', 'integer', 'exists:asset_categories,id'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:2000'],
            'location' => ['required', 'string', 'max:255'],
            'hourly_rate' => ['nullable', 'numeric', 'min:0'],
            'daily_rate' => ['nullable', 'numeric', 'min:0'],
            'status' => ['required', 'string', 'in:available,maintenance,inactive'],
            'photos' => ['required', 'array', 'min:1', 'max:5'],
            'photos.*' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ];
    }

    /**
     * Minimal salah satu tarif wajib diisi.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            if (empty($this->hourly_rate) && empty($this->daily_rate)) {
                $validator->errors()->add('hourly_rate', 'Minimal salah satu tarif (per jam atau per hari) harus diisi.');
            }
        });
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'photos.required' => 'Minimal 1 foto aset wajib diunggah.',
            'photos.min' => 'Minimal 1 foto aset wajib diunggah.',
            'photos.max' => 'Maksimal 5 foto per aset.',
            'photos.*.image' => 'Setiap file harus berupa gambar.',
            'photos.*.mimes' => 'Format foto harus JPG, JPEG, PNG, atau WebP.',
            'photos.*.max' => 'Ukuran setiap foto maksimal 2MB.',
        ];
    }
}
