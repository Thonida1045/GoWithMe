<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\Post;
use Carbon\Carbon;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $query = Post::query();

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
                $query->orderBy('created_at', 'desc');
            } elseif ($request->input('sort') === 'most_commented') {
                $query->withCount('comments')->orderBy('comments_count', 'desc');
            }
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $posts = $query->with(['category', 'comments.user'])->withCount('comments')->paginate(10);

        // ✅ Add image_url
        $posts->getCollection()->transform(function ($post) {
            $post->image_url = $post->image ? asset('storage/' . $post->image) : null;
            return $post;
        });

        $categories = Category::all();

        return Inertia::render('admin/posts', [
    'categories' => $categories,
    'posts' => $posts,
    'filters' => [
        'search' => $request->input('search', ''),
        'category' => $request->input('category', 'all'),
        'sort' => $request->input('sort', 'latest'),
        'image_url' => $request->input('image_url', null),
    ],
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

    return response()->json($posts); // <-- Important!
}

    /**
     * Show the form for creating a new post (Admin).
     */
    public function create()
    {
        $categories = Category::all();
        return Inertia::render('admin/posts/create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created post in storage (Admin).
     */
    public function store(Request $request)
{
    $validated = $request->validate([
        'title' => ['required', 'string', 'max:255', Rule::unique('posts', 'title')],
        'content' => 'required|string',
        'category_id' => 'required|exists:categories,id',
        'published_at' => 'nullable|date',
        'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
    ]);

    if ($request->filled('published_at')) {
        $validated['published_at'] = Carbon::parse($request->published_at)->format('Y-m-d H:i:s');
    } else {
        $validated['published_at'] = null;
    }

    $validated['slug'] = Str::slug($request->title);

    // First, create the post (without the image yet)
    $post = Post::create(Arr::except($validated, ['image']));

    // Then store the image using the post ID
    if ($request->hasFile('image')) {
        $extension = $request->file('image')->getClientOriginalExtension();
        $imageName = 'post_' . $post->id . '.' . $extension;
        $imagePath = $request->file('image')->storeAs('posts', $imageName, 'public');

        // Update post with image path
        $post->update(['image' => $imagePath]);
    }

    return redirect()->route('admin.posts.index')
        ->with('success', 'Post Added Successfully');
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
    $post = Post::with('category')->findOrFail($id);
    $categories = Category::all();

    $post->image_url = $post->image ? asset('storage/' . $post->image) : null;

    return Inertia::render('admin/posts/edit', [
        'post' => $post,
        'categories' => $categories,
    ]);
}
    /**
     * Update the specified post in storage (Admin).
     */
    public function update(Request $request, string $id)
    {
        $post = Post::findOrFail($id);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255', Rule::unique('posts', 'title')->ignore($post->id, 'id')],
            'content' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'published_at' => 'nullable|date',
            'remove_image' => 'nullable|boolean',
        ]);

        $imagePath = $post->image;

        if ($request->hasFile('image')) {
            if ($post->image) {
                Storage::disk('public')->delete($post->image);
            }
            $imagePath = $request->file('image')->store('posts', 'public');
        } elseif ($request->boolean('remove_image')) {
            if ($post->image) {
                Storage::disk('public')->delete($post->image);
            }
            $imagePath = null;
        }

        $validated['image'] = $imagePath;

        if ($request->filled('published_at')) {
            $validated['published_at'] = Carbon::parse($request->published_at)->format('Y-m-d H:i:s');
        } else {
            $validated['published_at'] = null;
        }

        $validated['slug'] = Str::slug($request->title);

        $post->update($validated);

        return redirect()->route('admin.posts.index')
            ->with('success', 'Post Updated Successfully');
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