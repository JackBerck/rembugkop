<?php

namespace App\Policies;

use App\Enums\ProposalStatus;
use App\Enums\VerificationStatus;
use App\Models\Proposal;
use App\Models\User;

class ProposalPolicy
{
    /**
     * Anggota terverifikasi bisa vote pada proposal yang sedang open,
     * dan belum pernah vote proposal yang sama sebelumnya.
     */
    public function vote(User $user, Proposal $proposal): bool
    {
        return $user->isAnggota()
            && $user->memberProfile?->verification_status === VerificationStatus::Verified
            && $proposal->status === ProposalStatus::Open
            && ! $proposal->votes()->where('user_id', $user->id)->exists();
    }

    /**
     * Hanya pengurus/admin yang bisa mengajukan proposal baru.
     */
    public function propose(User $user): bool
    {
        return $user->isPengurus() || $user->isAdmin();
    }

    /**
     * Pengurus/admin bisa mengubah status proposal (approve/reject/execute).
     */
    public function updateStatus(User $user, Proposal $proposal): bool
    {
        return ($user->isPengurus() || $user->isAdmin())
            && $proposal->status !== ProposalStatus::Executed;
    }

    /**
     * Semua user terautentikasi bisa melihat proposal.
     */
    public function view(User $user, Proposal $proposal): bool
    {
        return true;
    }

    /**
     * Semua user terautentikasi bisa melihat daftar proposal.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }
}
