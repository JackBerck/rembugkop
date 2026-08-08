import { Form, Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { CheckCircleIcon, XCircleIcon, ClockIcon, CheckIcon, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/components/input-error';

type Asset = { id: number; name: string; cover_photo: { path: string } | null };
type User = { id: number; name: string; email: string };
type ReservationItem = {
    id: number;
    start_datetime: string;
    end_datetime: string;
    duration_type: string;
    calculated_price: string;
    status: string;
    notes: string | null;
    asset: Asset;
    renter: User;
};

type PaginatedReservations = {
    data: ReservationItem[];
    current_page: number;
    last_page: number;
    total: number;
};

type Props = {
    reservations: PaginatedReservations;
    statuses: { value: string; name: string }[];
    filters: { status?: string; asset_id?: string };
};

const statusConfig: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
    pending: { label: 'Menunggu', className: 'bg-amber-100 text-amber-800', icon: <ClockIcon className="h-3 w-3" /> },
    approved: { label: 'Disetujui', className: 'bg-emerald-100 text-emerald-800', icon: <CheckCircleIcon className="h-3 w-3" /> },
    ongoing: { label: 'Berlangsung', className: 'bg-blue-100 text-blue-800', icon: <CheckCircleIcon className="h-3 w-3" /> },
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

function RejectModal({ reservationId, onClose }: { reservationId: number; onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-xl bg-card p-6 shadow-xl">
                <h3 className="mb-3 font-semibold text-foreground">Tolak Reservasi</h3>
                <p className="mb-4 text-sm text-muted-foreground">Berikan alasan penolakan yang jelas agar anggota memahami keputusan ini.</p>
                <Form method="patch" action={`/dashboard/reservations/${reservationId}/reject`} className="space-y-4">
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Textarea name="reason" rows={3} placeholder="Contoh: Aset sedang dalam perawatan di waktu tersebut..." required minLength={10} />
                                <InputError message={errors.reason} />
                            </div>
                            <div className="flex justify-end gap-3">
                                <Button variant="outline" type="button" onClick={onClose}>Batal</Button>
                                <Button variant="destructive" type="submit" disabled={processing}>Tolak Reservasi</Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </div>
    );
}

export default function ReservationsIndex({ reservations, filters }: Props) {
    const [rejectId, setRejectId] = useState<number | null>(null);

    function handleApprove(id: number) {
        if (!confirm('Setujui reservasi ini?')) return;
        router.patch(`/dashboard/reservations/${id}/approve`);
    }

    return (
        <>
            <Head title="Manajemen Reservasi" />
            {rejectId && <RejectModal reservationId={rejectId} onClose={() => setRejectId(null)} />}

            <div className="mx-auto max-w-7xl space-y-6 px-4 py-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Manajemen Reservasi</h1>
                        <p className="text-sm text-muted-foreground">{reservations.total} reservasi total</p>
                    </div>
                </div>

                {/* Filter */}
                <div className="flex gap-3">
                    <select
                        className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
                        value={filters.status ?? ''}
                        onChange={(e) => router.get('/dashboard/reservations', { ...filters, status: e.target.value || undefined })}
                    >
                        <option value="">Semua Status</option>
                        {Object.entries(statusConfig).map(([val, cfg]) => (
                            <option key={val} value={val}>{cfg.label}</option>
                        ))}
                    </select>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-muted/40">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Aset</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Anggota</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Jadwal</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Harga</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {reservations.data.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-muted-foreground">
                                        Tidak ada reservasi ditemukan.
                                    </td>
                                </tr>
                            )}
                            {reservations.data.map((res) => (
                                <tr key={res.id} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-foreground">{res.asset.name}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-foreground">{res.renter.name}</div>
                                        <div className="text-xs text-muted-foreground">{res.renter.email}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="text-xs text-muted-foreground">
                                            {formatDatetime(res.start_datetime)} — {formatDatetime(res.end_datetime)}
                                        </div>
                                        <div className="text-xs text-muted-foreground capitalize">{res.duration_type}</div>
                                    </td>
                                    <td className="px-4 py-3 font-medium text-foreground">
                                        {formatRupiah(res.calculated_price)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <StatusBadge status={res.status} />
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-2">
                                            {res.status === 'pending' && (
                                                <>
                                                    <Button size="sm" variant="outline" className="text-emerald-700 border-emerald-300 hover:bg-emerald-50" onClick={() => handleApprove(res.id)}>
                                                        <CheckIcon className="mr-1 h-3.5 w-3.5" /> Setujui
                                                    </Button>
                                                    <Button size="sm" variant="outline" className="text-rose-700 border-rose-300 hover:bg-rose-50" onClick={() => setRejectId(res.id)}>
                                                        <XIcon className="mr-1 h-3.5 w-3.5" /> Tolak
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {reservations.last_page > 1 && (
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Halaman {reservations.current_page} dari {reservations.last_page}</span>
                        <div className="flex gap-2">
                            {reservations.current_page > 1 && (
                                <Button variant="outline" size="sm" onClick={() => router.get('/dashboard/reservations', { ...filters, page: reservations.current_page - 1 })}>
                                    Sebelumnya
                                </Button>
                            )}
                            {reservations.current_page < reservations.last_page && (
                                <Button variant="outline" size="sm" onClick={() => router.get('/dashboard/reservations', { ...filters, page: reservations.current_page + 1 })}>
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

ReservationsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Manajemen Reservasi', href: '/dashboard/reservations' },
    ],
};
