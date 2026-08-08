import { Head, Link, router } from '@inertiajs/react';
import { ClockIcon, CheckCircleIcon, XCircleIcon, CheckIcon, XIcon, PlayIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

type AssetItem = { id: number; name: string; cover_photo: { path: string } | null };
type ReservationItem = {
    id: number;
    start_datetime: string;
    end_datetime: string;
    duration_type: string;
    calculated_price: string;
    status: string;
    notes: string | null;
    asset: AssetItem;
};

type PaginatedReservations = {
    data: ReservationItem[];
    current_page: number;
    last_page: number;
    total: number;
};

type Props = {
    reservations: PaginatedReservations;
};

const statusConfig: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
    pending: { label: 'Menunggu Persetujuan', className: 'bg-amber-100 text-amber-800', icon: <ClockIcon className="h-3 w-3" /> },
    approved: { label: 'Disetujui', className: 'bg-emerald-100 text-emerald-800', icon: <CheckCircleIcon className="h-3 w-3" /> },
    ongoing: { label: 'Sedang Berlangsung', className: 'bg-blue-100 text-blue-800', icon: <PlayIcon className="h-3 w-3" /> },
    completed: { label: 'Selesai', className: 'bg-slate-100 text-slate-700', icon: <CheckIcon className="h-3 w-3" /> },
    cancelled: { label: 'Dibatalkan', className: 'bg-slate-100 text-slate-500', icon: <XIcon className="h-3 w-3" /> },
    rejected: { label: 'Ditolak', className: 'bg-rose-100 text-rose-800', icon: <XCircleIcon className="h-3 w-3" /> },
};

function formatRupiah(value: string): string {
    return 'Rp ' + parseInt(value).toLocaleString('id-ID');
}

function formatDatetime(dt: string): string {
    return new Date(dt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
}

function StatusBadge({ status }: { status: string }) {
    const cfg = statusConfig[status] ?? { label: status, className: 'bg-muted text-muted-foreground', icon: null };
    return (
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.className}`}>
            {cfg.icon}
            {cfg.label}
        </span>
    );
}

export default function MyReservations({ reservations }: Props) {
    function handleCancel(id: number) {
        if (!confirm('Batalkan reservasi ini? Tindakan ini tidak dapat diurungkan.')) return;
        router.delete(`/reservasi-saya/${id}`);
    }

    return (
        <>
            <Head title="Reservasi Saya" />
            <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Reservasi Saya</h1>
                        <p className="text-sm text-muted-foreground">{reservations.total} reservasi total</p>
                    </div>
                    <Button asChild>
                        <Link href="/aset">Lihat Katalog Aset</Link>
                    </Button>
                </div>

                {reservations.data.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-border py-16 text-center space-y-3">
                        <p className="text-muted-foreground">Anda belum memiliki reservasi aset.</p>
                        <Button asChild variant="outline">
                            <Link href="/aset">Jelajahi Aset Koperasi</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {reservations.data.map((res) => (
                            <div key={res.id} className="rounded-2xl border border-border bg-card overflow-hidden transition hover:border-primary/40">
                                <div className="flex items-start gap-4 p-4">
                                    {/* Thumbnail */}
                                    {res.asset.cover_photo ? (
                                        <img
                                            src={`/storage/${res.asset.cover_photo.path}`}
                                            alt={res.asset.name}
                                            className="h-20 w-28 shrink-0 rounded-lg object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-20 w-28 shrink-0 items-center justify-center rounded-lg bg-muted text-xs text-muted-foreground">
                                            Tidak ada foto
                                        </div>
                                    )}

                                    {/* Details */}
                                    <div className="flex-1 space-y-1.5">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <h3 className="font-semibold text-foreground">{res.asset.name}</h3>
                                                <p className="text-xs text-muted-foreground capitalize">{res.duration_type === 'daily' ? 'Per hari' : 'Per jam'}</p>
                                            </div>
                                            <StatusBadge status={res.status} />
                                        </div>

                                        <div className="text-sm text-muted-foreground">
                                            <span className="font-medium text-foreground">{formatDatetime(res.start_datetime)}</span>
                                            {' — '}
                                            <span className="font-medium text-foreground">{formatDatetime(res.end_datetime)}</span>
                                        </div>

                                        <div className="text-sm font-semibold text-primary">
                                            {formatRupiah(res.calculated_price)}
                                        </div>

                                        {res.notes && res.status === 'rejected' && (
                                            <div className="rounded-lg bg-rose-50 border border-rose-200 px-3 py-2 text-xs text-rose-700">
                                                <strong>Alasan ditolak:</strong> {res.notes}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                {res.status === 'pending' && (
                                    <div className="border-t border-border bg-muted/20 px-4 py-3 flex justify-end">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-destructive border-destructive/40 hover:bg-destructive/10"
                                            onClick={() => handleCancel(res.id)}
                                        >
                                            <XIcon className="mr-1.5 h-3.5 w-3.5" />
                                            Batalkan Reservasi
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {reservations.last_page > 1 && (
                    <div className="flex justify-center gap-2">
                        {Array.from({ length: reservations.last_page }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => router.get('/reservasi-saya', { page })}
                                className={`h-8 w-8 rounded-md text-sm font-medium transition ${page === reservations.current_page ? 'bg-primary text-primary-foreground' : 'border border-border hover:border-primary text-muted-foreground'}`}
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
