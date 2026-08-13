<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PropertyResource;
use App\Models\Agent;
use Illuminate\Http\Request;

class AgentController extends Controller
{
    public function index(Request $request)
    {
        $agents = Agent::withCount('properties')->get();

        return response()->json([
            'data' => $agents,
        ]);
    }

    public function show(string $slugOrId)
    {
        $agent = Agent::with(['properties.propertyType', 'properties.location', 'properties.images'])
            ->where('slug', $slugOrId)
            ->orWhere('id', $slugOrId)
            ->firstOrFail();

        return response()->json([
            'data' => [
                'id' => $agent->id,
                'name' => $agent->name,
                'slug' => $agent->slug,
                'email' => $agent->email,
                'phone' => $agent->phone,
                'agency_name' => $agent->agency_name,
                'experience_years' => $agent->experience_years,
                'rating' => (float) $agent->rating,
                'avatar' => $agent->avatar,
                'bio' => $agent->bio,
                'social_links' => $agent->social_links,
                'properties_count' => $agent->properties->count(),
                'properties' => PropertyResource::collection($agent->properties),
            ],
        ]);
    }
}
