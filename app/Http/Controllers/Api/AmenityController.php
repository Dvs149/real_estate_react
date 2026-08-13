<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Amenity;

class AmenityController extends Controller
{
    public function index()
    {
        $amenities = Amenity::all();
        return response()->json(['data' => $amenities]);
    }
}
