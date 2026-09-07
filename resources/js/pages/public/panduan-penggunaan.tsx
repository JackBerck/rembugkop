import DocPageLayout, { DocSection } from '@/components/doc-page-layout';
import { UserCheck, Calendar, Vote, Landmark, ArrowRight } from 'lucide-react';
import { Link } from '@inertiajs/react';

const sections: DocSection[] = [
    { id: 'langkah-1', title: 'Langkah 1: Pendaftaran Akun' },
    { id: 'langkah-2', title: 'Langkah 2: Menyewa Aset Desa' },
    { id: 'langkah-3', title: 'Langkah 3: Rembug Digital' },
    { id: 'langkah-4', title: 'Langkah 4: Transparansi Kas' },
];

export default function PanduanPenggunaanPage() {
    return (
        <DocPageLayout
            title="Panduan Penggunaan Layanan"
            description="Petunjuk praktis bagi warga desa untuk mendaftar, menyewa aset, dan mengikuti musyawarah digital."
            sections={sections}
        >
            <div className="space-y-6">
                {/* Langkah 1 */}
                <div id="langkah-1" className="scroll-mt-24 flex gap-4 items-start p-4 rounded-lg border border-border bg-background">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground font-heading font-bold">
                        1
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-heading subtitle-font-size font-bold text-foreground flex items-center gap-1.5">
                            <UserCheck className="size-5 text-primary" />
                            Langkah 1: Pendaftaran Akun Warga
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Klik tombol <strong>Daftar Anggota</strong> pada header, isi nama dan NIK KTP Anda. Pengurus akan memverifikasi akun Anda agar berstatus anggota resmi.
                        </p>
                    </div>
                </div>

                {/* Langkah 2 */}
                <div id="langkah-2" className="scroll-mt-24 flex gap-4 items-start p-4 rounded-lg border border-border bg-background">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground font-heading font-bold">
                        2
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-heading subtitle-font-size font-bold text-foreground flex items-center gap-1.5">
                            <Calendar className="size-5 text-secondary" />
                            Langkah 2: Menyewa Aset Desa
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Buka menu <strong>Katalog Aset</strong>, pilih peralatan (traktor, gilingan, gedung), tentukan tanggal yang belum terbooking pada kalender, lalu ajukan reservasi.
                        </p>
                    </div>
                </div>

                {/* Langkah 3 */}
                <div id="langkah-3" className="scroll-mt-24 flex gap-4 items-start p-4 rounded-lg border border-border bg-background">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground font-heading font-bold">
                        3
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-heading subtitle-font-size font-bold text-foreground flex items-center gap-1.5">
                            <Vote className="size-5 text-primary" />
                            Langkah 3: Mengikuti Rembug Digital
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Saat pengurus mengajukan proposal pengadaan barang atau aturan baru, berikan suara Setuju atau Menolak secara langsung melalui akun Anda.
                        </p>
                    </div>
                </div>

                {/* Langkah 4 */}
                <div id="langkah-4" className="scroll-mt-24 flex gap-4 items-start p-4 rounded-lg border border-border bg-background">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground font-heading font-bold">
                        4
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-heading subtitle-font-size font-bold text-foreground flex items-center gap-1.5">
                            <Landmark className="size-5 text-secondary" />
                            Langkah 4: Memantau Transparansi Kas
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Pantau saldo kas desa dan hasil pendapatan sewa aset secara terbuka real-time pada dashboard transparansi kas.
                        </p>
                    </div>
                </div>

                {/* Action CTA */}
                <div className="pt-2 border-t border-border flex flex-col sm:flex-row gap-3 items-center justify-between">
                    <p className="text-muted-foreground">
                        Membutuhkan bantuan lain? Hubungi pengurus koperasi desa.
                    </p>
                    <div className="flex gap-2">
                        <Link
                            href="/faq"
                            className="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-3 font-semibold text-foreground hover:bg-muted"
                        >
                            Buka FAQ
                        </Link>
                        <Link
                            href="/kontak"
                            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md bg-primary px-3 font-semibold text-primary-foreground"
                        >
                            Hubungi Kami <ArrowRight className="size-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </DocPageLayout>
    );
}
