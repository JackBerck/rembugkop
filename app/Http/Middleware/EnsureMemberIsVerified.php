<?php

namespace App\Http\Middleware;

use App\Enums\VerificationStatus;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureMemberIsVerified
{
    /**
     * Block anggota with pending/rejected verification from transactional routes.
     * Redirects to verification.pending with a flash warning.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        $profile = $user?->memberProfile;

        if (! $profile || $profile->verification_status !== VerificationStatus::Verified) {
            return redirect()->route('verification.pending')
                ->with('warning', 'Akun Anda masih menunggu verifikasi NIK oleh pengurus sebelum dapat melakukan aksi ini.');
        }

        return $next($request);
    }
}
