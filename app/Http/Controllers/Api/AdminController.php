<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PropertyResource;
use App\Http\Resources\UserResource;
use App\Models\Appointment;
use App\Models\Enquiry;
use App\Models\Property;
use App\Models\User;
use App\Models\Agent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminController extends Controller
{
    public function stats(Request $request)
    {
        return response()->json([
            'stats' => [
                'total_properties' => Property::count(),
                'active_properties' => Property::where('property_status', 'available')->count(),
                'sold_properties' => Property::where('property_status', 'sold')->count(),
                'rented_properties' => Property::where('property_status', 'rented')->count(),
                'total_users' => User::count(),
                'total_agents' => Agent::count(),
                'total_enquiries' => Enquiry::count(),
                'total_appointments' => Appointment::count(),
            ],
            'recent_enquiries' => Enquiry::with(['property', 'agent'])->orderBy('id', 'desc')->take(5)->get(),
            'recent_appointments' => Appointment::with(['property'])->orderBy('id', 'desc')->take(5)->get(),
        ]);
    }

    public function updateEnquiryStatus(Request $request, int $id)
    {
        $validated = $request->validate([
            'status' => ['required', 'in:new,contact_in_progress,resolved,archived'],
            'notes' => ['nullable', 'string'],
        ]);

        $enquiry = Enquiry::findOrFail($id);
        $enquiry->update($validated);

        return response()->json([
            'message' => 'Enquiry status updated successfully',
            'data' => $enquiry,
        ]);
    }

    public function updateAppointmentStatus(Request $request, int $id)
    {
        $validated = $request->validate([
            'status' => ['required', 'in:pending,confirmed,cancelled,completed'],
            'notes' => ['nullable', 'string'],
        ]);

        $appointment = Appointment::findOrFail($id);
        $appointment->update($validated);

        return response()->json([
            'message' => 'Appointment status updated successfully',
            'data' => $appointment,
        ]);
    }

    public function togglePropertyPublish(int $id)
    {
        $property = Property::findOrFail($id);
        $property->update(['is_published' => !$property->is_published]);

        return response()->json([
            'message' => 'Property publish state toggled',
            'is_published' => $property->is_published,
        ]);
    }

    public function togglePropertyFeatured(int $id)
    {
        $property = Property::findOrFail($id);
        $property->update(['is_featured' => !$property->is_featured]);

        return response()->json([
            'message' => 'Property featured state toggled',
            'is_featured' => $property->is_featured,
        ]);
    }

    public function usersList()
    {
        $users = User::orderBy('id', 'desc')->get();
        return response()->json(['data' => UserResource::collection($users)]);
    }

    public function createUser(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'phone' => ['nullable', 'string', 'max:20'],
            'role' => ['required', 'in:admin,agent,user'],
            'password' => ['required', 'string', 'min:6'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'role' => $validated['role'],
            'password' => Hash::make($validated['password']),
        ]);

        if ($validated['role'] === 'agent') {
            Agent::create([
                'user_id' => $user->id,
                'name' => $user->name,
                'slug' => Str::slug($user->name . '-' . rand(100, 999)),
                'email' => $user->email,
                'phone' => $user->phone ?? '+91 98765 00000',
                'agency_name' => 'DVS Realty Luxury Advisory',
                'bio' => 'Senior real estate advisor at DVS Realty.',
                'experience_years' => 5,
                'rating' => 5.0,
            ]);
        }

        return response()->json([
            'message' => 'User created successfully',
            'data' => new UserResource($user),
        ], 201);
    }

    public function updateUser(Request $request, int $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $id],
            'phone' => ['nullable', 'string', 'max:20'],
            'role' => ['required', 'in:admin,agent,user'],
            'password' => ['nullable', 'string', 'min:6'],
        ]);

        $data = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'role' => $validated['role'],
        ];

        if (!empty($validated['password'])) {
            $data['password'] = Hash::make($validated['password']);
        }

        $user->update($data);

        if ($validated['role'] === 'agent' && !Agent::where('user_id', $user->id)->exists()) {
            Agent::create([
                'user_id' => $user->id,
                'name' => $user->name,
                'slug' => Str::slug($user->name . '-' . rand(100, 999)),
                'email' => $user->email,
                'phone' => $user->phone ?? '+91 98765 00000',
                'agency_name' => 'DVS Realty Luxury Advisory',
                'bio' => 'Senior real estate advisor at DVS Realty.',
                'experience_years' => 5,
                'rating' => 5.0,
            ]);
        }

        return response()->json([
            'message' => 'User updated successfully',
            'data' => new UserResource($user),
        ]);
    }

    public function updateUserRole(Request $request, int $id)
    {
        $validated = $request->validate([
            'role' => ['required', 'in:admin,agent,user'],
        ]);

        $user = User::findOrFail($id);
        $user->update(['role' => $validated['role']]);

        return response()->json([
            'message' => 'User role updated',
            'user' => new UserResource($user),
        ]);
    }

    public function deleteUser(int $id)
    {
        $user = User::findOrFail($id);

        if ($user->id === auth()->id()) {
            return response()->json(['message' => 'Cannot delete currently logged in admin user'], 422);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }
}
