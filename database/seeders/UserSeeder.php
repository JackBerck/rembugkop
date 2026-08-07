<?php

namespace Database\Seeders;

use App\Models\MemberProfile;
use App\Models\User;
use Database\Factories\MemberProfileFactory;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Reset sequence counter for MemberProfileFactory
        // 1 super_admin
        $admin = User::factory()->superAdmin()->create([
            'name' => 'Administrator Koperasi',
            'email' => 'admin@rembugkop.id',
            'phone' => '081234567890',
        ]);

        // 5 pengurus (board members)
        $pengurusList = User::factory()->pengurus()->count(5)->create();

        // 40 anggota (regular members)
        $anggotaList = User::factory()->count(40)->create();

        // Create member profiles for all users
        // Admin gets a profile too
        $allUsers = collect([$admin])->merge($pengurusList)->merge($anggotaList);
        $verifiers = collect([$admin])->merge($pengurusList);

        foreach ($allUsers as $index => $user) {
            $verifier = $verifiers->random();

            MemberProfile::factory()
                ->verifiedBy($verifier)
                ->create([
                    'user_id' => $user->id,
                    'verified_by' => $verifier->id,
                ]);
        }

        // Add a few pending/rejected profiles (create extra users)
        $pendingUsers = User::factory()->count(3)->create();
        foreach ($pendingUsers as $user) {
            MemberProfile::factory()->pending()->create(['user_id' => $user->id]);
        }

        $rejectedUsers = User::factory()->count(2)->create();
        foreach ($rejectedUsers as $user) {
            MemberProfile::factory()->rejected()->create(['user_id' => $user->id]);
        }
    }
}
