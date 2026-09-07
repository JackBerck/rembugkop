import DocPageLayout, { DocSection } from '@/components/doc-page-layout';
import { ShieldCheck, Lock, Eye, FileText, Info } from 'lucide-react';

const sections: DocSection[] = [
    { id: 'pengantar', title: 'Pengantar' },
    { id: 'pengumpulan-data', title: 'Data Pribadi Yang Dikumpulkan' },
    { id: 'pemrosesan-data', title: 'Proses Pengelolaan Data' },
    { id: 'keamanan-data', title: 'Keamanan & Perlindungan' },
    { id: 'hak-warga', title: 'Hak dan Pembaruan Data Warga' },
];

export default function KebijakanPrivasiPage() {
    return (
        <DocPageLayout
            title="Kebijakan Privasi & Pemrosesan Data"
            description="Ketentuan perlindungan data pribadi warga desa dan akuntabilitas penggunaan informasi di RembugKop.id."
            sections={sections}
        >
            <div className="small-font-size text-muted-foreground border-b border-border pb-3">
                Terakhir diperbarui: 7 September 2026 • Mengacu pada UU No. 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP).
            </div>

            {/* Seksi Pengantar */}
            <div id="pengantar" className="scroll-mt-24 space-y-3">
                <h3 className="font-heading subtitle-font-size font-bold text-foreground flex items-center gap-2">
                    <Info className="size-5 text-primary" />
                    Pengantar
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                    Kebijakan privasi ini merupakan komitmen RembugKop.id dalam menjamin kerahasiaan, keutuhan, dan keamanan data pribadi warga desa terdaftar. Kami memastikan seluruh pemrosesan data dilakukan secara sah, transparan, dan dapat dipertanggungjawabkan demi perlindungan hak-hak masyarakat desa.
                </p>
            </div>

            {/* Seksi 1 */}
            <div id="pengumpulan-data" className="scroll-mt-24 space-y-3 pt-6 border-t border-border/60">
                <h3 className="font-heading subtitle-font-size font-bold text-foreground flex items-center gap-2">
                    <FileText className="size-5 text-primary" />
                    Data Pribadi Yang Dikumpulkan
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                    RembugKop.id hanya mengumpulkan data pribadi yang relevan untuk kebutuhan verifikasi keanggotaan dan peminjaman aset desa:
                </p>
                <ul className="list-disc pl-5 text-muted-foreground space-y-1.5 leading-relaxed">
                    <li>Nama lengkap, NIK KTP domisili desa, dan alamat tempat tinggal.</li>
                    <li>Nomor telepon / WhatsApp aktif untuk konfirmasi pemesanan sewa aset.</li>
                    <li>Riwayat reservasi aset produktif dan catatan partisipasi dalam musyawarah voting digital.</li>
                </ul>
            </div>

            {/* Seksi 2 */}
            <div id="pemrosesan-data" className="scroll-mt-24 space-y-3 pt-6 border-t border-border/60">
                <h3 className="font-heading subtitle-font-size font-bold text-foreground flex items-center gap-2">
                    <Eye className="size-5 text-secondary" />
                    Proses Pengelolaan Data Pribadi
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                    Informasi pribadi warga desa digunakan secara terbatas untuk kepentingan internal koperasi:
                </p>
                <ul className="list-disc pl-5 text-muted-foreground space-y-1.5 leading-relaxed">
                    <li>Memverifikasi identitas warga desa agar berhak menyewa aset dan memberikan voting musyawarah.</li>
                    <li>Mencegah bentrok jadwal pemesanan aset produktif desa pada sistem kalender.</li>
                    <li>Menyajikan transparansi pencatatan kas secara real-time dan terbuka bagi anggota.</li>
                </ul>
            </div>

            {/* Seksi 3 */}
            <div id="keamanan-data" className="scroll-mt-24 space-y-3 pt-6 border-t border-border/60">
                <h3 className="font-heading subtitle-font-size font-bold text-foreground flex items-center gap-2">
                    <Lock className="size-5 text-primary" />
                    Keamanan & Perlindungan Data
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                    Kami menggunakan enkripsi SSL/HTTPS, Passkey, dan Autentikasi Dua Langkah (2FA). Data pribadi warga <strong>tidak pernah diperjualbelikan</strong> kepada pihak ketiga atau pengiklan luar.
                </p>
            </div>

            {/* Seksi 4 */}
            <div id="hak-warga" className="scroll-mt-24 space-y-3 pt-6 border-t border-border/60">
                <h3 className="font-heading subtitle-font-size font-bold text-foreground flex items-center gap-2">
                    <ShieldCheck className="size-5 text-secondary" />
                    Hak dan Pembaruan Data Warga
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                    Warga desa berhak mengajukan pembaruan data profil atau penutupan akun apabila sudah tidak lagi menjadi anggota terdaftar melalui pengurus koperasi.
                </p>
            </div>
        </DocPageLayout>
    );
}
