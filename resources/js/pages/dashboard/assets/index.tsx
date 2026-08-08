import { Head, Link, router } from '@inertiajs/react';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { index as dashboardAssetsIndex } from '@/routes/dashboard/assets';

type AssetCategory = { id: number; name: string };
type MediaItem = { path: string; is_primary: boolean };
type Asset = {
    id: number;
    name: string;
    status: string;
    hourly_rate: string | null;
    daily_rate: string | null;
    location: string;
    category: AssetCategory | null;
    cover_photo: MediaItem | null;
};

type PaginatedAssets = {
    data: Asset[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

type Props = {
    assets: PaginatedAssets;
    categories: AssetCategory[];
    filters: { status?: string; category?: string; search?: string };
};

const statusColors: Record<string, string> = {
    available: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
    maintenance: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    inactive: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
};

const statusLabel: Record<string, string> = {
    available: 'Tersedia',
    maintenance: 'Perawatan',
    inactive: 'Tidak Aktif',
};

function formatRupiah(value: string | null): string {
    if (!value) return '—';
    return 'Rp ' + parseInt(value).toLocaleString('id-ID');
}

export default function AssetsIndex({ assets, categories, filters }: Props) {
    function handleDelete(asset: Asset) {
        if (!confirm(`Hapus aset "${asset.name}"? Tindakan ini tidak dapat dibatalkan.`)) return;
        router.delete(`/dashboard/assets/${asset.id}`);
    }

    return (
        <>
            <Head title="Manajemen Aset" />
            <div className="mx-auto max-w-7xl space-y-6 px-4 py-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Manajemen Aset</h1>
                        <p className="text-sm text-muted-foreground">{assets.total} aset terdaftar</p>
                    </div>
                    <Button asChild>
                        <Link href="/dashboard/assets/create">
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Tambah Aset
                        </Link>
                    </Button>
                </div>

                {/* Filter */}
                <div className="flex flex-wrap gap-3">
                    <select
                        className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
                        value={filters.status ?? ''}
                        onChange={(e) => router.get('/dashboard/assets', { ...filters, status: e.target.value || undefined })}
                    >
                        <option value="">Semua Status</option>
                        <option value="available">Tersedia</option>
                        <option value="maintenance">Perawatan</option>
                        <option value="inactive">Tidak Aktif</option>
                    </select>
                    <select
                        className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
                        value={filters.category ?? ''}
                        onChange={(e) => router.get('/dashboard/assets', { ...filters, category: e.target.value || undefined })}
                    >
                        <option value="">Semua Kategori</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="Cari nama aset..."
                        defaultValue={filters.search ?? ''}
                        className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                router.get('/dashboard/assets', { ...filters, search: (e.target as HTMLInputElement).value || undefined });
                            }
                        }}
                    />
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-muted/40">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Foto</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Nama Aset</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Kategori</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Tarif/Hari</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {assets.data.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-muted-foreground">
                                        Belum ada aset yang terdaftar.
                                    </td>
                                </tr>
                            )}
                            {assets.data.map((asset) => (
                                <tr key={asset.id} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-4 py-3">
                                        {asset.cover_photo ? (
                                            <img
                                                src={`/storage/${asset.cover_photo.path}`}
                                                alt={asset.name}
                                                className="h-12 w-16 rounded-md object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-12 w-16 items-center justify-center rounded-md bg-muted text-xs text-muted-foreground">
                                                Tidak ada foto
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-foreground">{asset.name}</div>
                                        <div className="text-xs text-muted-foreground">{asset.location}</div>
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {asset.category?.name ?? '—'}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {formatRupiah(asset.daily_rate)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[asset.status] ?? ''}`}>
                                            {statusLabel[asset.status] ?? asset.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="ghost" size="icon" asChild title="Detail">
                                                <Link href={`/dashboard/assets/${asset.id}`}>
                                                    <EyeIcon className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button variant="ghost" size="icon" asChild title="Edit">
                                                <Link href={`/dashboard/assets/${asset.id}/edit`}>
                                                    <PencilIcon className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                title="Hapus"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => handleDelete(asset)}
                                            >
                                                <TrashIcon className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {assets.last_page > 1 && (
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Halaman {assets.current_page} dari {assets.last_page}</span>
                        <div className="flex gap-2">
                            {assets.current_page > 1 && (
                                <Button variant="outline" size="sm" onClick={() => router.get('/dashboard/assets', { ...filters, page: assets.current_page - 1 })}>
                                    Sebelumnya
                                </Button>
                            )}
                            {assets.current_page < assets.last_page && (
                                <Button variant="outline" size="sm" onClick={() => router.get('/dashboard/assets', { ...filters, page: assets.current_page + 1 })}>
                                    Berikutnya
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

AssetsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Manajemen Aset', href: '/dashboard/assets' },
    ],
};
