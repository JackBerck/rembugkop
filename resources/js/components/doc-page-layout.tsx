import { ReactNode, useState, useEffect } from 'react';
import PublicLayout from '@/layouts/public-layout';
import { ChevronDown, ListFilter } from 'lucide-react';

export interface DocSection {
    id: string;
    title: string;
}

interface DocPageLayoutProps {
    title: string;
    description?: string;
    sections: DocSection[];
    children: ReactNode;
}

export default function DocPageLayout({ title, description, sections, children }: DocPageLayoutProps) {
    const [activeSectionId, setActiveSectionId] = useState<string>(sections[0]?.id || '');

    const scrollToSection = (id: string) => {
        setActiveSectionId(id);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 120;
            for (const section of sections) {
                const element = document.getElementById(section.id);
                if (element) {
                    const top = element.offsetTop;
                    const height = element.offsetHeight;
                    if (scrollPosition >= top && scrollPosition < top + height) {
                        setActiveSectionId(section.id);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [sections]);

    return (
        <PublicLayout title={title}>
            {/* Header Banner */}
            <section className="section-padding-x py-8 md:py-10 bg-primary text-primary-foreground border-b border-primary/20">
                <div className="container max-w-7xl">
                    <div className="max-w-3xl">
                        <span className="inline-block rounded-md bg-white/10 px-2.5 py-0.5 small-font-size font-semibold text-white/90 mb-2">
                            Informasi & Lainnya
                        </span>
                        <h1 className="font-heading title-font-size font-extrabold tracking-tight">
                            {title}
                        </h1>
                        {description && (
                            <p className="mt-2 text-primary-foreground/90 leading-relaxed">
                                {description}
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {/* Content Area */}
            <section className="section-padding-x py-6 bg-muted/30">
                <div className="container max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* Mobile Dropdown Section Navigator */}
                        <div className="lg:hidden col-span-1">
                            <label className="block small-font-size font-bold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5">
                                <ListFilter className="size-3.5" />
                                Pilih Topik / Seksi Halaman
                            </label>
                            <div className="relative">
                                <select
                                    value={activeSectionId}
                                    onChange={(e) => scrollToSection(e.target.value)}
                                    className="w-full appearance-none rounded-lg border border-border bg-card px-3.5 py-2.5 font-medium text-foreground shadow-2xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                >
                                    {sections.map((sec) => (
                                        <option key={sec.id} value={sec.id}>
                                            {sec.title}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-3.5 top-3 size-4 text-muted-foreground" />
                            </div>
                        </div>

                        {/* Desktop Left Sidebar Section List */}
                        <aside className="hidden lg:block lg:col-span-3 sticky top-20">
                            <div className="rounded-xl border border-border bg-card p-3 shadow-2xs space-y-1">
                                <div className="px-3 py-2 small-font-size font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                                    <ListFilter className="size-3.5" />
                                    Daftar Isi Seksi
                                </div>
                                {sections.map((sec) => {
                                    const isActive = activeSectionId === sec.id;
                                    return (
                                        <button
                                            key={sec.id}
                                            type="button"
                                            onClick={() => scrollToSection(sec.id)}
                                            className={`w-full text-left rounded-lg px-3.5 py-2.5 small-font-size font-semibold transition-all ${
                                                isActive
                                                    ? 'bg-primary text-primary-foreground shadow-2xs'
                                                    : 'text-foreground/80 hover:bg-muted hover:text-foreground'
                                            }`}
                                        >
                                            {sec.title}
                                        </button>
                                    );
                                })}
                            </div>
                        </aside>

                        {/* Right Content */}
                        <div className="lg:col-span-9 col-span-1">
                            <div className="rounded-xl border border-border bg-card p-6 sm:p-8 shadow-2xs space-y-8">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
