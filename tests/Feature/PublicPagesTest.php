<?php

use function Pest\Laravel\get;

it('displays the home landing page', function () {
    get('/')
        ->assertStatus(200)
        ->assertInertia(fn ($page) => $page->component('welcome'));
});

it('displays the kontak page', function () {
    get('/kontak')
        ->assertStatus(200)
        ->assertInertia(fn ($page) => $page->component('public/kontak'));
});

it('displays the faq page', function () {
    get('/faq')
        ->assertStatus(200)
        ->assertInertia(fn ($page) => $page->component('public/faq'));
});

it('displays the kebijakan privasi page', function () {
    get('/kebijakan-privasi')
        ->assertStatus(200)
        ->assertInertia(fn ($page) => $page->component('public/kebijakan-privasi'));
});

it('displays the syarat ketentuan page', function () {
    get('/syarat-ketentuan')
        ->assertStatus(200)
        ->assertInertia(fn ($page) => $page->component('public/syarat-ketentuan'));
});

it('displays the panduan penggunaan page', function () {
    get('/panduan-penggunaan')
        ->assertStatus(200)
        ->assertInertia(fn ($page) => $page->component('public/panduan-penggunaan'));
});
