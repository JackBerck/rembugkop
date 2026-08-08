<?php

namespace App\Http\Controllers\Public;

use App\Enums\ReservationStatus;
use App\Http\Controllers\Controller;
use App\Models\AssetReservation;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class MyReservationController extends Controller
{
    /**
     * Show authenticated user's own reservations only — never all reservations.
     */
    public function index(): Response
    {
        $reservations = AssetReservation::with(['asset.coverPhoto'])
            ->where('user_id', auth()->id()) // Scoped to current user — not filtered in frontend
            ->latest()
            ->paginate(15);

        return Inertia::render('public/my-reservations', [
            'reservations' => $reservations,
            'statuses' => ReservationStatus::cases(),
        ]);
    }

    /**
     * Cancel a pending reservation (policy enforced: only owner can cancel, only if pending).
     */
    public function cancel(AssetReservation $reservation): RedirectResponse
    {
        $this->authorize('cancel', $reservation);

        $reservation->update(['status' => ReservationStatus::Cancelled]);

        return back()->with('success', 'Reservasi berhasil dibatalkan.');
    }
}
