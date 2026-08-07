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
        Schema::create('proposals', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->enum('type', ['asset_procurement', 'policy', 'other']);
            $table->foreignId('related_asset_id')->nullable()->constrained('assets')->nullOnDelete();
            $table->foreignId('proposed_by')->constrained('users')->restrictOnDelete();
            $table->enum('status', ['draft', 'open', 'approved', 'rejected', 'executed'])->default('draft');
            $table->timestamp('voting_start')->nullable();
            $table->timestamp('voting_end')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('proposals');
    }
};
