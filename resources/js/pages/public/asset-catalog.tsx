import { Link, router } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import { Search } from 'lucide-react';

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
        <PublicLayout title="Katalog Aset Koperasi">
            <section className="section-padding-x py-6">
                <div className="container max-w-7xl space-y-6">
                    {/* Header */}
                    <div className="border-b border-border pb-4">
                        <h1 className="title-font-size font-bold text-foreground">Katalog Aset Koperasi</h1>
                        <p className="text-muted-foreground mt-1">
                            Sewa aset produktif milik koperasi desa untuk keperluan pertanian, usaha, dan kegiatan warga.
                        </p>
                    </div>

                    {/* Filters Bar */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-muted/40 p-4 rounded-xl border border-border">
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Cari aset..."
                                defaultValue={filters.search ?? ''}
                                className="w-full rounded-lg border border-border bg-card pl-9 pr-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        router.get('/aset', { ...filters, search: (e.target as HTMLInputElement).value || undefined });
                                    }
                                }}
                            />
                        </div>
                        <div className="flex gap-2 flex-wrap w-full sm:w-auto">
                            <button
                                onClick={() => router.get('/aset', { ...filters, category: undefined })}
                                className={`rounded-full px-3.5 py-1.5 small-font-size font-semibold transition ${
                                    !filters.category
                                        ? 'bg-primary text-primary-foreground shadow-2xs'
                                        : 'border border-border bg-card text-muted-foreground hover:border-primary hover:text-primary'
                                }`}
                            >
                                Semua
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => router.get('/aset', { ...filters, category: String(cat.id) })}
                                    className={`rounded-full px-3.5 py-1.5 small-font-size font-semibold transition ${
                                        filters.category === String(cat.id)
                                            ? 'bg-primary text-primary-foreground shadow-2xs'
                                            : 'border border-border bg-card text-muted-foreground hover:border-primary hover:text-primary'
                                    }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Asset Grid */}
                    {assets.data.length === 0 ? (
                        <div className="rounded-xl border border-border bg-card p-12 text-center text-muted-foreground">
                            <p className="font-semibold">Tidak ada aset yang ditemukan.</p>
                            <p className="mt-1">Coba gunakan kata kunci lain atau pilih kategori Semua.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {assets.data.map((asset) => (
                                <Link
                                    key={asset.id}
                                    href={`/aset/${asset.id}`}
                                    className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary hover:shadow-sm flex flex-col"
                                >
                                    {/* Photo */}
                                    <div className="aspect-video overflow-hidden bg-muted relative">
                                        {asset.cover_photo ? (
                                            <img
                                                src={`/storage/${asset.cover_photo.path}`}
                                                alt={asset.name}
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center small-font-size text-muted-foreground">
                                                Foto belum tersedia
                                            </div>
                                        )}
                                        {asset.category && (
                                            <span className="absolute top-3 left-3 rounded-md bg-card/90 backdrop-blur-xs px-2.5 py-1 small-font-size font-bold text-foreground shadow-2xs">
                                                {asset.category.name}
                                            </span>
                                        )}
                                    </div>

                                    {/* Content Info */}
                                    <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="font-heading subtitle-font-size font-bold text-foreground group-hover:text-primary transition-colors">
                                                {asset.name}
                                            </h3>
                                            <p className="small-font-size text-muted-foreground mt-0.5">{asset.location}</p>
                                        </div>
                                        <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                                            <span className="small-font-size text-muted-foreground">Tarif Sewa</span>
                                            <span className="font-bold text-primary">
                                                {formatRupiahFrom(asset.hourly_rate, asset.daily_rate)}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {assets.last_page > 1 && (
                        <div className="flex justify-center gap-2 pt-4">
                            {Array.from({ length: assets.last_page }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => router.get('/aset', { ...filters, page })}
                                    className={`h-9 w-9 rounded-md font-semibold transition ${
                                        page === assets.current_page
                                            ? 'bg-primary text-primary-foreground shadow-2xs'
                                            : 'border border-border bg-card hover:border-primary text-muted-foreground'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
