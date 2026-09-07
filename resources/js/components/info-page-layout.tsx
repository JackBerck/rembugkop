import { Link, router, usePage } from '@inertiajs/react';
import { ReactNode } from 'react';
import PublicLayout from '@/layouts/public-layout';
import { infoNavItems } from '@/config/navigation';
import { ChevronDown } from 'lucide-react';

interface InfoPageLayoutProps {
    title: string;
    description?: string;
    children: ReactNode;
}

export default function InfoPageLayout({ title, description, children }: InfoPageLayoutProps) {
    const { url } = usePage();

    const currentItem = infoNavItems.find((item) => url.startsWith(item.href)) || infoNavItems[0];

    const handleMobileSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        router.visit(e.target.value);
    };

    return (
        <PublicLayout title={title}>
            {/* Compact Header Banner */}
            <section className="bg-primary text-primary-foreground py-8 md:py-10 border-b border-primary/20">
                <div className="section-padding-x">
                    <div className="container max-w-7xl">
                        <div className="max-w-3xl">
                            <span className="inline-block rounded-md bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-white/90 mb-2">
                                Informasi & Lainnya
                            </span>
                            <h1 className="font-heading text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
                                {title}
                            </h1>
                            {description && (
                                <p className="mt-2 text-sm text-primary-foreground/90 leading-relaxed">
                                    {description}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content Area: Sidebar + Body */}
            <section className="section-padding-x py-6 bg-muted/30">
                <div className="container max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* Mobile Navigation Dropdown Select */}
                        <div className="lg:hidden col-span-1">
                            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                                Pilih Halaman Informasi
                            </label>
                            <div className="relative">
                                <select
                                    value={currentItem.href}
                                    onChange={handleMobileSelectChange}
                                    className="w-full appearance-none rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm font-medium text-foreground shadow-2xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                >
                                    {infoNavItems.map((item) => (
                                        <option key={item.href} value={item.href}>
                                            {item.title}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-3.5 top-3 size-4 text-muted-foreground" />
                            </div>
                        </div>

                        {/* Desktop Left Sidebar Tab List */}
                        <aside className="hidden lg:block lg:col-span-3 sticky top-20">
                            <div className="rounded-xl border border-border bg-card p-3 shadow-2xs space-y-1">
                                <div className="px-3 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                    Informasi & Lainnya
                                </div>
                                {infoNavItems.map((item) => {
                                    const isActive = url === item.href || (item.href !== '/' && url.startsWith(item.href));
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`flex items-center justify-between rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all ${
                                                isActive
                                                    ? 'bg-primary text-primary-foreground font-semibold shadow-2xs'
                                                    : 'text-foreground/80 hover:bg-muted hover:text-foreground'
                                            }`}
                                        >
                                            <span>{item.title}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </aside>

                        {/* Right Main Content Card */}
                        <div className="lg:col-span-9 col-span-1">
                            <div className="rounded-xl border border-border bg-card p-6 sm:p-8 shadow-2xs space-y-6">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
