<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Location extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'slug', 'city', 'state', 'country', 'image', 'is_popular'];

    protected $casts = [
        'is_popular' => 'boolean',
    ];

    public function properties(): HasMany
    {
        return $this->hasMany(Property::class);
    }
}
