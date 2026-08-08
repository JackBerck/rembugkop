<?php

namespace App\Http\Controllers\Public;

use App\Actions\Reservation\CreateReservationAction;
use App\Enums\ReservationStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReservationRequest;
use App\Models\Asset;
use App\Models\AssetCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AssetCatalogController extends Controller
{
    /**
     * Public catalog — accessible by all authenticated users (verified or not).
     */
    public function index(Request $request): Response
    {
        $assets = Asset::with(['category', 'coverPhoto'])
            ->available()
            ->when($request->get('category'), fn ($q, $cat) => $q->where('category_id', $cat))
            ->when($request->get('search'), fn ($q, $s) => $q->where('name', 'like', "%{$s}%"))
            ->orderBy('name')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('public/asset-catalog', [
            'assets' => $assets,
            'categories' => AssetCategory::all(['id', 'name']),
            'filters' => $request->only(['category', 'search']),
        ]);
    }

    /**
     * Asset detail with gallery and booking calendar.
     * Booking form shows a disabled state with explanation if user is not verified.
     */
    public function show(Asset $asset): Response
    {
        $asset->load(['category', 'photos']);

        // Show approved/ongoing reservations for calendar unavailability display
        $blockedSlots = $asset->reservations()
            ->whereIn('status', [ReservationStatus::Approved->value, ReservationStatus::Ongoing->value])
            ->get(['id', 'start_datetime', 'end_datetime', 'status']);

        return Inertia::render('public/asset-detail', [
            'asset' => $asset,
            'blockedSlots' => $blockedSlots,
        ]);
    }

    /**
     * Create reservation — requires verified anggota (enforced by policy in FormRequest).
     */
    public function store(StoreReservationRequest $request, CreateReservationAction $action): RedirectResponse
    {
        $reservation = $action->execute($request->validated(), $request->user());

        return redirect()
            ->route('my-reservations')
            ->with('success', 'Reservasi aset berhasil diajukan. Tunggu persetujuan pengurus.');
    }
}
