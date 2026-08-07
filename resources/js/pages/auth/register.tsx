import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { login } from '@/routes';
import { store } from '@/routes/register';

type Props = {
    passwordRules: string;
};

export default function Register({ passwordRules }: Props) {
    return (
        <>
            <Head title="Daftar Anggota" />
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-5">
                            {/* Nama Lengkap */}
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nama Lengkap</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Nama sesuai KTP"
                                />
                                <InputError message={errors.name} />
                            </div>

                            {/* Email */}
                            <div className="grid gap-2">
                                <Label htmlFor="email">Alamat Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="email@contoh.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            {/* Nomor Telepon */}
                            <div className="grid gap-2">
                                <Label htmlFor="phone">Nomor Telepon</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    required
                                    tabIndex={3}
                                    autoComplete="tel"
                                    name="phone"
                                    placeholder="08xxxxxxxxxx"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Diawali 08, terdiri dari 10–13 digit
                                </p>
                                <InputError message={errors.phone} />
                            </div>

                            {/* NIK */}
                            <div className="grid gap-2">
                                <Label htmlFor="national_id">NIK (Nomor Induk Kependudukan)</Label>
                                <Input
                                    id="national_id"
                                    type="text"
                                    required
                                    tabIndex={4}
                                    name="national_id"
                                    placeholder="16 digit NIK sesuai KTP"
                                    maxLength={16}
                                    inputMode="numeric"
                                    pattern="\d{16}"
                                />
                                <p className="text-xs text-muted-foreground">
                                    NIK digunakan untuk verifikasi keanggotaan oleh pengurus
                                </p>
                                <InputError message={errors.national_id} />
                            </div>

                            {/* Alamat */}
                            <div className="grid gap-2">
                                <Label htmlFor="address">Alamat Lengkap</Label>
                                <Textarea
                                    id="address"
                                    required
                                    tabIndex={5}
                                    name="address"
                                    placeholder="RT/RW, Dusun, Desa, Kecamatan, Kabupaten"
                                    rows={3}
                                />
                                <InputError message={errors.address} />
                            </div>

                            {/* Password */}
                            <div className="grid gap-2">
                                <Label htmlFor="password">Kata Sandi</Label>
                                <PasswordInput
                                    id="password"
                                    required
                                    tabIndex={6}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Kata sandi"
                                    passwordrules={passwordRules}
                                />
                                <InputError message={errors.password} />
                            </div>

                            {/* Konfirmasi Password */}
                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">Konfirmasi Kata Sandi</Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    required
                                    tabIndex={7}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Ulangi kata sandi"
                                    passwordrules={passwordRules}
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 w-full"
                                tabIndex={8}
                                data-test="register-user-button"
                            >
                                {processing && <Spinner />}
                                Daftar Sebagai Anggota
                            </Button>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            Sudah punya akun?{' '}
                            <TextLink href={login()} tabIndex={9}>
                                Masuk
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

Register.layout = {
    title: 'Daftar Anggota Koperasi',
    description: 'Isi data diri Anda untuk mendaftar sebagai anggota koperasi',
};
