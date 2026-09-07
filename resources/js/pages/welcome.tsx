import { Link } from '@inertiajs/react';
import { Vote, CalendarCheck, Landmark, ArrowRight, ShieldCheck, Users, CheckCircle2 } from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';
import { login, register } from '@/routes';

export default function Welcome() {
    return (
        <PublicLayout title="Beranda">
            {/* Hero Section */}
            <section className="section-padding-x py-10 md:py-16 border-b border-border bg-background">
                <div className="container max-w-7xl text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3.5 py-1 small-font-size font-semibold text-foreground mb-6">
                        <span className="flex size-2 rounded-full bg-primary" />
                        Platform Modernisasi Koperasi Desa Digital
                    </div>

                    <h1 className="font-heading title-font-size font-extrabold tracking-tight text-foreground leading-tight max-w-4xl mx-auto">
                        Satu Rembug, Transparan Pengelolaannya, <span className="text-primary underline decoration-border underline-offset-8">Berdaya Asetnya</span>
                    </h1>

                    <p className="mx-auto mt-5 max-w-2xl text-muted-foreground leading-relaxed">
                        RembugKop.id menghubungkan warga desa dan pengurus koperasi untuk bermusyawarah secara digital, menyewa aset produktif tanpa bentrok jadwal, dan memantau arus kas secara terbuka.
                    </p>

                    {/* Action Buttons */}
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                        <Link
                            href="/aset"
                            className="w-full sm:w-auto inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-6 font-bold text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/40 active:scale-[0.98]"
                        >
                            Jelajahi Katalog Aset
                            <ArrowRight className="size-4" />
                        </Link>
                        <Link
                            href={register()}
                            className="w-full sm:w-auto inline-flex h-11 items-center justify-center rounded-md border border-border bg-card px-6 font-bold text-foreground shadow-2xs transition-colors hover:bg-muted focus:outline-none"
                        >
                            Daftar Anggota Koperasi
                        </Link>
                    </div>

                    {/* Quick Highlights */}
                    <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-border pt-8 text-left max-w-4xl mx-auto">
                        <div className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border shadow-2xs">
                            <CheckCircle2 className="size-5 text-primary shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-foreground">Musyawarah Transparan</h4>
                                <p className="small-font-size text-muted-foreground mt-0.5">Voting proposal pengadaan aset terbuka bagi warga</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border shadow-2xs">
                            <CheckCircle2 className="size-5 text-secondary shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-foreground">Sewa Aset Mudah</h4>
                                <p className="small-font-size text-muted-foreground mt-0.5">Tarif jelas, kalender jadwal tanpa bentrok</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border shadow-2xs">
                            <CheckCircle2 className="size-5 text-primary shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-foreground">Kas Bisa Diaudit</h4>
                                <p className="small-font-size text-muted-foreground mt-0.5">Laporan kas real-time untuk transparansi pubik</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3 Pillars Section */}
            <section className="section-padding-x py-10 md:py-16 bg-muted/40 border-b border-border">
                <div className="container max-w-7xl">
                    <div className="text-center max-w-3xl mx-auto mb-10">
                        <h2 className="font-heading subtitle-font-size font-bold tracking-tight text-foreground">
                            Tiga Pilar Utama RembugKop.id
                        </h2>
                        <p className="mt-2 text-muted-foreground">
                            Dirancang khusus sesuai kebutuhan dan prinsip transparansi masyarakat desa di Indonesia.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Pillar 1 */}
                        <div className="flex flex-col rounded-xl border border-border bg-card p-6 shadow-2xs transition-shadow hover:shadow-sm">
                            <div className="flex size-11 items-center justify-center rounded-md bg-primary/10 text-primary mb-4">
                                <Vote className="size-5" />
                            </div>
                            <h3 className="font-heading subtitle-font-size font-bold text-foreground">
                                1. Rembug Digital
                            </h3>
                            <p className="mt-2 text-muted-foreground leading-relaxed flex-1">
                                Ruang voting & musyawarah publik. Warga bersuara menentukan pengadaan aset, alokasi dana, dan kebijakan koperasi secara langsung.
                            </p>
                            <div className="mt-4 pt-3 border-t border-border small-font-size font-bold text-primary">
                                Musyawarah Digital Berbasis Warga
                            </div>
                        </div>

                        {/* Pillar 2 */}
                        <div className="flex flex-col rounded-xl border border-border bg-card p-6 shadow-2xs transition-shadow hover:shadow-sm">
                            <div className="flex size-11 items-center justify-center rounded-md bg-secondary/10 text-secondary mb-4">
                                <CalendarCheck className="size-5" />
                            </div>
                            <h3 className="font-heading subtitle-font-size font-bold text-foreground">
                                2. Sewa Aset Koperasi
                            </h3>
                            <p className="mt-2 text-muted-foreground leading-relaxed flex-1">
                                Katalog aset produktif desa (traktor, mesin giling, gedung) lengkap dengan kalender interaktif untuk mencegah jadwal bentrok.
                            </p>
                            <div className="mt-4 pt-3 border-t border-border small-font-size font-bold text-secondary">
                                Utilitas Aset Optimal & Tarif Jelas
                            </div>
                        </div>

                        {/* Pillar 3 */}
                        <div className="flex flex-col rounded-xl border border-border bg-card p-6 shadow-2xs transition-shadow hover:shadow-sm">
                            <div className="flex size-11 items-center justify-center rounded-md bg-primary/10 text-primary mb-4">
                                <Landmark className="size-5" />
                            </div>
                            <h3 className="font-heading subtitle-font-size font-bold text-foreground">
                                3. Real-Time Treasury
                            </h3>
                            <p className="mt-2 text-muted-foreground leading-relaxed flex-1">
                                Laporan arus kas publik yang bisa diakses dan diaudit oleh warga kapan saja. Transaksi tembus pandang untuk kepercayaan bersama.
                            </p>
                            <div className="mt-4 pt-3 border-t border-border small-font-size font-bold text-primary">
                                Transparansi Arus Kas Terbuka
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Value Proposition Section */}
            <section className="section-padding-x py-10 md:py-16 bg-background">
                <div className="container max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="space-y-4">
                            <span className="inline-block rounded-md bg-muted px-2.5 py-1 small-font-size font-bold text-secondary uppercase tracking-wider">
                                Siklus Ekonomi Koperasi
                            </span>
                            <h2 className="font-heading subtitle-font-size font-bold text-foreground leading-snug">
                                Dari Warga, Oleh Warga, Kembali ke Kas Bersama
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Warga bermusyawarah memilih pengadaan aset produktif, menyewakannya dengan sistem teratur, dan hasil sewa diputar kembali untuk kemajuan bersama.
                            </p>
                            <ul className="space-y-2.5 pt-2">
                                <li className="flex items-center gap-3 font-semibold text-foreground">
                                    <ShieldCheck className="size-4 text-primary shrink-0" />
                                    Tampilan bersih, kontras tinggi, dan ramah pengguna
                                </li>
                                <li className="flex items-center gap-3 font-semibold text-foreground">
                                    <Users className="size-4 text-primary shrink-0" />
                                    Aksesibel dengan istilah bahasa Indonesia yang familiar
                                </li>
                                <li className="flex items-center gap-3 font-semibold text-foreground">
                                    <Vote className="size-4 text-primary shrink-0" />
                                    Ruang partisipasi aktif harian bagi seluruh anggota warga
                                </li>
                            </ul>
                        </div>

                        <div className="rounded-xl border border-border bg-card p-6 shadow-2xs space-y-4">
                            <div className="rounded-lg bg-muted p-4 border border-border">
                                <span className="small-font-size font-bold text-muted-foreground uppercase">Masalah Utama</span>
                                <p className="font-bold text-foreground mt-1">Aset fisik desa menganggur & pencatatan kas manual rawan krisis kepercayaan</p>
                            </div>
                            <div className="rounded-lg bg-primary/10 p-4 border border-primary/20">
                                <span className="small-font-size font-bold text-primary uppercase">Solusi RembugKop.id</span>
                                <p className="font-bold text-foreground mt-1">Kalender sewa digital, musyawarah voting proposal, dan kas terbuka real-time</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section-padding-x py-12 bg-primary text-primary-foreground">
                <div className="container max-w-7xl text-center max-w-3xl mx-auto">
                    <h2 className="font-heading subtitle-font-size font-bold tracking-tight">
                        Siap Mewujudkan Transparansi Koperasi Desa Anda?
                    </h2>
                    <p className="mt-2 text-primary-foreground/90 leading-relaxed">
                        Bergabunglah dengan anggota warga dan pengurus untuk mengelola aset produktif secara bersama-sama.
                    </p>
                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link
                            href={register()}
                            className="w-full sm:w-auto inline-flex h-11 items-center justify-center rounded-md bg-white px-6 font-bold text-foreground shadow-xs transition-colors hover:bg-muted focus:outline-none"
                        >
                            Daftar Sekarang
                        </Link>
                        <Link
                            href={login()}
                            className="w-full sm:w-auto inline-flex h-11 items-center justify-center rounded-md border border-white/30 px-6 font-semibold text-white hover:bg-white/10"
                        >
                            Masuk ke Akun
                        </Link>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
