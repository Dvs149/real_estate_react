<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Enquiry;
use App\Models\Property;
use Illuminate\Http\Request;

class EnquiryController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Enquiry::with(['property', 'agent']);

        if (!$user->isAdmin()) {
            if ($user->isAgent() && $user->agentProfile) {
                $query->where('agent_id', $user->agentProfile->id);
            } else {
                $query->where('user_id', $user->id);
            }
        }

        $enquiries = $query->orderBy('id', 'desc')->get();

        return response()->json(['data' => $enquiries]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'property_id' => ['nullable', 'exists:properties,id'],
            'agent_id' => ['nullable', 'exists:agents,id'],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:20'],
            'message' => ['required', 'string'],
        ]);

        if (!empty($validated['property_id']) && empty($validated['agent_id'])) {
            $property = Property::find($validated['property_id']);
            if ($property) {
                $validated['agent_id'] = $property->agent_id;
            }
        }

        $validated['user_id'] = $request->user()?->id;
        $validated['status'] = 'new';

        $enquiry = Enquiry::create($validated);

        return response()->json([
            'message' => 'Your enquiry has been received successfully! Our representative will contact you shortly.',
            'data' => $enquiry,
        ], 201);
    }
}
