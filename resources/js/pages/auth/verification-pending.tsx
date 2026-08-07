import { Head, Link } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import { ClockIcon, PhoneIcon, ShieldCheckIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

type SharedAuth = {
    user: {
        name: string;
        email: string;
        verification_status?: string;
    } | null;
};

export default function VerificationPending() {
    const { auth, flash } = usePage<{
        auth: SharedAuth;
        flash: { success?: string; warning?: string; error?: string };
    }>().props;

    return (
        <>
            <Head title="Menunggu Verifikasi NIK" />

            <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-16">
                <div className="w-full max-w-md space-y-8 text-center">
                    {/* Icon */}
                    <div className="flex justify-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                            <ClockIcon className="h-10 w-10 text-primary" />
                        </div>
                    </div>

                    {/* Heading */}
                    <div className="space-y-3">
                        <h1 className="font-heading text-2xl font-bold text-foreground">
                            Menunggu Verifikasi NIK
                        </h1>
                        {auth.user && (
                            <p className="text-muted-foreground">
                                Halo, <span className="font-medium text-foreground">{auth.user.name}</span>!
                            </p>
                        )}
                        <p className="text-muted-foreground">
                            Pendaftaran Anda telah berhasil. Pengurus koperasi sedang
                            memverifikasi data NIK Anda. Proses ini biasanya membutuhkan
                            waktu <strong>1–2 hari kerja</strong>.
                        </p>
                    </div>

                    {/* Flash messages */}
                    {flash.success && (
                        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                            {flash.success}
                        </div>
                    )}
                    {flash.warning && (
                        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                            {flash.warning}
                        </div>
                    )}

                    {/* Info steps */}
                    <div className="rounded-xl border border-muted bg-muted/30 p-6 text-left space-y-4">
                        <h2 className="font-heading text-sm font-semibold text-foreground uppercase tracking-wide">
                            Langkah selanjutnya
                        </h2>

                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                                    1
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Pengurus koperasi akan mencocokkan NIK Anda dengan data administrasi keanggotaan.
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                                    2
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Setelah diverifikasi, Anda dapat langsung menyewa aset koperasi dan mengikuti voting rembug.
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                                    3
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Hubungi pengurus jika proses verifikasi memakan waktu lebih dari 2 hari kerja.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact pengurus */}
                    <div className="flex items-center gap-3 rounded-xl border border-secondary/20 bg-secondary/5 px-4 py-3">
                        <PhoneIcon className="h-5 w-5 shrink-0 text-secondary" />
                        <p className="text-sm text-muted-foreground text-left">
                            Butuh bantuan? Hubungi pengurus koperasi di kantor atau via nomor yang tertera di papan pengumuman.
                        </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <Button asChild variant="outline">
                            <Link href="/">Kembali ke Beranda</Link>
                        </Button>
                        <Button asChild variant="ghost" className="text-sm text-muted-foreground">
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                            >
                                Keluar
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
