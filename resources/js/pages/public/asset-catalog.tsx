import { Head, Link, router, usePage } from '@inertiajs/react';

type Category = { id: number; name: string };
type MediaItem = { path: string; is_primary: boolean };
type AssetItem = {
    id: number;
    name: string;
    location: string;
    hourly_rate: string | null;
    daily_rate: string | null;
    category: Category | null;
    cover_photo: MediaItem | null;
};

type PaginatedAssets = {
    data: AssetItem[];
    current_page: number;
    last_page: number;
    total: number;
};

type Props = {
    assets: PaginatedAssets;
    categories: Category[];
    filters: { category?: string; search?: string };
};

function formatRupiahFrom(hourly: string | null, daily: string | null): string {
    const rate = daily ?? hourly;
    if (!rate) return 'Hubungi pengurus';
    const suffix = daily ? '/hari' : '/jam';
    return 'Rp ' + parseInt(rate).toLocaleString('id-ID') + ' ' + suffix;
}

export default function AssetCatalog({ assets, categories, filters }: Props) {
    return (
        <>
            <Head title="Katalog Aset Koperasi" />
            <div className="mx-auto max-w-5xl px-4 py-8 space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Katalog Aset Koperasi</h1>
                    <p className="mt-1 text-muted-foreground">Sewa aset koperasi untuk keperluan pertanian dan kegiatan desa</p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3">
                    <input
                        type="text"
                        placeholder="Cari aset..."
                        defaultValue={filters.search ?? ''}
                        className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                router.get('/aset', { ...filters, search: (e.target as HTMLInputElement).value || undefined });
                            }
                        }}
                    />
                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={() => router.get('/aset', { ...filters, category: undefined })}
                            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${!filters.category ? 'bg-primary text-primary-foreground' : 'border border-border text-muted-foreground hover:border-primary hover:text-primary'}`}
                        >
                            Semua
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => router.get('/aset', { ...filters, category: String(cat.id) })}
                                className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${filters.category === String(cat.id) ? 'bg-primary text-primary-foreground' : 'border border-border text-muted-foreground hover:border-primary hover:text-primary'}`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                {assets.data.length === 0 ? (
                    <div className="py-16 text-center text-muted-foreground">
                        <p className="text-lg">Tidak ada aset yang ditemukan.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
                        {assets.data.map((asset) => (
                            <Link
                                key={asset.id}
                                href={`/aset/${asset.id}`}
                                className="group overflow-hidden rounded-2xl border border-border bg-card transition hover:border-primary hover:shadow-md"
                            >
                                {/* Photo */}
                                <div className="aspect-video overflow-hidden bg-muted">
                                    {asset.cover_photo ? (
                                        <img
                                            src={`/storage/${asset.cover_photo.path}`}
                                            alt={asset.name}
                                            className="h-full w-full object-cover transition group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                                            Belum ada foto
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="p-4 space-y-2">
                                    <div>
                                        {asset.category && (
                                            <span className="rounded-full bg-secondary/20 px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                                                {asset.category.name}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="font-semibold text-foreground group-hover:text-primary transition">
                                        {asset.name}
                                    </h3>
                                    <p className="text-xs text-muted-foreground">{asset.location}</p>
                                    <p className="text-sm font-medium text-primary">
                                        {formatRupiahFrom(asset.hourly_rate, asset.daily_rate)}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {assets.last_page > 1 && (
                    <div className="flex justify-center gap-2">
                        {Array.from({ length: assets.last_page }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => router.get('/aset', { ...filters, page })}
                                className={`h-8 w-8 rounded-md text-sm font-medium transition ${page === assets.current_page ? 'bg-primary text-primary-foreground' : 'border border-border hover:border-primary text-muted-foreground'}`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
