import { Form, Head } from '@inertiajs/react';
import { useState, useRef } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';

type Category = { id: number; name: string };

type Props = {
    categories: Category[];
};

export default function AssetCreate({ categories }: Props) {
    const [previews, setPreviews] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files ?? []);
        const urls = files.map((f) => URL.createObjectURL(f));
        setPreviews(urls);
    }

    return (
        <>
            <Head title="Tambah Aset" />
            <div className="mx-auto max-w-3xl px-4 py-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-foreground">Tambah Aset Baru</h1>
                    <p className="text-sm text-muted-foreground">Isi data aset koperasi beserta foto (minimal 1 foto)</p>
                </div>

                <Form
                    method="post"
                    action="/dashboard/assets"
                    enctype="multipart/form-data"
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="rounded-xl border border-border bg-card p-6 space-y-5">
                                <h2 className="font-semibold text-foreground">Informasi Aset</h2>

                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nama Aset <span className="text-destructive">*</span></Label>
                                    <Input id="name" name="name" required placeholder="Contoh: Traktor Tangan" />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="category_id">Kategori <span className="text-destructive">*</span></Label>
                                    <select
                                        id="category_id"
                                        name="category_id"
                                        required
                                        className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    >
                                        <option value="">Pilih kategori...</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    <InputError message={errors.category_id} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="description">Deskripsi <span className="text-destructive">*</span></Label>
                                    <Textarea id="description" name="description" required rows={4} placeholder="Jelaskan kondisi, kapasitas, dan kegunaan aset" />
                                    <InputError message={errors.description} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="location">Lokasi Aset <span className="text-destructive">*</span></Label>
                                    <Input id="location" name="location" required placeholder="Contoh: Gudang Utama Desa" />
                                    <InputError message={errors.location} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="hourly_rate">Tarif Per Jam (Rp)</Label>
                                        <Input id="hourly_rate" name="hourly_rate" type="number" min="0" step="500" placeholder="Kosongkan jika tidak ada" />
                                        <InputError message={errors.hourly_rate} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="daily_rate">Tarif Per Hari (Rp)</Label>
                                        <Input id="daily_rate" name="daily_rate" type="number" min="0" step="1000" placeholder="Kosongkan jika tidak ada" />
                                        <InputError message={errors.daily_rate} />
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground">Minimal salah satu tarif harus diisi.</p>

                                <div className="grid gap-2">
                                    <Label htmlFor="status">Status Aset</Label>
                                    <select id="status" name="status" className="rounded-md border border-input bg-background px-3 py-2 text-sm" defaultValue="available">
                                        <option value="available">Tersedia</option>
                                        <option value="maintenance">Dalam Perawatan</option>
                                        <option value="inactive">Tidak Aktif</option>
                                    </select>
                                </div>
                            </div>

                            {/* Photo Upload */}
                            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                                <div>
                                    <h2 className="font-semibold text-foreground">Foto Aset <span className="text-destructive">*</span></h2>
                                    <p className="text-xs text-muted-foreground mt-0.5">Minimal 1 foto, maksimal 5 foto. Format JPG/PNG/WebP, maks 2MB per file. Foto pertama akan jadi foto utama.</p>
                                </div>

                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 px-6 py-8 transition hover:border-primary hover:bg-primary/5"
                                >
                                    <svg className="mb-3 h-8 w-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                    </svg>
                                    <p className="text-sm font-medium text-foreground">Klik untuk pilih foto</p>
                                    <p className="text-xs text-muted-foreground">atau seret & lepas file ke sini</p>
                                    <input
                                        ref={fileInputRef}
                                        id="photos"
                                        name="photos[]"
                                        type="file"
                                        multiple
                                        accept="image/jpeg,image/png,image/webp"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                </div>
                                <InputError message={errors.photos} />
                                {(errors as any)['photos.0'] && <InputError message={(errors as any)['photos.0']} />}

                                {previews.length > 0 && (
                                    <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
                                        {previews.map((url, i) => (
                                            <div key={i} className="relative aspect-square overflow-hidden rounded-lg border border-border">
                                                <img src={url} className="h-full w-full object-cover" alt={`Preview ${i + 1}`} />
                                                {i === 0 && (
                                                    <span className="absolute left-1 top-1 rounded bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
                                                        Utama
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-3">
                                <Button variant="outline" type="button" onClick={() => history.back()}>Batal</Button>
                                <Button type="submit" disabled={processing}>
                                    {processing && <Spinner />}
                                    Simpan Aset
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

AssetCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Manajemen Aset', href: '/dashboard/assets' },
        { title: 'Tambah Aset', href: '/dashboard/assets/create' },
    ],
};
