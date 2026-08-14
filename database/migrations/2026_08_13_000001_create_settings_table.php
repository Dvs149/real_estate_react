<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->timestamps();
        });

        // Seed default contact settings
        DB::table('settings')->insert([
            ['key' => 'site_address', 'value' => 'Sindhu Bhavan Road, Bodakdev, Ahmedabad, Gujarat 380054', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'site_phone', 'value' => '+91 98765 43210 / +91 79 4000 8888', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'site_email', 'value' => 'divyesh@dvsrealty.com', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'site_working_hours', 'value' => 'Mon - Sat: 9:00 AM - 8:00 PM IST', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
