<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;

class TestimonialController extends Controller
{
    public function index()
    {
        $testimonials = Testimonial::where('is_featured', true)->get();
        return response()->json(['data' => $testimonials]);
    }
}
