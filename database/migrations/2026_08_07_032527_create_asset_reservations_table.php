<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('asset_reservations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('asset_id')->constrained('assets')->restrictOnDelete();
            $table->foreignId('user_id')->constrained('users')->restrictOnDelete(); // renter
            $table->timestamp('start_datetime');
            $table->timestamp('end_datetime');
            $table->enum('duration_type', ['hourly', 'daily']);
            $table->decimal('calculated_price', 15, 2);
            $table->enum('status', ['pending', 'approved', 'ongoing', 'completed', 'cancelled', 'rejected'])->default('pending');
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->text('notes')->nullable();
            $table->timestamps();

            // Index for overlap detection query
            $table->index(['asset_id', 'start_datetime', 'end_datetime']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('asset_reservations');
    }
};
