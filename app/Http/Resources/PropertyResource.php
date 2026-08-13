<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PropertyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'price' => (float) $this->price,
            'formatted_price' => $this->formatPrice($this->price),
            'purpose' => $this->purpose,
            'bedrooms' => (int) $this->bedrooms,
            'bathrooms' => (int) $this->bathrooms,
            'area_sqft' => (int) $this->area_sqft,
            'furnished_status' => $this->furnished_status,
            'property_status' => $this->property_status,
            'is_featured' => (bool) $this->is_featured,
            'is_published' => (bool) $this->is_published,
            'address' => $this->address,
            'latitude' => $this->latitude ? (float) $this->latitude : null,
            'longitude' => $this->longitude ? (float) $this->longitude : null,
            'year_built' => (int) $this->year_built,
            'video_url' => $this->video_url,
            'views_count' => (int) $this->views_count,
            'primary_image' => $this->images->firstWhere('is_primary', true)?->image_path ?? $this->images->first()?->image_path,
            'images' => $this->images->map(fn($img) => [
                'id' => $img->id,
                'image_path' => $img->image_path,
                'is_primary' => (bool) $img->is_primary,
            ]),
            'floor_plans' => $this->floorPlans->map(fn($fp) => [
                'id' => $fp->id,
                'image_path' => $fp->image_path,
                'title' => $fp->title,
                'floor_name' => $fp->floor_name,
            ]),
            'property_type' => [
                'id' => $this->propertyType->id,
                'name' => $this->propertyType->name,
                'slug' => $this->propertyType->slug,
                'icon' => $this->propertyType->icon,
            ],
            'location' => [
                'id' => $this->location->id,
                'name' => $this->location->name,
                'slug' => $this->location->slug,
                'city' => $this->location->city,
                'state' => $this->location->state,
            ],
            'agent' => [
                'id' => $this->agent->id,
                'name' => $this->agent->name,
                'slug' => $this->agent->slug,
                'email' => $this->agent->email,
                'phone' => $this->agent->phone,
                'agency_name' => $this->agent->agency_name,
                'avatar' => $this->agent->avatar,
                'rating' => (float) $this->agent->rating,
            ],
            'amenities' => $this->amenities->map(fn($a) => [
                'id' => $a->id,
                'name' => $a->name,
                'slug' => $a->slug,
                'category' => $a->category,
                'icon' => $a->icon,
            ]),
            'is_favorite' => $request->user() ? $this->favorites->contains('user_id', $request->user()->id) : false,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }

    private function formatPrice($price): string
    {
        if ($price >= 10000000) {
            return '₹' . number_format($price / 10000000, 2) . ' Cr';
        } elseif ($price >= 100000) {
            return '₹' . number_format($price / 100000, 2) . ' Lakh';
        }
        return '₹' . number_format($price);
    }
}
