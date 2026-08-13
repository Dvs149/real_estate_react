<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Agent extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'slug',
        'email',
        'phone',
        'agency_name',
        'experience_years',
        'rating',
        'avatar',
        'bio',
        'social_links',
    ];

    protected $casts = [
        'social_links' => 'array',
        'rating' => 'float',
        'experience_years' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function properties(): HasMany
    {
        return $this->hasMany(Property::class);
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
