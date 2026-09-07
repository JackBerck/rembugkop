import { Form, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { MapPinIcon, CalendarIcon, ClockIcon, ShieldAlertIcon } from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';
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
        <PublicLayout title={asset.name}>
            <section className="section-padding-x py-6">
                <div className="container max-w-7xl">
                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* Left — Gallery & Info */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Gallery */}
                            {asset.photos.length > 0 ? (
                                <div className="space-y-3">
                                    <div className="aspect-video overflow-hidden rounded-xl border border-border bg-muted">
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
                                                    className={`shrink-0 overflow-hidden rounded-lg border-2 transition ${
                                                        i === activePhoto ? 'border-primary' : 'border-transparent'
                                                    }`}
                                                >
                                                    <img src={`/storage/${photo.path}`} className="h-16 w-20 object-cover" alt="" />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex aspect-video items-center justify-center rounded-xl border border-border bg-muted text-muted-foreground">
                                    Foto belum tersedia
                                </div>
                            )}

                            {/* Details */}
                            <div className="space-y-3">
                                {asset.category && (
                                    <span className="rounded-md bg-secondary/10 px-2.5 py-1 small-font-size font-semibold text-secondary">
                                        {asset.category.name}
                                    </span>
                                )}
                                <h1 className="title-font-size font-bold text-foreground">{asset.name}</h1>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <MapPinIcon className="size-4 shrink-0 text-primary" />
                                    {asset.location}
                                </div>
                                <p className="text-muted-foreground leading-relaxed">{asset.description}</p>

                                {/* Rates */}
                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    {asset.hourly_rate && (
                                        <div className="rounded-lg border border-border bg-muted/40 p-4">
                                            <div className="flex items-center gap-1.5 small-font-size font-semibold text-muted-foreground mb-1">
                                                <ClockIcon className="size-3.5" /> Tarif Per Jam
                                            </div>
                                            <div className="subtitle-font-size font-bold text-primary">
                                                {formatRupiah(asset.hourly_rate, '')}
                                            </div>
                                        </div>
                                    )}
                                    {asset.daily_rate && (
                                        <div className="rounded-lg border border-border bg-muted/40 p-4">
                                            <div className="flex items-center gap-1.5 small-font-size font-semibold text-muted-foreground mb-1">
                                                <CalendarIcon className="size-3.5" /> Tarif Per Hari
                                            </div>
                                            <div className="subtitle-font-size font-bold text-primary">
                                                {formatRupiah(asset.daily_rate, '')}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Blocked Slots Calendar */}
                            {blockedSlots.length > 0 && (
                                <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-2xs">
                                    <h2 className="font-heading subtitle-font-size font-bold text-foreground">Jadwal Tidak Tersedia</h2>
                                    <div className="space-y-2">
                                        {blockedSlots.map((slot) => (
                                            <div key={slot.id} className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                                                <span className="text-muted-foreground">
                                                    {formatDate(slot.start_datetime)} — {formatDate(slot.end_datetime)}
                                                </span>
                                                <span className={`rounded-md px-2 py-0.5 small-font-size font-bold ${
                                                    slot.status === 'ongoing'
                                                        ? 'bg-blue-100 text-blue-700'
                                                        : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                    {slot.status === 'ongoing' ? 'Sedang Disewa' : 'Sudah Dibooking'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right — Booking Form / Access Info */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-20 rounded-xl border border-border bg-card p-5 shadow-2xs space-y-4">
                                <h2 className="font-heading subtitle-font-size font-bold text-foreground">Ajukan Reservasi Aset</h2>

                                {!user && (
                                    <div className="rounded-lg bg-muted p-4 space-y-3">
                                        <p className="text-muted-foreground leading-relaxed">
                                            Anda menelusuri katalog sebagai publik. Silakan masuk atau daftar anggota untuk menyewa aset ini.
                                        </p>
                                        <div className="flex flex-col gap-2">
                                            <a
                                                href="/login"
                                                className="flex h-9 items-center justify-center rounded-md bg-primary font-semibold text-primary-foreground"
                                            >
                                                Masuk untuk Menyewa
                                            </a>
                                            <a
                                                href="/register"
                                                className="flex h-9 items-center justify-center rounded-md border border-border bg-card font-semibold text-foreground hover:bg-muted"
                                            >
                                                Daftar Anggota Baru
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {isPengurus && (
                                    <div className="rounded-lg bg-muted/60 px-4 py-3 text-muted-foreground">
                                        Pengurus tidak mengajukan reservasi aset secara langsung. Gunakan Dashboard Pengurus untuk kelola jadwal.
                                    </div>
                                )}

                                {notVerified && (
                                    <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 space-y-2">
                                        <div className="flex items-center gap-2 font-bold text-amber-800">
                                            <ShieldAlertIcon className="size-4 shrink-0" />
                                            Verifikasi Diperlukan
                                        </div>
                                        <p className="text-amber-700 leading-relaxed">
                                            Akun Anda masih menunggu verifikasi NIK oleh pengurus. Setelah diverifikasi, Anda bisa langsung mengajukan reservasi.
                                        </p>
                                    </div>
                                )}

                                {canBook && (
                                    <Form
                                        method="post"
                                        action={`/aset/${asset.id}/reservasi`}
                                        className="space-y-4"
                                    >
                                        {({ processing, errors }) => (
                                            <>
                                                <input type="hidden" name="asset_id" value={asset.id} />

                                                <div className="grid gap-1.5">
                                                    <Label htmlFor="duration_type">Jenis Durasi</Label>
                                                    <select
                                                        id="duration_type"
                                                        name="duration_type"
                                                        className="rounded-md border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                        required
                                                    >
                                                        {asset.daily_rate && <option value="daily">Per Hari</option>}
                                                        {asset.hourly_rate && <option value="hourly">Per Jam</option>}
                                                    </select>
                                                    <InputError message={errors.duration_type} />
                                                </div>

                                                <div className="grid gap-1.5">
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

                                                <div className="grid gap-1.5">
                                                    <Label htmlFor="end_datetime">Waktu Selesai</Label>
                                                    <Input
                                                        id="end_datetime"
                                                        name="end_datetime"
                                                        type="datetime-local"
                                                        required
                                                    />
                                                    <InputError message={errors.end_datetime} />
                                                </div>

                                                <div className="grid gap-1.5">
                                                    <Label htmlFor="notes">Catatan (opsional)</Label>
                                                    <Textarea
                                                        id="notes"
                                                        name="notes"
                                                        rows={2}
                                                        placeholder="Keperluan, lokasi pengantaran..."
                                                    />
                                                    <InputError message={errors.notes} />
                                                </div>

                                                <div className="rounded-lg bg-muted/40 p-3 small-font-size text-muted-foreground leading-relaxed">
                                                    Harga akan dihitung otomatis berdasarkan durasi. Reservasi memerlukan persetujuan pengurus.
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
            </section>
        </PublicLayout>
    );
}
