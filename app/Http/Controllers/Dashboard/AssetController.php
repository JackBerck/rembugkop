<?php

namespace App\Http\Controllers\Dashboard;

use App\Actions\Asset\StoreAssetWithPhotosAction;
use App\Actions\Asset\UpdateAssetWithPhotosAction;
use App\Enums\AssetStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAssetRequest;
use App\Http\Requests\UpdateAssetRequest;
use App\Models\Asset;
use App\Models\AssetCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AssetController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Asset::class);

        $assets = Asset::with(['category', 'coverPhoto'])
            ->when($request->get('status'), fn ($q, $status) => $q->where('status', $status))
            ->when($request->get('category'), fn ($q, $cat) => $q->where('category_id', $cat))
            ->when($request->get('search'), fn ($q, $s) => $q->where('name', 'like', "%{$s}%"))
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('dashboard/assets/index', [
            'assets' => $assets,
            'categories' => AssetCategory::all(['id', 'name']),
            'statuses' => AssetStatus::cases(),
            'filters' => $request->only(['status', 'category', 'search']),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Asset::class);

        return Inertia::render('dashboard/assets/create', [
            'categories' => AssetCategory::all(['id', 'name']),
            'statuses' => AssetStatus::cases(),
        ]);
    }

    public function store(StoreAssetRequest $request, StoreAssetWithPhotosAction $action): RedirectResponse
    {
        $data = $request->safe()->except(['photos']);
        $photos = $request->file('photos', []);

        $asset = $action->execute($data, $photos, $request->user());

        return redirect()
            ->route('dashboard.assets.index')
            ->with('success', "Aset \"{$asset->name}\" berhasil ditambahkan.");
    }

    public function show(Asset $asset): Response
    {
        $this->authorize('view', $asset);

        $asset->load(['category', 'photos', 'creator']);

        return Inertia::render('dashboard/assets/show', [
            'asset' => $asset,
        ]);
    }

    public function edit(Asset $asset): Response
    {
        $this->authorize('update', $asset);

        $asset->load(['category', 'photos']);

        return Inertia::render('dashboard/assets/edit', [
            'asset' => $asset,
            'categories' => AssetCategory::all(['id', 'name']),
            'statuses' => AssetStatus::cases(),
        ]);
    }

    public function update(UpdateAssetRequest $request, Asset $asset, UpdateAssetWithPhotosAction $action): RedirectResponse
    {
        $data = $request->safe()->except(['photos', 'replace_photos']);
        $photos = $request->file('photos', []);
        $replacePhotos = (bool) $request->boolean('replace_photos');

        $action->execute($asset, $data, $photos, $replacePhotos);

        return redirect()
            ->route('dashboard.assets.index')
            ->with('success', "Aset \"{$asset->name}\" berhasil diperbarui.");
    }

    public function destroy(Asset $asset): RedirectResponse
    {
        $this->authorize('delete', $asset);

        // Delete associated media files from disk
        foreach ($asset->photos as $media) {
            Storage::disk('public')->delete($media->path);
        }
        $asset->photos()->delete();
        $asset->delete();

        return redirect()
            ->route('dashboard.assets.index')
            ->with('success', "Aset \"{$asset->name}\" berhasil dihapus.");
    }
}
