<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PropertyResource;
use App\Models\Property;
use App\Models\PropertyImage;
use App\Models\PropertyFloorPlan;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PropertyController extends Controller
{
    public function index(Request $request)
    {
        $query = Property::with([
            'propertyType',
            'location',
            'agent',
            'images',
            'amenities',
            'favorites',
            'floorPlans'
        ])->where('is_published', true);

        // Search Keyword (title, description, address, location name, city)
        if ($request->filled('q')) {
            $q = $request->input('q');
            $query->where(function ($sub) use ($q) {
                $sub->where('title', 'like', "%{$q}%")
                    ->orWhere('description', 'like', "%{$q}%")
                    ->orWhere('address', 'like', "%{$q}%")
                    ->orWhereHas('location', fn($l) => $l->where('city', 'like', "%{$q}%")->orWhere('name', 'like', "%{$q}%"));
            });
        }

        // Purpose (buy, rent)
        if ($request->filled('purpose')) {
            $query->where('purpose', strtolower($request->input('purpose')));
        }

        // Location (City or Location ID or Slug)
        if ($request->filled('location')) {
            $loc = $request->input('location');
            $query->whereHas('location', function ($l) use ($loc) {
                $l->where('slug', $loc)
                  ->orWhere('city', 'like', "%{$loc}%")
                  ->orWhere('id', $loc);
            });
        }

        // Property Type (ID or Slug)
        if ($request->filled('type')) {
            $type = $request->input('type');
            $query->whereHas('propertyType', function ($t) use ($type) {
                $t->where('slug', $type)->orWhere('id', $type);
            });
        }

        // Price Range
        if ($request->filled('min_price')) {
            $query->where('price', '>=', (float) $request->input('min_price'));
        }
        if ($request->filled('max_price')) {
            $query->where('price', '<=', (float) $request->input('max_price'));
        }

        // Bedrooms & Bathrooms
        if ($request->filled('bedrooms')) {
            $query->where('bedrooms', '>=', (int) $request->input('bedrooms'));
        }
        if ($request->filled('bathrooms')) {
            $query->where('bathrooms', '>=', (int) $request->input('bathrooms'));
        }

        // Furnished Status
        if ($request->filled('furnished_status')) {
            $query->where('furnished_status', $request->input('furnished_status'));
        }

        // Featured Filter
        if ($request->boolean('featured')) {
            $query->where('is_featured', true);
        }

        // Amenities Filter
        if ($request->filled('amenities')) {
            $amenityIds = is_array($request->input('amenities'))
                ? $request->input('amenities')
                : explode(',', $request->input('amenities'));

            foreach ($amenityIds as $amenityId) {
                $query->whereHas('amenities', fn($a) => $a->where('amenities.id', $amenityId)->orWhere('amenities.slug', $amenityId));
            }
        }

        // Sorting
        $sort = $request->input('sort', 'newest');
        match ($sort) {
            'price_asc' => $query->orderBy('price', 'asc'),
            'price_desc' => $query->orderBy('price', 'desc'),
            'popular' => $query->orderBy('views_count', 'desc'),
            default => $query->orderBy('id', 'desc'),
        };

        $properties = $query->paginate($request->input('per_page', 9));

        return PropertyResource::collection($properties);
    }

    public function show(Request $request, string $slugOrId)
    {
        $property = Property::with([
            'propertyType',
            'location',
            'agent',
            'images',
            'videos',
            'floorPlans',
            'amenities',
            'favorites',
        ])
        ->where('slug', $slugOrId)
        ->orWhere('id', $slugOrId)
        ->firstOrFail();

        // Increment view count
        $property->increment('views_count');

        return new PropertyResource($property);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'property_type_id' => ['required', 'exists:property_types,id'],
            'location_id' => ['required', 'exists:locations,id'],
            'agent_id' => ['required', 'exists:agents,id'],
            'price' => ['required', 'numeric', 'min:0'],
            'purpose' => ['required', 'in:buy,rent'],
            'bedrooms' => ['required', 'integer', 'min:0'],
            'bathrooms' => ['required', 'integer', 'min:0'],
            'area_sqft' => ['required', 'integer', 'min:0'],
            'furnished_status' => ['required', 'in:furnished,semi-furnished,unfurnished'],
            'property_status' => ['nullable', 'in:available,sold,rented'],
            'is_featured' => ['nullable', 'boolean'],
            'is_published' => ['nullable', 'boolean'],
            'address' => ['required', 'string'],
            'latitude' => ['nullable', 'numeric'],
            'longitude' => ['nullable', 'numeric'],
            'year_built' => ['nullable', 'integer'],
            'video_url' => ['nullable', 'string', 'url'],
            'images' => ['required', 'array', 'min:1'],
            'images.*' => ['string'],
            'amenities' => ['nullable', 'array'],
            'amenities.*' => ['exists:amenities,id'],
        ]);

        $validated['slug'] = Str::slug($validated['title']) . '-' . Str::random(5);
        $images = $validated['images'];
        $amenities = $validated['amenities'] ?? [];
        unset($validated['images'], $validated['amenities']);

        $property = Property::create($validated);

        // Attach images
        foreach ($images as $index => $imgUrl) {
            PropertyImage::create([
                'property_id' => $property->id,
                'image_path' => $imgUrl,
                'is_primary' => $index === 0,
                'display_order' => $index,
            ]);
        }

        if (!empty($amenities)) {
            $property->amenities()->sync($amenities);
        }

        return new PropertyResource($property->load(['propertyType', 'location', 'agent', 'images', 'amenities']));
    }

    public function update(Request $request, int $id)
    {
        $property = Property::findOrFail($id);

        $validated = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'string'],
            'price' => ['sometimes', 'numeric', 'min:0'],
            'purpose' => ['sometimes', 'in:buy,rent'],
            'property_status' => ['sometimes', 'in:available,sold,rented'],
            'is_featured' => ['sometimes', 'boolean'],
            'is_published' => ['sometimes', 'boolean'],
        ]);

        $property->update($validated);

        return new PropertyResource($property->fresh(['propertyType', 'location', 'agent', 'images', 'amenities']));
    }

    public function destroy(int $id)
    {
        $property = Property::findOrFail($id);
        $property->delete();

        return response()->json([
            'message' => 'Property deleted successfully',
        ]);
    }
}
