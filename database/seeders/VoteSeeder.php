<?php

namespace Database\Seeders;

use App\Enums\ProposalStatus;
use App\Enums\VoteChoice;
use App\Models\Proposal;
use App\Models\User;
use App\Models\Vote;
use Illuminate\Database\Seeder;

class VoteSeeder extends Seeder
{
    public function run(): void
    {
        // Only seed votes for proposals that have voting open/closed
        $votableStatuses = [ProposalStatus::Open, ProposalStatus::Approved, ProposalStatus::Rejected, ProposalStatus::Executed];
        $proposals = Proposal::whereIn('status', array_map(fn ($s) => $s->value, $votableStatuses))->get();
        $voters = User::where('role', 'anggota')->get();

        foreach ($proposals as $proposal) {
            // Track which users already voted (enforce unique constraint)
            $votedUserIds = [];

            // Random subset of anggota vote on each proposal
            $voterSubset = $voters->random(min($voters->count(), rand(15, 35)));

            foreach ($voterSubset as $voter) {
                if (in_array($voter->id, $votedUserIds)) {
                    continue;
                }

                // Bias towards agree for approved/executed, disagree for rejected
                $choice = match ($proposal->status) {
                    ProposalStatus::Approved, ProposalStatus::Executed => fake()->randomElement([
                        VoteChoice::Agree, VoteChoice::Agree, VoteChoice::Agree, VoteChoice::Disagree,
                    ]),
                    ProposalStatus::Rejected => fake()->randomElement([
                        VoteChoice::Agree, VoteChoice::Disagree, VoteChoice::Disagree, VoteChoice::Disagree,
                    ]),
                    default => fake()->randomElement(VoteChoice::cases()),
                };

                Vote::create([
                    'proposal_id' => $proposal->id,
                    'user_id' => $voter->id,
                    'choice' => $choice,
                    'voted_at' => fake()->dateTimeBetween(
                        $proposal->voting_start ?? '-1 month',
                        min($proposal->voting_end ?? 'now', 'now')
                    )->format('Y-m-d H:i:s'),
                ]);

                $votedUserIds[] = $voter->id;
            }
        }
    }
}
