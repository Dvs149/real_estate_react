<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'role', 'company', 'content', 'avatar', 'rating', 'is_featured'];

    protected $casts = [
        'is_featured' => 'boolean',
        'rating' => 'integer',
    ];
}
