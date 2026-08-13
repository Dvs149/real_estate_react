<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PropertyResource;
use App\Models\Favorite;
use App\Models\Property;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $propertyIds = Favorite::where('user_id', $user->id)->pluck('property_id');

        $properties = Property::with(['propertyType', 'location', 'agent', 'images', 'amenities', 'favorites'])
            ->whereIn('id', $propertyIds)
            ->paginate(12);

        return PropertyResource::collection($properties);
    }

    public function toggle(Request $request, int $propertyId)
    {
        $user = $request->user();
        $property = Property::findOrFail($propertyId);

        $existing = Favorite::where('user_id', $user->id)
            ->where('property_id', $propertyId)
            ->first();

        if ($existing) {
            $existing->delete();
            return response()->json([
                'message' => 'Property removed from favorites',
                'is_favorite' => false,
            ]);
        }

        Favorite::create([
            'user_id' => $user->id,
            'property_id' => $propertyId,
        ]);

        return response()->json([
            'message' => 'Property saved to favorites',
            'is_favorite' => true,
        ]);
    }
}
