<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AgentController;
use App\Http\Controllers\Api\AmenityController;
use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BlogController;
use App\Http\Controllers\Api\EnquiryController;
use App\Http\Controllers\Api\FaqController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\LocationController;
use App\Http\Controllers\Api\PropertyController;
use App\Http\Controllers\Api\PropertyTypeController;
use App\Http\Controllers\Api\TestimonialController;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\SettingController;

// Public Authentication
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::put('/profile', [AuthController::class, 'updateProfile']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });
});

// Properties
Route::get('/properties', [PropertyController::class, 'index']);
Route::get('/properties/{slug}', [PropertyController::class, 'show']);

// Metadata Options
Route::get('/locations', [LocationController::class, 'index']);
Route::get('/property-types', [PropertyTypeController::class, 'index']);
Route::get('/amenities', [AmenityController::class, 'index']);

// Agents
Route::get('/agents', [AgentController::class, 'index']);
Route::get('/agents/{slug}', [AgentController::class, 'show']);

// CMS Public APIs
Route::get('/settings', [SettingController::class, 'index']);
Route::get('/blogs', [BlogController::class, 'index']);
Route::get('/blogs/{slug}', [BlogController::class, 'show']);
Route::get('/blog-categories', [BlogController::class, 'categories']);
Route::get('/testimonials', [TestimonialController::class, 'index']);
Route::get('/faqs', [FaqController::class, 'index']);

// Public Lead / Visit Submission
Route::post('/enquiries', [EnquiryController::class, 'store']);
Route::post('/appointments', [AppointmentController::class, 'store']);

// Protected User Routes (authenticated users)
Route::middleware('auth:sanctum')->group(function () {
    // Favorites
    Route::get('/favorites', [FavoriteController::class, 'index']);
    Route::post('/properties/{id}/favorite', [FavoriteController::class, 'toggle']);

    // User Enquiries & Appointments History
    Route::get('/enquiries', [EnquiryController::class, 'index']);
    Route::get('/appointments', [AppointmentController::class, 'index']);
    Route::patch('/appointments/{id}', [AppointmentController::class, 'update']);

    // Property Management (Agent/Admin)
    Route::middleware('agent')->group(function () {
        Route::post('/properties', [PropertyController::class, 'store']);
        Route::put('/properties/{id}', [PropertyController::class, 'update']);
        Route::delete('/properties/{id}', [PropertyController::class, 'destroy']);
    });

    // Admin Only Routes
    Route::middleware('admin')->group(function () {
        // Location Management
        Route::post('/locations', [LocationController::class, 'store']);
        Route::put('/locations/{id}', [LocationController::class, 'update']);
        Route::delete('/locations/{id}', [LocationController::class, 'destroy']);

        // Admin Management Suite
        Route::prefix('admin')->group(function () {
            Route::get('/stats', [AdminController::class, 'stats']);
            Route::get('/appointments', [AdminController::class, 'appointmentsList']);
            Route::patch('/enquiries/{id}', [AdminController::class, 'updateEnquiryStatus']);
            Route::patch('/appointments/{id}', [AdminController::class, 'updateAppointmentStatus']);
            Route::post('/properties/{id}/publish', [AdminController::class, 'togglePropertyPublish']);
            Route::post('/properties/{id}/featured', [AdminController::class, 'togglePropertyFeatured']);
            Route::get('/users', [AdminController::class, 'usersList']);
            Route::post('/users', [AdminController::class, 'createUser']);
            Route::put('/users/{id}', [AdminController::class, 'updateUser']);
            Route::patch('/users/{id}/role', [AdminController::class, 'updateUserRole']);
            Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);
            Route::post('/settings', [SettingController::class, 'update']);

            // Blog Management Routes
            Route::get('/blogs', [BlogController::class, 'adminIndex']);
            Route::post('/blogs', [BlogController::class, 'store']);
            Route::put('/blogs/{id}', [BlogController::class, 'update']);
            Route::delete('/blogs/{id}', [BlogController::class, 'destroy']);
            Route::post('/blogs/{id}/publish', [BlogController::class, 'togglePublish']);
        });
    });
});

