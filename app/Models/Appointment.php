<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Appointment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'property_id',
        'agent_id',
        'name',
        'email',
        'phone',
        'date',
        'time_slot',
        'status',
        'notes',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    public function agent(): BelongsTo
    {
        return $this->belongsTo(Agent::class);
    }
}
