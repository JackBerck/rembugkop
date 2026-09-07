import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQGroup {
    category: string;
    description: string;
    items: FAQItem[];
}

const faqGroups: FAQGroup[] = [
    {
        category: 'Keanggotaan & Pendaftaran',
        description: 'Informasi syarat pendaftaran warga dan status keanggotaan terverifikasi.',
        items: [
            {
                question: 'Siapa saja yang bisa mendaftar menjadi anggota RembugKop.id?',
                answer: 'Seluruh warga desa yang memiliki NIK/KTP resmi serta terdaftar di wilayah desa setempat dapat mendaftar. Setelah mendaftar, pengurus akan memverifikasi identitas Anda.',
            },
            {
                question: 'Apakah pendaftaran akun warga dipungut biaya?',
                answer: 'Pendaftaran akun digital tidak dipungut biaya. Ketentuan simpanan pokok atau simpanan wajib keanggotaan tetap mengikuti aturan AD/ART koperasi desa setempat.',
            },
        ],
    },
    {
        category: 'Sewa & Peminjaman Aset Desa',
        description: 'Petunjuk menyewa aset fisik seperti traktor, mesin giling, atau gedung serbaguna.',
        items: [
            {
                question: 'Bagaimana cara menyewa aset produktif desa?',
                answer: 'Buka menu Katalog Aset, pilih aset yang dibutuhkan, tentukan tanggal pada kalender interaktif yang masih kosong, kemudian kirimkan pengajuan reservasi.',
            },
            {
                question: 'Bagaimana jika tanggal yang saya inginkan sudah dipesan orang lain?',
                answer: 'Sistem kalender RembugKop secara otomatis mengunci tanggal yang sudah disetujui untuk mencegah pemesanan ganda (double-booking). Anda bisa memilih tanggal lain yang tersedia.',
            },
        ],
    },
    {
        category: 'Rembug Digital & Musyawarah',
        description: 'Tata cara berpartisipasi dalam voting proposal pengadaan aset dan kebijakan.',
        items: [
            {
                question: 'Apa itu Rembug Digital dan bagaimana cara berpartisipasi?',
                answer: 'Rembug Digital adalah ruang musyawarah & voting elektronik. Saat ada proposal pengadaan alat baru atau kebijakan desa, anggota terverifikasi berhak memberikan suara Setuju atau Menolak secara transparan.',
            },
        ],
    },
    {
        category: 'Transparansi Kas & Keuangan',
        description: 'Keterbukaan laporan keuangan dan hasil sewa aset bagi seluruh warga.',
        items: [
            {
                question: 'Bagaimana cara warga memantau arus kas koperasi?',
                answer: 'Laporan kas desa dan pemasukan sewa aset disajikan secara real-time pada dashboard transparansi publik yang bisa diakses dan diaudit oleh warga kapan saja.',
            },
            {
                question: 'Apakah data pribadi saya aman di platform ini?',
                answer: 'Ya, platform ini dilengkapi enkripsi SSL, dukungan Passkey, dan 2FA. Data pribadi warga tidak pernah diperjualbelikan kepada pihak ketiga.',
            },
        ],
    },
];

export default function FAQPage() {
    const [openGroupIndex, setOpenGroupIndex] = useState<string | null>('0-0');

    const toggleItem = (groupIdx: number, itemIdx: number) => {
        const key = `${groupIdx}-${itemIdx}`;
        setOpenGroupIndex(openGroupIndex === key ? null : key);
    };

    return (
        <PublicLayout title="Pertanyaan Sering Diajukan (FAQ)">
            {/* Header Banner Ringkas */}
            <section className="section-padding-x py-8 md:py-10 bg-primary text-primary-foreground border-b border-primary/20">
                <div className="container max-w-5xl text-center md:text-left">
                    <span className="inline-block rounded-md bg-white/10 px-3 py-0.5 small-font-size font-semibold text-white/90 mb-2">
                        Informasi & Lainnya
                    </span>
                    <h1 className="font-heading title-font-size font-extrabold tracking-tight">
                        Pertanyaan Sering Diajukan (FAQ)
                    </h1>
                    <p className="mt-2 text-primary-foreground/90 leading-relaxed max-w-2xl">
                        Jawaban lengkap seputar pendaftaran warga, sewa aset desa, musyawarah digital, dan kas terbuka.
                    </p>
                </div>
            </section>

            {/* Main Content (max-w-5xl) */}
            <section className="section-padding-x py-8 md:py-12 bg-background">
                <div className="container max-w-5xl space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        {faqGroups.map((group, groupIdx) => (
                            <div key={group.category} className="rounded-xl border border-border bg-card p-6 shadow-2xs space-y-4">
                                <div className="border-b border-border pb-3">
                                    <h3 className="font-heading subtitle-font-size font-bold text-foreground flex items-center gap-2">
                                        <HelpCircle className="size-5 text-primary" />
                                        {group.category}
                                    </h3>
                                    <p className="text-muted-foreground mt-1 leading-relaxed">{group.description}</p>
                                </div>

                                <div className="space-y-3">
                                    {group.items.map((item, itemIdx) => {
                                        const key = `${groupIdx}-${itemIdx}`;
                                        const isOpen = openGroupIndex === key;
                                        return (
                                            <div
                                                key={item.question}
                                                className="rounded-lg border border-border bg-background transition-colors overflow-hidden"
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() => toggleItem(groupIdx, itemIdx)}
                                                    className="w-full flex items-center justify-between gap-4 p-4 text-left focus:outline-none"
                                                >
                                                    <span className="font-heading font-bold text-foreground">
                                                        {item.question}
                                                    </span>
                                                    <ChevronDown
                                                        className={`size-5 text-muted-foreground transition-transform duration-200 shrink-0 ${
                                                            isOpen ? 'rotate-180 text-primary' : ''
                                                        }`}
                                                    />
                                                </button>
                                                {isOpen && (
                                                    <div className="px-4 pb-4 pt-1.5 border-t border-border/50 text-muted-foreground leading-relaxed animate-in fade-in-50">
                                                        {item.answer}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
