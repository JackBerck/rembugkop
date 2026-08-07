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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reservation_id')->constrained('asset_reservations')->restrictOnDelete();
            $table->decimal('amount', 15, 2);
            $table->enum('method', ['manual', 'gateway']);
            $table->string('gateway_provider')->nullable();
            $table->string('gateway_transaction_id')->nullable()->unique();
            $table->string('gateway_status')->nullable(); // raw status from gateway provider
            $table->enum('status', ['pending', 'paid', 'failed', 'refunded'])->default('pending');
            $table->foreignId('recorded_by')->nullable()->constrained('users')->nullOnDelete(); // for manual payments
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
