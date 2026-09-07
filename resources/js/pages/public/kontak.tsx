import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { useState, FormEvent } from 'react';
import PublicLayout from '@/layouts/public-layout';

export default function KontakPage() {
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        message: '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <PublicLayout title="Kontak & Bantuan">
            {/* Header Banner */}
            <section className="section-padding-x py-8 md:py-10 bg-primary text-primary-foreground border-b border-primary/20">
                <div className="container max-w-5xl text-center md:text-left">
                    <span className="inline-block rounded-md bg-white/10 px-3 py-0.5 small-font-size font-semibold text-white/90 mb-2">
                        Informasi & Lainnya
                    </span>
                    <h1 className="font-heading title-font-size font-extrabold tracking-tight">
                        Hubungi Pengurus & Support
                    </h1>
                    <p className="mt-2 text-primary-foreground/90 leading-relaxed max-w-2xl">
                        Punya pertanyaan seputar keanggotaan, sewa aset desa, atau bantuan teknis platform RembugKop.id? Kami siap membantu.
                    </p>
                </div>
            </section>

            {/* Main Content (max-w-5xl) */}
            <section className="section-padding-x py-8 md:py-12 bg-background">
                <div className="container max-w-5xl space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 items-start">
                        {/* Left Column — Contact Information & Map */}
                        <div className="space-y-6">
                            <div>
                                <h2 className="font-heading subtitle-font-size font-bold text-foreground">
                                    Sekretariat Koperasi Desa
                                </h2>
                                <p className="mt-1.5 text-muted-foreground leading-relaxed">
                                    Anda dapat datang langsung ke balai desa atau menghubungi pengurus melalui informasi berikut:
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3.5 p-4 rounded-xl border border-border bg-card shadow-2xs">
                                    <MapPin className="size-5 text-primary shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-foreground">Alamat Kantor</h4>
                                        <p className="text-muted-foreground mt-0.5 leading-relaxed">
                                            Gedung Balai Desa & Koperasi RembugKop, Jalan Raya Desa No. 1, Kabupaten / Kota.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3.5 p-4 rounded-xl border border-border bg-card shadow-2xs">
                                    <Clock className="size-5 text-secondary shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-foreground">Jam Operasional Layanan</h4>
                                        <p className="text-muted-foreground mt-0.5 leading-relaxed">
                                            Senin - Jumat: 08.00 - 15.00 WIB
                                            <br />
                                            Sabtu (Musyawarah): 09.00 - 12.00 WIB
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3.5 p-4 rounded-xl border border-border bg-card shadow-2xs">
                                    <Phone className="size-5 text-primary shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-foreground">Telepon / WhatsApp</h4>
                                        <p className="text-muted-foreground mt-0.5 leading-relaxed">
                                            +62 812-3456-7890 (Pengurus Koperasi)
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3.5 p-4 rounded-xl border border-border bg-card shadow-2xs">
                                    <Mail className="size-5 text-secondary shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-foreground">Email Bantuan</h4>
                                        <p className="text-muted-foreground mt-0.5 leading-relaxed">
                                            bantuan@rembugkop.id
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Google Maps Embed */}
                            <div className="space-y-2.5 pt-2">
                                <h3 className="font-heading font-bold text-foreground flex items-center gap-2">
                                    <MapPin className="size-5 text-primary" />
                                    Lokasi Peta Digital
                                </h3>
                                <div className="overflow-hidden rounded-xl border border-border bg-muted aspect-video relative shadow-2xs">
                                    <iframe
                                        title="Lokasi Koperasi Desa RembugKop"
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15814.776077364654!2d110.2037513!3d-7.6078693!2m3!1f0!0f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a8cf06a292199%3A0x183416e7208d0e51!2sBorobudur%20Temple!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        className="w-full h-full"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Column — Contact Form */}
                        <div className="rounded-xl border border-border bg-card p-6 sm:p-8 shadow-2xs space-y-5">
                            <h3 className="font-heading subtitle-font-size font-bold text-foreground">
                                Kirim Pesan / Pertanyaan
                            </h3>

                            {submitted ? (
                                <div className="rounded-lg bg-primary/10 p-6 border border-primary/30 text-center space-y-2.5">
                                    <div className="inline-flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground mb-1 font-bold">
                                        ✓
                                    </div>
                                    <h4 className="font-heading font-bold text-foreground">Pesan Berhasil Terkirim!</h4>
                                    <p className="text-muted-foreground leading-relaxed">
                                        Terima kasih. Pesan Anda telah diterima oleh pengurus koperasi dan akan segera ditindaklanjuti.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => setSubmitted(false)}
                                        className="font-bold text-primary underline pt-2 inline-block"
                                    >
                                        Kirim pesan lain
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block font-bold text-foreground mb-1.5">
                                            Nama Lengkap / Anggota
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Masukkan nama Anda"
                                            className="w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-bold text-foreground mb-1.5">
                                            Nomor Telepon / WA
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="Contoh: 08123456789"
                                            className="w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-bold text-foreground mb-1.5">
                                            Pesan / Pertanyaan
                                        </label>
                                        <textarea
                                            rows={4}
                                            required
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            placeholder="Tuliskan pertanyaan atau keluhan Anda di sini..."
                                            className="w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 font-bold text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 focus:outline-none"
                                    >
                                        <Send className="size-4" />
                                        Kirim Pesan
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
