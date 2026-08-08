import { Form, Head, router } from '@inertiajs/react';
import { useState, useRef } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';

type Category = { id: number; name: string };
type MediaItem = { id: number; path: string; is_primary: boolean; order_number: number };
type Asset = {
    id: number;
    name: string;
    description: string;
    location: string;
    hourly_rate: string | null;
    daily_rate: string | null;
    status: string;
    category_id: number | null;
    photos: MediaItem[];
};

type Props = {
    asset: Asset;
    categories: Category[];
};

export default function AssetEdit({ asset, categories }: Props) {
    const [newPreviews, setNewPreviews] = useState<string[]>([]);
    const [replacePhotos, setReplacePhotos] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files ?? []);
        setNewPreviews(files.map((f) => URL.createObjectURL(f)));
    }

    return (
        <>
            <Head title={`Edit: ${asset.name}`} />
            <div className="mx-auto max-w-3xl px-4 py-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-foreground">Edit Aset</h1>
                    <p className="text-sm text-muted-foreground">{asset.name}</p>
                </div>

                <Form
                    method="put"
                    action={`/dashboard/assets/${asset.id}`}
                    enctype="multipart/form-data"
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="rounded-xl border border-border bg-card p-6 space-y-5">
                                <h2 className="font-semibold text-foreground">Informasi Aset</h2>

                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nama Aset *</Label>
                                    <Input id="name" name="name" required defaultValue={asset.name} />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="category_id">Kategori *</Label>
                                    <select id="category_id" name="category_id" required className="rounded-md border border-input bg-background px-3 py-2 text-sm" defaultValue={asset.category_id ?? ''}>
                                        <option value="">Pilih kategori...</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    <InputError message={errors.category_id} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="description">Deskripsi *</Label>
                                    <Textarea id="description" name="description" required rows={4} defaultValue={asset.description} />
                                    <InputError message={errors.description} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="location">Lokasi Aset *</Label>
                                    <Input id="location" name="location" required defaultValue={asset.location} />
                                    <InputError message={errors.location} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="hourly_rate">Tarif Per Jam (Rp)</Label>
                                        <Input id="hourly_rate" name="hourly_rate" type="number" min="0" defaultValue={asset.hourly_rate ?? ''} />
                                        <InputError message={errors.hourly_rate} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="daily_rate">Tarif Per Hari (Rp)</Label>
                                        <Input id="daily_rate" name="daily_rate" type="number" min="0" defaultValue={asset.daily_rate ?? ''} />
                                        <InputError message={errors.daily_rate} />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="status">Status Aset</Label>
                                    <select id="status" name="status" className="rounded-md border border-input bg-background px-3 py-2 text-sm" defaultValue={asset.status}>
                                        <option value="available">Tersedia</option>
                                        <option value="maintenance">Dalam Perawatan</option>
                                        <option value="inactive">Tidak Aktif</option>
                                    </select>
                                </div>
                            </div>

                            {/* Current Photos */}
                            {asset.photos.length > 0 && (
                                <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                                    <h2 className="font-semibold text-foreground">Foto Saat Ini</h2>
                                    <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
                                        {asset.photos.map((photo) => (
                                            <div key={photo.id} className="relative aspect-square overflow-hidden rounded-lg border border-border">
                                                <img src={`/storage/${photo.path}`} className="h-full w-full object-cover" alt="" />
                                                {photo.is_primary && (
                                                    <span className="absolute left-1 top-1 rounded bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">Utama</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="replace_photos"
                                            value="1"
                                            checked={replacePhotos}
                                            onChange={(e) => setReplacePhotos(e.target.checked)}
                                            className="rounded border-input"
                                        />
                                        <span className="text-sm text-muted-foreground">Hapus semua foto lama dan ganti dengan foto baru</span>
                                    </label>
                                </div>
                            )}

                            {/* Add New Photos */}
                            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                                <h2 className="font-semibold text-foreground">
                                    {replacePhotos ? 'Foto Baru (Pengganti)' : 'Tambah Foto'}
                                </h2>
                                <div onClick={() => fileInputRef.current?.click()} className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 px-6 py-6 transition hover:border-primary hover:bg-primary/5">
                                    <p className="text-sm font-medium text-foreground">Klik untuk pilih foto</p>
                                    <input ref={fileInputRef} name="photos[]" type="file" multiple accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFileChange} />
                                </div>
                                {newPreviews.length > 0 && (
                                    <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
                                        {newPreviews.map((url, i) => (
                                            <div key={i} className="relative aspect-square overflow-hidden rounded-lg border border-border">
                                                <img src={url} className="h-full w-full object-cover" alt="" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-3">
                                <Button variant="outline" type="button" onClick={() => history.back()}>Batal</Button>
                                <Button type="submit" disabled={processing}>
                                    {processing && <Spinner />}
                                    Simpan Perubahan
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

AssetEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Manajemen Aset', href: '/dashboard/assets' },
        { title: 'Edit Aset' },
    ],
};
