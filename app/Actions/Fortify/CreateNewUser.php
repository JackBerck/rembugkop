<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Enums\VerificationStatus;
use App\Models\MemberProfile;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user (anggota role only).
     * Wraps User + MemberProfile creation in a DB transaction for atomicity.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'phone' => ['required', 'string', 'regex:/^08[0-9]{8,11}$/'],
            'password' => $this->passwordRules(),
            'national_id' => ['required', 'digits:16'],
            'address' => ['required', 'string', 'max:500'],
        ], [
            'phone.regex' => 'Nomor telepon harus diawali 08 dan terdiri dari 10-13 digit.',
            'national_id.digits' => 'NIK harus terdiri dari 16 digit angka.',
        ])->validate();

        return DB::transaction(function () use ($input): User {
            $user = User::create([
                'name' => $input['name'],
                'email' => $input['email'],
                'phone' => $input['phone'],
                'password' => Hash::make($input['password']),
                'role' => UserRole::Anggota,
                'status' => UserStatus::Active,
            ]);

            $user->memberProfile()->create([
                'member_number' => 'KOP-'.date('Y').'-'.str_pad(
                    (string) (MemberProfile::max('id') + 1),
                    4,
                    '0',
                    STR_PAD_LEFT
                ),
                'national_id' => $input['national_id'], // encrypted via model cast
                'address' => $input['address'],
                'joined_at' => now()->toDateString(),
                'principal_savings' => 100000.00,
                'mandatory_savings_total' => 0.00,
                'verification_status' => VerificationStatus::Pending,
                'verified_by' => null,
                'verified_at' => null,
            ]);

            return $user;
        });
    }
}
