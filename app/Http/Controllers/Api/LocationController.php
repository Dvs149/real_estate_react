<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Location;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class LocationController extends Controller
{
    public function index()
    {
        $locations = Location::withCount('properties')->orderBy('name', 'asc')->get();
        return response()->json(['data' => $locations]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'image' => 'nullable|string',
            'is_popular' => 'boolean',
        ]);

        $validated['slug'] = Str::slug($validated['name'] . '-' . $validated['city']);
        $validated['country'] = $validated['country'] ?? 'India';

        $location = Location::create($validated);

        return response()->json([
            'message' => 'Location created successfully',
            'data' => $location,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $location = Location::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'city' => 'sometimes|required|string|max:255',
            'state' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'image' => 'nullable|string',
            'is_popular' => 'boolean',
        ]);

        if (isset($validated['name']) || isset($validated['city'])) {
            $name = $validated['name'] ?? $location->name;
            $city = $validated['city'] ?? $location->city;
            $validated['slug'] = Str::slug($name . '-' . $city);
        }

        $location->update($validated);

        return response()->json([
            'message' => 'Location updated successfully',
            'data' => $location,
        ]);
    }

    public function destroy($id)
    {
        $location = Location::findOrFail($id);
        $location->delete();

        return response()->json([
            'message' => 'Location deleted successfully',
        ]);
    }
}
