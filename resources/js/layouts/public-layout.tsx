import { Head } from '@inertiajs/react';
import { ReactNode } from 'react';
import PublicFooter from '@/components/public-footer';
import PublicNavbar from '@/components/public-navbar';

interface PublicLayoutProps {
    children: ReactNode;
    title?: string;
}

export default function PublicLayout({ children, title }: PublicLayoutProps) {
    const pageTitle = title ? `${title} - RembugKop.id` : 'RembugKop.id - Satu Rembug, Transparan Pengelolaannya';

    return (
        <>
            <Head title={pageTitle} />
            <div className="flex min-h-screen flex-col bg-background text-foreground font-body antialiased selection:bg-primary/20 selection:text-primary">
                <PublicNavbar />
                <main className="flex-1">{children}</main>
                <PublicFooter />
            </div>
        </>
    );
}
