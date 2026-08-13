<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Property Types
        Schema::create('property_types', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('icon')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // Locations (Cities / Regions)
        Schema::create('locations', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('city');
            $table->string('state')->nullable();
            $table->string('country')->default('India');
            $table->string('image')->nullable();
            $table->boolean('is_popular')->default(false);
            $table->timestamps();
        });

        // Amenities
        Schema::create('amenities', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('category')->default('General'); // General, Security, Luxury, Eco
            $table->string('icon')->nullable();
            $table->timestamps();
        });

        // Agents
        Schema::create('agents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('email');
            $table->string('phone');
            $table->string('agency_name')->default('DVS Premier Realty');
            $table->integer('experience_years')->default(5);
            $table->decimal('rating', 3, 2)->default(4.90);
            $table->string('avatar')->nullable();
            $table->text('bio')->nullable();
            $table->json('social_links')->nullable();
            $table->timestamps();
        });

        // Properties
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->foreignId('property_type_id')->constrained()->onDelete('cascade');
            $table->foreignId('location_id')->constrained()->onDelete('cascade');
            $table->foreignId('agent_id')->constrained()->onDelete('cascade');
            $table->decimal('price', 15, 2);
            $table->string('purpose')->default('buy'); // buy, rent
            $table->integer('bedrooms')->default(3);
            $table->integer('bathrooms')->default(2);
            $table->integer('area_sqft')->default(1500);
            $table->string('furnished_status')->default('furnished'); // furnished, semi-furnished, unfurnished
            $table->string('property_status')->default('available'); // available, sold, rented
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_published')->default(true);
            $table->string('address');
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->integer('year_built')->default(2023);
            $table->string('video_url')->nullable();
            $table->integer('views_count')->default(0);
            $table->timestamps();
            $table->softDeletes();

            // Indexes for fast multi-parameter search
            $table->index(['purpose', 'property_type_id', 'location_id', 'price']);
            $table->index(['bedrooms', 'bathrooms', 'furnished_status']);
            $table->index(['is_featured', 'is_published']);
        });

        // Property Images
        Schema::create('property_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained()->onDelete('cascade');
            $table->string('image_path');
            $table->boolean('is_primary')->default(false);
            $table->integer('display_order')->default(0);
            $table->timestamps();
        });

        // Property Videos
        Schema::create('property_videos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained()->onDelete('cascade');
            $table->string('video_url');
            $table->string('title')->nullable();
            $table->timestamps();
        });

        // Property Floor Plans
        Schema::create('property_floor_plans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained()->onDelete('cascade');
            $table->string('image_path');
            $table->string('title')->default('Standard Layout');
            $table->string('floor_name')->default('Ground Floor');
            $table->timestamps();
        });

        // Property Amenities (Pivot Table)
        Schema::create('property_amenities', function (Blueprint $table) {
            $table->foreignId('property_id')->constrained()->onDelete('cascade');
            $table->foreignId('amenity_id')->constrained()->onDelete('cascade');
            $table->primary(['property_id', 'amenity_id']);
        });

        // Favorites
        Schema::create('favorites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('property_id')->constrained()->onDelete('cascade');
            $table->timestamps();

            $table->unique(['user_id', 'property_id']);
        });

        // Enquiries
        Schema::create('enquiries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('property_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('agent_id')->nullable()->constrained()->onDelete('set null');
            $table->string('name');
            $table->string('email');
            $table->string('phone');
            $table->text('message');
            $table->string('status')->default('new'); // new, contact_in_progress, resolved, archived
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // Appointments (Property Visit Requests)
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('property_id')->constrained()->onDelete('cascade');
            $table->foreignId('agent_id')->nullable()->constrained()->onDelete('set null');
            $table->string('name');
            $table->string('email');
            $table->string('phone');
            $table->date('date');
            $table->string('time_slot'); // e.g. "10:00 AM", "02:30 PM"
            $table->string('status')->default('pending'); // pending, confirmed, cancelled, completed
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // Notifications
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('message');
            $table->boolean('is_read')->default(false);
            $table->string('type')->default('general');
            $table->json('data')->nullable();
            $table->timestamps();
        });

        // Blog Categories
        Schema::create('blog_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->timestamps();
        });

        // Blogs
        Schema::create('blogs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('blog_category_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('excerpt');
            $table->longText('content');
            $table->string('image')->nullable();
            $table->string('author_name')->default('Editorial Team');
            $table->boolean('is_published')->default(true);
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });

        // Testimonials
        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('role')->default('Homeowner');
            $table->string('company')->nullable();
            $table->text('content');
            $table->string('avatar')->nullable();
            $table->integer('rating')->default(5);
            $table->boolean('is_featured')->default(true);
            $table->timestamps();
        });

        // FAQs
        Schema::create('faqs', function (Blueprint $table) {
            $table->id();
            $table->string('question');
            $table->text('answer');
            $table->string('category')->default('Buying');
            $table->integer('display_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('faqs');
        Schema::dropIfExists('testimonials');
        Schema::dropIfExists('blogs');
        Schema::dropIfExists('blog_categories');
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('appointments');
        Schema::dropIfExists('enquiries');
        Schema::dropIfExists('favorites');
        Schema::dropIfExists('property_amenities');
        Schema::dropIfExists('property_floor_plans');
        Schema::dropIfExists('property_videos');
        Schema::dropIfExists('property_images');
        Schema::dropIfExists('properties');
        Schema::dropIfExists('agents');
        Schema::dropIfExists('amenities');
        Schema::dropIfExists('locations');
        Schema::dropIfExists('property_types');
    }
};
