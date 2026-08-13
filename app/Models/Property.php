<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Property extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'property_type_id',
        'location_id',
        'agent_id',
        'price',
        'purpose',
        'bedrooms',
        'bathrooms',
        'area_sqft',
        'furnished_status',
        'property_status',
        'is_featured',
        'is_published',
        'address',
        'latitude',
        'longitude',
        'year_built',
        'video_url',
        'views_count',
    ];

    protected $casts = [
        'price' => 'float',
        'bedrooms' => 'integer',
        'bathrooms' => 'integer',
        'area_sqft' => 'integer',
        'is_featured' => 'boolean',
        'is_published' => 'boolean',
        'views_count' => 'integer',
        'latitude' => 'float',
        'longitude' => 'float',
    ];

    public function propertyType(): BelongsTo
    {
        return $this->belongsTo(PropertyType::class);
    }

    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }

    public function agent(): BelongsTo
    {
        return $this->belongsTo(Agent::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(PropertyImage::class)->orderBy('display_order');
    }

    public function videos(): HasMany
    {
        return $this->hasMany(PropertyVideo::class);
    }

    public function floorPlans(): HasMany
    {
        return $this->hasMany(PropertyFloorPlan::class);
    }

    public function amenities(): BelongsToMany
    {
        return $this->belongsToMany(Amenity::class, 'property_amenities');
    }

    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class);
    }

    public function enquiries(): HasMany
    {
        return $this->hasMany(Enquiry::class);
    }

    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class);
    }
}
