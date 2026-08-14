<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VisitorLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'ip_address',
        'country',
        'state',
        'city',
        'timezone',
        'device_type',
        'os',
        'browser',
        'browser_version',
        'screen_resolution',
        'language',
        'referrer_url',
        'landing_page',
        'page_url',
        'utm_params',
        'session_id',
        'visitor_status',
        'user_agent',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
