<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Post;

class PostApiController extends Controller
{
    public function index()
    {
        return Post::with('category')->get()->transform(function ($post) {
            $post->image_url = $post->image ? asset('storage/' . $post->image) : null;
            return $post;
        });
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'image' => 'nullable|image',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('posts', 'public');
        }

        $post = Post::create($validated);
        $post->load('category');
        $post->image_url = $post->image ? asset('storage/' . $post->image) : null;

        return response()->json($post, 201);
    }
}