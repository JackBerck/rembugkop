<?php

namespace App\Http\Responses;

use App\Enums\UserRole;
use App\Enums\VerificationStatus;
use Illuminate\Http\RedirectResponse;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    /**
     * Dynamic redirect after login based on role & verification status.
     *
     * - super_admin / pengurus → /dashboard
     * - anggota (verified)    → /beranda
     * - anggota (pending)     → /verification-pending
     */
    public function toResponse($request): RedirectResponse
    {
        $user = $request->user();

        if ($user->role === UserRole::SuperAdmin || $user->role === UserRole::Pengurus) {
            return redirect()->intended(route('dashboard.home'));
        }

        // Anggota: check verification status
        $profile = $user->memberProfile;

        if (! $profile || $profile->verification_status !== VerificationStatus::Verified) {
            return redirect()->route('verification.pending');
        }

        return redirect()->intended(route('beranda'));
    }
}
