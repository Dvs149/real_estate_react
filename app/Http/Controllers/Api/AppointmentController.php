<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Property;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Appointment::with(['property.images', 'agent']);

        if (!$user->isAdmin()) {
            if ($user->isAgent() && $user->agentProfile) {
                $query->where('agent_id', $user->agentProfile->id);
            } else {
                $query->where('user_id', $user->id);
            }
        }

        $appointments = $query->orderBy('date', 'desc')->get();

        return response()->json(['data' => $appointments]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'property_id' => ['required', 'exists:properties,id'],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:20'],
            'date' => ['required', 'date', 'after_or_equal:today'],
            'time_slot' => ['required', 'string'],
            'notes' => ['nullable', 'string'],
        ]);

        $property = Property::findOrFail($validated['property_id']);

        $validated['user_id'] = $request->user()?->id;
        $validated['agent_id'] = $property->agent_id;
        $validated['status'] = 'pending';

        $appointment = Appointment::create($validated);

        return response()->json([
            'message' => 'Property visit appointment booked successfully! The designated agent will reach out to confirm.',
            'data' => $appointment,
        ], 201);
    }
}
