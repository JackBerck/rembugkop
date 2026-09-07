export interface NavItem {
    title: string;
    href: string;
    routeName?: string;
    description?: string;
    badge?: string;
    isExternal?: boolean;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export const mainNavItems: NavItem[] = [
    {
        title: 'Beranda',
        href: '/',
        routeName: 'home',
        description: 'Halaman utama platform RembugKop.id',
    },
    {
        title: 'Katalog Aset',
        href: '/aset',
        routeName: 'asset-catalog',
        description: 'Katalog utilitas aset fisik milik desa/koperasi',
    },
];

export const infoNavItems: NavItem[] = [
    {
        title: 'Kontak',
        href: '/kontak',
        routeName: 'kontak',
        description: 'Hubungi pengurus koperasi dan lokasi balai desa',
    },
    {
        title: 'FAQ',
        href: '/faq',
        routeName: 'faq',
        description: 'Pertanyaan umum seputar layanan, sewa aset, dan kas',
    },
    {
        title: 'Kebijakan Privasi',
        href: '/kebijakan-privasi',
        routeName: 'kebijakan-privasi',
        description: 'Perlindungan data dan transparansi penggunaan informasi',
    },
    {
        title: 'Syarat & Ketentuan',
        href: '/syarat-ketentuan',
        routeName: 'syarat-ketentuan',
        description: 'Ketentuan layanan, keanggotaan, dan tata tertib sewa',
    },
    {
        title: 'Panduan Penggunaan',
        href: '/panduan-penggunaan',
        routeName: 'panduan-penggunaan',
        description: 'Petunjuk langkah demi langkah bagi warga & pengurus',
    },
];

export const footerNavGroups: NavGroup[] = [
    {
        title: 'Menu Utama',
        items: mainNavItems,
    },
    {
        title: 'Informasi & Lainnya',
        items: infoNavItems,
    },
];
