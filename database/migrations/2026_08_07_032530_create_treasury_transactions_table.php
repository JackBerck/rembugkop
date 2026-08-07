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
        Schema::create('treasury_transactions', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['income', 'expense']);
            $table->enum('category', ['asset_rental', 'dues', 'asset_procurement', 'operational', 'other']);
            $table->decimal('amount', 15, 2);
            $table->text('description');
            $table->string('reference_type')->nullable(); // polymorphic: Payment, Proposal, etc.
            $table->unsignedBigInteger('reference_id')->nullable();
            $table->foreignId('recorded_by')->constrained('users')->restrictOnDelete();
            $table->date('transaction_date');
            $table->string('previous_hash')->nullable(); // hash-chain: previous record's hash
            $table->string('hash'); // SHA-256(data + previous_hash)
            $table->timestamp('created_at')->useCurrent();

            $table->index('transaction_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('treasury_transactions');
    }
};
