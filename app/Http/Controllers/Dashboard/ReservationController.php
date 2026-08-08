<?php

namespace App\Http\Controllers\Dashboard;

use App\Actions\Reservation\ApproveReservationAction;
use App\Actions\Reservation\RejectReservationAction;
use App\Enums\ReservationStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\RejectReservationRequest;
use App\Models\AssetReservation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReservationController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', AssetReservation::class);

        $reservations = AssetReservation::with(['asset.coverPhoto', 'renter'])
            ->when(
                $request->get('status'),
                fn ($q, $status) => $q->where('status', $status)
            )
            ->when(
                $request->get('asset_id'),
                fn ($q, $assetId) => $q->where('asset_id', $assetId)
            )
            ->latest()
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('dashboard/reservations/index', [
            'reservations' => $reservations,
            'statuses' => ReservationStatus::cases(),
            'filters' => $request->only(['status', 'asset_id']),
        ]);
    }

    public function show(AssetReservation $reservation): Response
    {
        $this->authorize('view', $reservation);

        $reservation->load(['asset.photos', 'renter', 'approver', 'payments']);

        return Inertia::render('dashboard/reservations/show', [
            'reservation' => $reservation,
        ]);
    }

    public function approve(AssetReservation $reservation, ApproveReservationAction $action): RedirectResponse
    {
        $this->authorize('approve', $reservation);

        $action->execute($reservation, request()->user());

        return back()->with('success', 'Reservasi berhasil disetujui.');
    }

    public function reject(RejectReservationRequest $request, AssetReservation $reservation, RejectReservationAction $action): RedirectResponse
    {
        $action->execute($reservation, $request->user(), $request->validated('reason'));

        return back()->with('success', 'Reservasi berhasil ditolak.');
    }
}
