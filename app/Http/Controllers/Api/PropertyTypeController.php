<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PropertyType;

class PropertyTypeController extends Controller
{
    public function index()
    {
        $types = PropertyType::withCount('properties')->get();
        return response()->json(['data' => $types]);
    }
}
