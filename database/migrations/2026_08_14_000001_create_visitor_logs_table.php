<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('visitor_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->string('ip_address', 45);
            $table->string('country')->default('Unknown');
            $table->string('state')->default('Unknown');
            $table->string('city')->default('Unknown');
            $table->string('timezone')->default('UTC');
            $table->string('device_type')->default('Desktop');
            $table->string('os')->default('Unknown');
            $table->string('browser')->default('Unknown');
            $table->string('browser_version')->nullable();
            $table->string('screen_resolution')->nullable();
            $table->string('language')->default('en-US');
            $table->text('referrer_url')->nullable();
            $table->string('landing_page')->default('/');
            $table->string('page_url')->default('/');
            $table->string('utm_params')->nullable();
            $table->string('session_id')->nullable();
            $table->string('visitor_status')->default('New Visitor'); // 'New Visitor' or 'Returning Visitor'
            $table->text('user_agent')->nullable();
            $table->timestamps();

            $table->index(['ip_address', 'created_at']);
            $table->index(['session_id', 'created_at']);
            $table->index(['user_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('visitor_logs');
    }
};
