<?php

namespace App\Console\Commands;

use App\Enums\ReservationStatus;
use App\Models\AssetReservation;
use Illuminate\Console\Command;

class UpdateReservationStatuses extends Command
{
    /**
     * @var string
     */
    protected $signature = 'reservations:update-statuses';

    /**
     * @var string
     */
    protected $description = 'Auto-update reservation statuses: approved→ongoing (past start_datetime) and ongoing→completed (past end_datetime)';

    public function handle(): int
    {
        $toOngoing = AssetReservation::where('status', ReservationStatus::Approved)
            ->where('start_datetime', '<=', now())
            ->update(['status' => ReservationStatus::Ongoing]);

        $toCompleted = AssetReservation::where('status', ReservationStatus::Ongoing)
            ->where('end_datetime', '<=', now())
            ->update(['status' => ReservationStatus::Completed]);

        $this->info("Reservasi diperbarui: {$toOngoing} → ongoing, {$toCompleted} → completed.");

        return self::SUCCESS;
    }
}
