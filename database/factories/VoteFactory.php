<?php

namespace Database\Factories;

use App\Enums\VoteChoice;
use App\Models\Proposal;
use App\Models\User;
use App\Models\Vote;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Vote>
 */
class VoteFactory extends Factory
{
    public function definition(): array
    {
        return [
            'proposal_id' => Proposal::factory()->open(),
            'user_id' => User::factory(),
            'choice' => fake()->randomElement(VoteChoice::cases()),
            'voted_at' => fake()->dateTimeBetween('-2 weeks', 'now')->format('Y-m-d H:i:s'),
        ];
    }

    public function agree(): static
    {
        return $this->state(fn (array $attributes) => [
            'choice' => VoteChoice::Agree,
        ]);
    }

    public function disagree(): static
    {
        return $this->state(fn (array $attributes) => [
            'choice' => VoteChoice::Disagree,
        ]);
    }
}
