import { Link, usePage } from '@inertiajs/react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import { mainNavItems, infoNavItems } from '@/config/navigation';
import { login, register } from '@/routes';
import dashboard from '@/routes/dashboard';

export default function PublicNavbar() {
    const { url, props } = usePage();
    const auth = (props as { auth?: { user?: Record<string, unknown> } }).auth;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [infoDropdownOpen, setInfoDropdownOpen] = useState(false);

    const isActive = (href: string) => {
        if (href === '/') {
            return url === '/';
        }
        return url.startsWith(href);
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm transition-all">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Brand / Logo */}
                <Link href="/" className="flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-primary/30 rounded-md p-1">
                    <div className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-xs">
                        <AppLogoIcon className="size-5 fill-current text-white" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-heading subtitle-font-size font-bold tracking-tight text-foreground">
                            RembugKop<span className="text-secondary">.id</span>
                        </span>
                        <span className="hidden small-font-size font-medium leading-none text-muted-foreground sm:inline-block">
                            Koperasi Desa Digital
                        </span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden items-center gap-1 md:flex">
                    {mainNavItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`rounded-md px-3.5 py-2 normal-navbar-font-size font-medium transition-colors ${
                                isActive(item.href)
                                    ? 'bg-muted text-foreground font-semibold'
                                    : 'text-foreground/80 hover:bg-muted/60 hover:text-foreground'
                            }`}
                        >
                            {item.title}
                        </Link>
                    ))}

                    {/* Informasi & Lainnya Dropdown */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setInfoDropdownOpen(!infoDropdownOpen)}
                            onBlur={() => setTimeout(() => setInfoDropdownOpen(false), 150)}
                            className={`flex items-center gap-1 rounded-md px-3.5 py-2 normal-navbar-font-size font-medium transition-colors focus:outline-none ${
                                infoNavItems.some((i) => isActive(i.href))
                                    ? 'bg-muted text-foreground font-semibold'
                                    : 'text-foreground/80 hover:bg-muted/60 hover:text-foreground'
                            }`}
                        >
                            <span>Informasi & Lainnya</span>
                            <ChevronDown className={`size-4 transition-transform duration-200 ${infoDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {infoDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-64 rounded-lg border border-border bg-card p-1.5 shadow-lg ring-1 ring-black/5 animate-in fade-in-50 zoom-in-95">
                                <div className="px-2.5 py-1 small-font-size font-bold text-muted-foreground uppercase tracking-wider">
                                    Informasi & Lainnya
                                </div>
                                {infoNavItems.map((infoItem) => (
                                    <Link
                                        key={infoItem.href}
                                        href={infoItem.href}
                                        className={`flex flex-col rounded-md px-2.5 py-2 normal-navbar-font-size transition-colors ${
                                            isActive(infoItem.href)
                                                ? 'bg-muted text-primary font-semibold'
                                                : 'text-foreground/80 hover:bg-muted/60 hover:text-foreground'
                                        }`}
                                    >
                                        <span>{infoItem.title}</span>
                                        {infoItem.description && (
                                            <span className="small-font-size text-muted-foreground font-normal line-clamp-1">
                                                {infoItem.description}
                                            </span>
                                        )}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </nav>

                {/* Right Action Buttons */}
                <div className="hidden items-center gap-2 md:flex">
                    {auth?.user ? (
                        <Link
                            href={dashboard.home()}
                            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 normal-navbar-font-size font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/40 active:scale-[0.98]"
                        >
                            Ke Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={login()}
                                className="inline-flex h-9 items-center justify-center rounded-md px-4 normal-navbar-font-size font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
                            >
                                Masuk
                            </Link>
                            <Link
                                href={register()}
                                className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 normal-navbar-font-size font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/40 active:scale-[0.98]"
                            >
                                Daftar Anggota
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Toggle Button */}
                <div className="flex md:hidden">
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="inline-flex size-10 items-center justify-center rounded-md text-foreground hover:bg-muted focus:outline-none"
                        aria-label="Toggle Navigation Menu"
                    >
                        {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Drawer */}
            {mobileMenuOpen && (
                <div className="border-b border-border bg-background px-4 pt-2 pb-6 md:hidden animate-in slide-in-from-top-2">
                    <div className="flex flex-col space-y-1">
                        <div className="px-3 py-1 small-font-size font-bold text-muted-foreground uppercase tracking-wider">
                            Menu Utama
                        </div>
                        {mainNavItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`rounded-md px-3 py-2 normal-font-size font-medium transition-colors ${
                                    isActive(item.href)
                                        ? 'bg-muted text-primary font-semibold'
                                        : 'text-foreground/80 hover:bg-muted/60'
                                }`}
                            >
                                {item.title}
                            </Link>
                        ))}

                        <div className="mt-3 px-3 py-1 small-font-size font-bold text-muted-foreground uppercase tracking-wider">
                            Informasi & Lainnya
                        </div>
                        {infoNavItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`rounded-md px-3 py-2 normal-font-size font-medium transition-colors ${
                                    isActive(item.href)
                                        ? 'bg-muted text-primary font-semibold'
                                        : 'text-foreground/80 hover:bg-muted/60'
                                }`}
                            >
                                {item.title}
                            </Link>
                        ))}

                        <div className="mt-4 pt-3 border-t border-border flex flex-col gap-2">
                            {auth?.user ? (
                                <Link
                                    href={dashboard.home()}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex h-10 items-center justify-center rounded-md bg-primary normal-font-size font-medium text-primary-foreground shadow-xs"
                                >
                                    Ke Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex h-10 items-center justify-center rounded-md border border-border normal-font-size font-medium text-foreground hover:bg-muted"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href={register()}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex h-10 items-center justify-center rounded-md bg-primary normal-font-size font-medium text-primary-foreground shadow-xs"
                                    >
                                        Daftar Anggota
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
