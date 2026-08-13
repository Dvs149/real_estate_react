<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    public function index()
    {
        $blogs = Blog::with('category')
            ->where('is_published', true)
            ->orderBy('published_at', 'desc')
            ->get();

        return response()->json(['data' => $blogs]);
    }

    public function show(string $slug)
    {
        $blog = Blog::with('category')
            ->where('slug', $slug)
            ->firstOrFail();

        return response()->json(['data' => $blog]);
    }
}
