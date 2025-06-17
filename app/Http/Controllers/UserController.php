<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Post;
use App\Models\Category;
use App\Models\Province;
use App\Models\Comment; // ✅ Added missing import
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;
use Illuminate\Support\Str;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Post::with(['category', 'province', 'comments'])
            ->withCount('comments')
            ->when($request->search, function ($query, $search) {
                $query->where('title', 'like', "%{$search}%");
            })
            ->when($request->filled('category') && $request->category !== 'all', function ($query) use ($request) {
                $query->where('category_id', $request->category);
            })
            ->when($request->sort === 'most_commented', function ($query) {
                $query->orderBy('comments_count', 'desc');
            }, function ($query) {
                $query->latest();
            });

        $posts = $query->paginate(9)->through(function ($post) {
            return [
                'id' => $post->id,
                'title' => $post->title ?? '',
                'content' => $post->content ?? '',
                'category' => [
                    'id' => $post->category->id ?? 0,
                    'name' => $post->category->name ?? '',
                ],
                'province' => $post->province ? [
                    'id' => $post->province->id,
                    'name_en' => $post->province->name_en,
                    'name_km' => $post->province->name_km,
                ] : null,
                'comments_count' => $post->comments_count ?? 0,
                'created_at' => $post->created_at?->toISOString(),
                'image_url' => $post->image ? asset('storage/' . $post->image) : null,
            ];
        });

        $categories = Category::all()->map(function ($category) {
            return [
                'id' => $category->id,
                'name' => $category->name,
            ];
        });

        $provinces = Province::all()->map(function ($province) {
            return [
                'id' => $province->id,
                'name_en' => $province->name_en,
                'name_km' => $province->name_km,
            ];
        });

        return Inertia::render('user/posts', [
            'posts' => $posts,
            'categories' => $categories,
            'provinces' => $provinces,
            'filters' => array_merge([
                'search' => '',
                'category' => 'all',
                'sort' => 'latest'
            ], $request->only(['search', 'category', 'sort'])),
        ]);
    }

    public function create()
    {
        //
    }

    public function store(Request $request)
    {
        //
    }

    public function show(string $id)
    {
        $post = Post::with(['category', 'province', 'comments.user'])
            ->withCount('comments')
            ->findOrFail($id);

        return Inertia::render('user/posts/show', [
            'post' => [
                'id' => $post->id,
                'title' => $post->title ?? '',
                'content' => $post->content ?? '',
                'category' => [
                    'id' => $post->category->id ?? 0,
                    'name' => $post->category->name ?? '',
                ],
                'province' => $post->province ? [
                    'id' => $post->province->id,
                    'name_en' => $post->province->name_en,
                    'name_km' => $post->province->name_km,
                ] : null,
                'comments' => $post->comments->map(function ($comment) {
                    return [
                        'id' => $comment->id,
                        'content' => $comment->content,
                        'user' => [
                            'id' => $comment->user->id,
                            'name' => $comment->user->name,
                        ],
                        'created_at' => $comment->created_at?->toISOString(),
                    ];
                }),
                'comments_count' => $post->comments_count ?? 0,
                'created_at' => $post->created_at?->toISOString() ?? '',
                'image_url' => $post->image ? asset('storage/' . $post->image) : null, // <-- Add this line
            ],
        ]);
    }

    public function edit(string $id)
    {
        //
    }

    public function storeComment(Request $request, string $id)
    {
        $validated = $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        $post = Post::findOrFail($id);
        $comment = $post->comments()->create([
            'content' => $validated['content'],
            'user_id' => auth()->id(),
        ]);
        return back()->with('success', 'Comment added successfully.');
    }

    public function destroyComment(string $postId, string $commentId)
    {
        // ✅ Fixed: typo $psotId → $postId and added () to auth()->id
        $comment = Comment::where('post_id', $postId)
        ->where('id', $commentId)
        ->where('user_id', auth()->id())->firstOrFail();
        $comment->delete();
        return back()->with('success', 'Comment deleted successfully.');
    }

    public function destroy(string $id)
    {
        //
    }
}
