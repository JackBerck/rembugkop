import { Form, Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { MapPinIcon, CalendarIcon, ClockIcon, ShieldAlertIcon } from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';

type Category = { id: number; name: string };
type MediaItem = { id: number; path: string; is_primary: boolean };
type Asset = {
    id: number;
    name: string;
    description: string;
    location: string;
    hourly_rate: string | null;
    daily_rate: string | null;
    status: string;
    category: Category | null;
    photos: MediaItem[];
};
type BlockedSlot = { id: number; start_datetime: string; end_datetime: string; status: string };
type AuthUser = { role: string; is_verified: boolean } | null;

type Props = {
    asset: Asset;
    blockedSlots: BlockedSlot[];
};

function formatRupiah(value: string | null, suffix: string): string {
    if (!value) return '—';
    return 'Rp ' + parseInt(value).toLocaleString('id-ID') + suffix;
}

function formatDate(dt: string): string {
    return new Date(dt).toLocaleDateString('id-ID', { dateStyle: 'medium' });
}

export default function AssetDetail({ asset, blockedSlots }: Props) {
    const { auth } = usePage<{ auth: { user: AuthUser } }>().props;
    const user = auth.user;
    const [activePhoto, setActivePhoto] = useState(0);

    const canBook = user?.role === 'anggota' && user?.is_verified;
    const notVerified = user?.role === 'anggota' && !user?.is_verified;
    const isPengurus = user?.role === 'pengurus' || user?.role === 'super_admin';

    return (
        <>
            <Head title={asset.name} />
            <div className="mx-auto max-w-5xl px-4 py-8">
                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Left — Gallery & Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Gallery */}
                        {asset.photos.length > 0 ? (
                            <div className="space-y-3">
                                <div className="aspect-video overflow-hidden rounded-2xl border border-border bg-muted">
                                    <img
                                        src={`/storage/${asset.photos[activePhoto]?.path}`}
                                        alt={asset.name}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                {asset.photos.length > 1 && (
                                    <div className="flex gap-2 overflow-x-auto">
                                        {asset.photos.map((photo, i) => (
                                            <button
                                                key={photo.id}
                                                onClick={() => setActivePhoto(i)}
                                                className={`shrink-0 overflow-hidden rounded-lg border-2 transition ${i === activePhoto ? 'border-primary' : 'border-transparent'}`}
                                            >
                                                <img src={`/storage/${photo.path}`} className="h-16 w-20 object-cover" alt="" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex aspect-video items-center justify-center rounded-2xl border border-border bg-muted text-muted-foreground">
                                Belum ada foto
                            </div>
                        )}

                        {/* Details */}
                        <div className="space-y-4">
                            {asset.category && (
                                <span className="rounded-full bg-secondary/20 px-3 py-1 text-xs font-medium text-secondary-foreground">
                                    {asset.category.name}
                                </span>
                            )}
                            <h1 className="text-2xl font-bold text-foreground">{asset.name}</h1>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPinIcon className="h-4 w-4" />
                                {asset.location}
                            </div>
                            <p className="text-muted-foreground leading-relaxed">{asset.description}</p>

                            {/* Rates */}
                            <div className="grid grid-cols-2 gap-3">
                                {asset.hourly_rate && (
                                    <div className="rounded-xl border border-border bg-muted/30 p-4">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                                            <ClockIcon className="h-3.5 w-3.5" /> Tarif Per Jam
                                        </div>
                                        <div className="text-lg font-bold text-foreground">
                                            {formatRupiah(asset.hourly_rate, '')}
                                        </div>
                                    </div>
                                )}
                                {asset.daily_rate && (
                                    <div className="rounded-xl border border-border bg-muted/30 p-4">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                                            <CalendarIcon className="h-3.5 w-3.5" /> Tarif Per Hari
                                        </div>
                                        <div className="text-lg font-bold text-foreground">
                                            {formatRupiah(asset.daily_rate, '')}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Blocked Slots Calendar */}
                        {blockedSlots.length > 0 && (
                            <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                                <h2 className="font-semibold text-foreground text-sm">Jadwal Tidak Tersedia</h2>
                                <div className="space-y-2">
                                    {blockedSlots.map((slot) => (
                                        <div key={slot.id} className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2 text-xs">
                                            <span className="text-muted-foreground">
                                                {formatDate(slot.start_datetime)} — {formatDate(slot.end_datetime)}
                                            </span>
                                            <span className={`rounded-full px-2 py-0.5 font-medium ${slot.status === 'ongoing' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {slot.status === 'ongoing' ? 'Sedang Disewa' : 'Sudah Dibooking'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right — Booking Form */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6 rounded-2xl border border-border bg-card p-5 shadow-sm space-y-5">
                            <h2 className="font-semibold text-foreground">Ajukan Reservasi</h2>

                            {/* Not logged in or pengurus — info only */}
                            {isPengurus && (
                                <div className="rounded-lg bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
                                    Pengurus tidak mengajukan reservasi aset secara langsung.
                                </div>
                            )}

                            {/* Not verified — explain why disabled */}
                            {notVerified && (
                                <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 space-y-2">
                                    <div className="flex items-center gap-2 text-sm font-medium text-amber-800">
                                        <ShieldAlertIcon className="h-4 w-4 shrink-0" />
                                        Verifikasi diperlukan
                                    </div>
                                    <p className="text-xs text-amber-700 leading-relaxed">
                                        Akun Anda masih menunggu verifikasi NIK oleh pengurus. Setelah diverifikasi, Anda bisa langsung mengajukan reservasi di halaman ini.
                                    </p>
                                    <p className="text-xs text-amber-600">
                                        Butuh bantuan? Hubungi pengurus koperasi untuk mempercepat proses verifikasi.
                                    </p>
                                </div>
                            )}

                            {/* Booking form — only for verified anggota */}
                            {canBook && (
                                <Form
                                    method="post"
                                    action={`/aset/${asset.id}/reservasi`}
                                    className="space-y-4"
                                >
                                    {({ processing, errors }) => (
                                        <>
                                            <input type="hidden" name="asset_id" value={asset.id} />

                                            <div className="grid gap-2">
                                                <Label htmlFor="duration_type">Jenis Durasi</Label>
                                                <select
                                                    id="duration_type"
                                                    name="duration_type"
                                                    className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                    required
                                                >
                                                    {asset.daily_rate && <option value="daily">Per Hari</option>}
                                                    {asset.hourly_rate && <option value="hourly">Per Jam</option>}
                                                </select>
                                                <InputError message={errors.duration_type} />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="start_datetime">Waktu Mulai</Label>
                                                <Input
                                                    id="start_datetime"
                                                    name="start_datetime"
                                                    type="datetime-local"
                                                    required
                                                    min={new Date().toISOString().slice(0, 16)}
                                                />
                                                <InputError message={errors.start_datetime} />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="end_datetime">Waktu Selesai</Label>
                                                <Input
                                                    id="end_datetime"
                                                    name="end_datetime"
                                                    type="datetime-local"
                                                    required
                                                />
                                                <InputError message={errors.end_datetime} />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="notes">Catatan (opsional)</Label>
                                                <Textarea
                                                    id="notes"
                                                    name="notes"
                                                    rows={2}
                                                    placeholder="Keperluan, catatan khusus..."
                                                />
                                                <InputError message={errors.notes} />
                                            </div>

                                            <div className="rounded-lg bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                                                Harga akan dihitung otomatis berdasarkan durasi × tarif aset. Reservasi perlu disetujui pengurus sebelum berlaku.
                                            </div>

                                            <Button type="submit" className="w-full" disabled={processing}>
                                                {processing && <Spinner />}
                                                Ajukan Reservasi
                                            </Button>
                                        </>
                                    )}
                                </Form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
