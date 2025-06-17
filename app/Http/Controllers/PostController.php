<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\Province;
use App\Models\Post;
use Carbon\Carbon;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use App\Http\Resources\PostResource;
use Illuminate\Support\Arr;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $query = Post::query();

        // Search
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where('title', 'like', "%$search%")
                  ->orWhere('content', 'like', "%$search%");
        }

        // Sort
        if ($request->input('sort') === 'oldest') {
            $query->orderBy('created_at', 'asc');
        } elseif ($request->input('sort') === 'most_commented') {
            $query->withCount('comments')->orderBy('comments_count', 'desc');
        } elseif ($request->input('sort') === 'province') {
            $query->orderBy('province_id', 'asc');
        } elseif ($request->input('sort') === 'category') {
            $query->orderBy('category_id', 'asc');
        } else {
            $query->orderBy('created_at', 'desc');
        }

        // Filter by category
        if ($request->filled('category')) {
            $query->where('category_id', $request->input('category'));
        }

        // Filter by province
        if ($request->filled('province')) {
            $query->where('province_id', $request->input('province'));
        }

        // Use the query with eager loading for category, province, and comments.user
        $posts = $query->with(['category', 'province', 'comments.user'])->paginate(10);
        $categories = Category::all();
        $provinces = \App\Models\Province::all();

        return Inertia::render('admin/posts', [
            'posts' => $posts,
            'categories' => $categories,   // <-- Pass to view
            'provinces' => $provinces,     // <-- Pass to view
            'filters' => $request->only(['search', 'sort', 'category', 'province']),
        ]);
    }

    public function userIndex(Request $request)
    {
        $query = Post::query()
                     ->whereNotNull('published_at')
                     ->where('published_at', '<=', now());

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('title', 'like', '%' . $search . '%')
                  ->orWhere('content', 'like', '%' . $search . '%');
        }

        if ($request->has('category') && $request->input('category') !== 'all') {
            $query->where('category_id', $request->input('category'));
        }

        if ($request->has('sort')) {
            if ($request->input('sort') === 'latest') {
                $query->orderBy('published_at', 'desc');
            } elseif ($request->input('sort') === 'most_commented') {
                $query->withCount('comments')->orderBy('comments_count', 'desc');
            }
        } else {
            $query->orderBy('published_at', 'desc');
        }

        $posts = $query->with(['category'])->withCount('comments')->paginate(10);

        // Add image_url attribute
        $posts->getCollection()->transform(function ($post) {
            $post->image_url = $post->image ? asset('storage/' . $post->image) : null;
            return $post;
        });

        return Inertia::render('user/posts', [
            'posts' => $posts,
            'categories' => Category::all(),
            'filters' => $request->only(['search', 'sort', 'category']),
        ]);
    }

    /**
     * Show the form for creating a new post (Admin).
     */
    public function create()
    {
        $categories = Category::all();
        $provinces = \App\Models\Province::all();
        return Inertia::render('admin/posts/create', [
            'categories' => $categories,
            'provinces' => $provinces,
        ]);
    }

    /**
     * Store a newly created post in storage (Admin).
     */
    public function store(Request $request)
{
    $validated = $request->validate([
        'title' => 'required|string|max:255',
        'content' => 'required|string',
        'category_id' => 'required|exists:categories,id',
        'province_id' => 'required|exists:provinces,id',
        'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        'published_at' => 'nullable|date',
    ]);

    // Handle image upload
    if ($request->hasFile('image')) {
        $imagePath = $request->file('image')->store('posts', 'public');
        $validated['image'] = $imagePath;
    }

    // Generate unique slug from title
    $baseSlug = Str::slug($validated['title']);
    $slug = $baseSlug;
    $counter = 1;
    while (Post::where('slug', $slug)->exists()) {
        $slug = $baseSlug . '-' . $counter++;
    }
    $validated['slug'] = $slug;

    Post::create($validated);

    return redirect()->route('admin.posts.index')
        ->with('success', 'Post created successfully!');
}

    /**
     * Display the specified post (Can be used for both Admin and User detail page).
     */
    public function show(string $id)
    {
        $post = Post::with(['category', 'comments.user'])->withCount('comments')->findOrFail($id);

        // Add image_url for frontend
        $post->image_url = $post->image ? asset('storage/' . $post->image) : null;

        // If you want a separate admin show page, use 'admin/posts/show'
        return Inertia::render('admin/posts/show', ['post' => $post]);
        // For user show page, use:
        // return Inertia::render('user/posts/show', ['post' => $post]);
    }

    /**
     * Show the form for editing the specified post (Admin).
     */
    public function edit(string $id)
{
    $post = Post::with(['category', 'province'])->findOrFail($id);
    $categories = Category::all();
    $provinces = Province::all();

    $post->image_url = $post->image ? asset('storage/' . $post->image) : null;

    return Inertia::render('admin/posts/edit', [
        'post' => $post,
        'categories' => $categories,
        'provinces' => $provinces,
    ]);
}
    /**
     * Update the specified post in storage (Admin).
     */
    public function update(Request $request, string $id)
    {
        $post = Post::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'province_id' => 'required|exists:provinces,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'published_at' => 'nullable|date',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('posts', 'public');
            $validated['image'] = $imagePath;
        }

        // Generate unique slug from title (ignore current post's slug)
        $baseSlug = Str::slug($validated['title']);
        $slug = $baseSlug;
        $counter = 1;
        while (Post::where('slug', $slug)->where('id', '!=', $post->id)->exists()) {
            $slug = $baseSlug . '-' . $counter++;
        }
        $validated['slug'] = $slug;

        $post->update($validated);

        return redirect()->route('admin.posts.index')
            ->with('success', 'Post updated successfully!');
    }

    /**
     * Remove the specified post from storage (Admin).
     */
    public function destroy(string $id)
    {
        $post = Post::findOrFail($id);

        if ($post->image) {
            Storage::disk('public')->delete($post->image);
        }

        $post->delete();

        return redirect()->route('admin.posts.index')
            ->with('success', 'Post Deleted Successfully');
    }
}