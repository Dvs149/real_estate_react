<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use App\Models\BlogCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

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

    public function categories()
    {
        $categories = BlogCategory::orderBy('name', 'asc')->get();

        return response()->json(['data' => $categories]);
    }

    public function adminIndex()
    {
        $blogs = Blog::with('category')
            ->orderBy('id', 'desc')
            ->get();

        return response()->json(['data' => $blogs]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'blog_category_id' => ['required', 'exists:blog_categories,id'],
            'excerpt' => ['required', 'string'],
            'content' => ['required', 'string'],
            'image' => ['nullable', 'string'],
            'author_name' => ['nullable', 'string', 'max:255'],
            'is_published' => ['boolean'],
        ]);

        $slug = Str::slug($validated['title']);
        $originalSlug = $slug;
        $count = 1;
        while (Blog::where('slug', $slug)->exists()) {
            $slug = "{$originalSlug}-{$count}";
            $count++;
        }

        $isPublished = $request->boolean('is_published', true);

        $blog = Blog::create([
            'title' => $validated['title'],
            'slug' => $slug,
            'blog_category_id' => $validated['blog_category_id'],
            'excerpt' => $validated['excerpt'],
            'content' => $validated['content'],
            'image' => $validated['image'] ?? 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
            'author_name' => $validated['author_name'] ?? 'DVS Research Desk',
            'is_published' => $isPublished,
            'published_at' => $isPublished ? now() : null,
        ]);

        $blog->load('category');

        return response()->json([
            'message' => 'Blog article created successfully',
            'data' => $blog,
        ], 201);
    }

    public function update(Request $request, int $id)
    {
        $blog = Blog::findOrFail($id);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'blog_category_id' => ['required', 'exists:blog_categories,id'],
            'excerpt' => ['required', 'string'],
            'content' => ['required', 'string'],
            'image' => ['nullable', 'string'],
            'author_name' => ['nullable', 'string', 'max:255'],
            'is_published' => ['boolean'],
        ]);

        if ($blog->title !== $validated['title']) {
            $slug = Str::slug($validated['title']);
            $originalSlug = $slug;
            $count = 1;
            while (Blog::where('slug', $slug)->where('id', '!=', $id)->exists()) {
                $slug = "{$originalSlug}-{$count}";
                $count++;
            }
            $blog->slug = $slug;
        }

        $isPublished = $request->boolean('is_published', $blog->is_published);

        $blog->title = $validated['title'];
        $blog->blog_category_id = $validated['blog_category_id'];
        $blog->excerpt = $validated['excerpt'];
        $blog->content = $validated['content'];
        $blog->image = $validated['image'] ?? $blog->image;
        $blog->author_name = $validated['author_name'] ?? $blog->author_name;
        $blog->is_published = $isPublished;

        if ($isPublished && !$blog->published_at) {
            $blog->published_at = now();
        }

        $blog->save();
        $blog->load('category');

        return response()->json([
            'message' => 'Blog article updated successfully',
            'data' => $blog,
        ]);
    }

    public function destroy(int $id)
    {
        $blog = Blog::findOrFail($id);
        $blog->delete();

        return response()->json(['message' => 'Blog article deleted successfully']);
    }

    public function togglePublish(int $id)
    {
        $blog = Blog::findOrFail($id);
        $blog->is_published = !$blog->is_published;
        if ($blog->is_published && !$blog->published_at) {
            $blog->published_at = now();
        }
        $blog->save();

        return response()->json([
            'message' => 'Blog published status updated',
            'is_published' => $blog->is_published,
        ]);
    }
}

