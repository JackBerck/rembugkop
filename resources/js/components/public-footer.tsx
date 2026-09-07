import { Link } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { footerNavGroups } from '@/config/navigation';

export default function PublicFooter() {
    return (
        <footer className="border-t border-border bg-background text-foreground">
            <div className="section-padding-x py-12 lg:py-16">
                <div className="container max-w-7xl">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                        {/* Brand Column */}
                        <div className="flex flex-col space-y-3">
                            <Link href="/" className="flex items-center gap-2">
                                <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                                    <AppLogoIcon className="size-4 fill-current text-white" />
                                </div>
                                <span className="font-heading subtitle-font-size font-bold tracking-tight text-foreground">
                                    RembugKop<span className="text-secondary">.id</span>
                                </span>
                            </Link>
                            <p className="small-font-size font-semibold text-secondary">
                                "Satu Rembug, Transparan Pengelolaannya, Berdaya Asetnya."
                            </p>
                            <p className="normal-footer-font-size text-muted-foreground leading-relaxed">
                                Platform modernisasi ekosistem koperasi desa yang mendemokratisasi tata kelola dan mengoptimalkan utilitas aset fisik desa secara transparan.
                            </p>
                        </div>

                        {/* Navigation Columns */}
                        {footerNavGroups.map((group) => (
                            <div key={group.title} className="flex flex-col space-y-3">
                                <h3 className="font-heading title-footer-font-size font-bold uppercase tracking-wider text-muted-foreground">
                                    {group.title}
                                </h3>
                                <ul className="space-y-2">
                                    {group.items.map((item) => (
                                        <li key={item.href}>
                                            <Link
                                                href={item.href}
                                                className="normal-footer-font-size text-foreground/80 transition-colors hover:text-primary hover:underline hover:underline-offset-4"
                                            >
                                                {item.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}

                        {/* Info Column */}
                        <div className="flex flex-col space-y-3">
                            <h3 className="font-heading title-footer-font-size font-bold uppercase tracking-wider text-muted-foreground">
                                Koperasi Desa Digital
                            </h3>
                            <p className="normal-footer-font-size text-muted-foreground leading-relaxed">
                                Mendukung keterbukaan kas real-time, pencatatan sewa aset tanpa bentrok jadwal, dan ruang musyawarah digital bagi warga desa.
                            </p>
                            <div className="pt-1">
                                <span className="inline-block rounded-md bg-muted px-2.5 py-1 small-font-size font-medium text-muted-foreground">
                                    Gotong Royong Digital • MVP 1.0
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Copyright Bar */}
                    <div className="mt-12 border-t border-border pt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
                        <p className="normal-footer-font-size text-muted-foreground text-center sm:text-left">
                            &copy; {new Date().getFullYear()} RembugKop.id. Hak Cipta Dilindungi Undang-Undang.
                        </p>
                        <div className="flex gap-4 normal-footer-font-size text-muted-foreground">
                            <Link href="/kebijakan-privasi" className="hover:text-foreground">
                                Privasi
                            </Link>
                            <span>•</span>
                            <Link href="/syarat-ketentuan" className="hover:text-foreground">
                                Syarat
                            </Link>
                            <span>•</span>
                            <Link href="/panduan-penggunaan" className="hover:text-foreground">
                                Panduan
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
