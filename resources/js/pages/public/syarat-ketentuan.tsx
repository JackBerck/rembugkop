import DocPageLayout, { DocSection } from '@/components/doc-page-layout';
import { Scale, CheckSquare, AlertCircle, Calendar, Info } from 'lucide-react';

const sections: DocSection[] = [
    { id: 'pengantar-ketentuan', title: 'Ketentuan Umum' },
    { id: 'syarat-keanggotaan', title: '1. Syarat Keanggotaan' },
    { id: 'sewa-aset', title: '2. Aturan Sewa Aset Desa' },
    { id: 'rembug-digital', title: '3. Rembug Digital & Voting' },
    { id: 'larangan-sanksi', title: '4. Larangan & Sanksi' },
];

export default function SyaratKetentuanPage() {
    return (
        <DocPageLayout
            title="Syarat & Ketentuan Layanan"
            description="Tata tertib penggunaan platform, keanggotaan warga, dan aturan peminjaman aset produktif desa."
            sections={sections}
        >
            <div className="small-font-size text-muted-foreground border-b border-border pb-3">
                Berlaku untuk seluruh warga desa terdaftar dan pengurus koperasi.
            </div>

            {/* Pengantar */}
            <div id="pengantar-ketentuan" className="scroll-mt-24 space-y-3">
                <h3 className="font-heading subtitle-font-size font-bold text-foreground flex items-center gap-2">
                    <Info className="size-5 text-primary" />
                    Ketentuan Umum
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                    Syarat & ketentuan ini mengatur tata tertib pemanfaatan platform RembugKop.id, tata cara sewa aset produktif desa, serta hak dan kewajiban warga sebagai anggota koperasi.
                </p>
            </div>

            {/* Seksi 1 */}
            <div id="syarat-keanggotaan" className="scroll-mt-24 space-y-3 pt-6 border-t border-border/60">
                <h3 className="font-heading subtitle-font-size font-bold text-foreground flex items-center gap-2">
                    <CheckSquare className="size-5 text-primary" />
                    1. Syarat Keanggotaan Warga
                </h3>
                <ul className="list-disc pl-5 text-muted-foreground space-y-1.5 leading-relaxed">
                    <li>Anggota merupakan warga terdaftar yang dibuktikan dengan NIK / KTP domisili desa setempat.</li>
                    <li>Setiap anggota wajib memberikan informasi identitas yang jujur dan benar.</li>
                    <li>Verifikasi status anggota dilakukan oleh pengurus sebelum pengguna dapat menyewa aset.</li>
                </ul>
            </div>

            {/* Seksi 2 */}
            <div id="sewa-aset" className="scroll-mt-24 space-y-3 pt-6 border-t border-border/60">
                <h3 className="font-heading subtitle-font-size font-bold text-foreground flex items-center gap-2">
                    <Calendar className="size-5 text-secondary" />
                    2. Aturan Peminjaman & Sewa Aset Desa
                </h3>
                <ul className="list-disc pl-5 text-muted-foreground space-y-1.5 leading-relaxed">
                    <li>Pemesanan sewa aset (traktor, mesin giling, gedung) dilakukan melalui kalender terpadu.</li>
                    <li>Tarif sewa ditentukan transparan berdasarkan keputusan musyawarah koperasi desa.</li>
                    <li>Penyewa wajib menjaga keutuhan dan kebersihan aset selama masa peminjaman.</li>
                    <li>Kerusakan akibat kelalaian pemakaian wajib diganti rugi sesuai keputusan pengurus.</li>
                </ul>
            </div>

            {/* Seksi 3 */}
            <div id="rembug-digital" className="scroll-mt-24 space-y-3 pt-6 border-t border-border/60">
                <h3 className="font-heading subtitle-font-size font-bold text-foreground flex items-center gap-2">
                    <Scale className="size-5 text-primary" />
                    3. Musyawarah & Voting Rembug Digital
                </h3>
                <ul className="list-disc pl-5 text-muted-foreground space-y-1.5 leading-relaxed">
                    <li>Satu anggota terverifikasi berhak memberikan 1 (satu) suara pada proposal aktif.</li>
                    <li>Hasil voting bersifat final setelah periode musyawarah ditutup oleh pengurus.</li>
                </ul>
            </div>

            {/* Seksi 4 (Larangan / Merah) */}
            <div id="larangan-sanksi" className="scroll-mt-24 space-y-3 pt-6 border-t border-border/60 p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                <h3 className="font-heading subtitle-font-size font-bold text-destructive flex items-center gap-2">
                    <AlertCircle className="size-5 text-destructive" />
                    4. Larangan & Sanksi Pembatalan
                </h3>
                <ul className="list-disc pl-5 text-destructive/90 space-y-1.5 leading-relaxed">
                    <li>Dilarang keras memalsukan identitas NIK/KTP atau melakukan pemesanan ganda secara manipulatif.</li>
                    <li>Dilarang memindahtangankan hak sewa aset kepada pihak di luar warga desa tanpa izin pengurus.</li>
                    <li>Pelanggaran terhadap aturan ini berakibat pada pembatalan reservasi dan penonaktifan akun keanggotaan.</li>
                </ul>
            </div>
        </DocPageLayout>
    );
}
