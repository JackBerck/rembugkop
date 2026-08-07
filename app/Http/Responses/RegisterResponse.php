<?php

namespace App\Http\Responses;

use Illuminate\Http\RedirectResponse;
use Laravel\Fortify\Contracts\RegisterResponse as RegisterResponseContract;

class RegisterResponse implements RegisterResponseContract
{
    /**
     * Redirect new registrants to verification-pending page instead of dashboard.
     * All public registrations create anggota role with pending verification status.
     */
    public function toResponse($request): RedirectResponse
    {
        return redirect()->route('verification.pending')
            ->with('success', 'Akun berhasil dibuat! Silakan tunggu verifikasi NIK oleh pengurus koperasi.');
    }
}
