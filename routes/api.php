<?php
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PostApiController;
use App\Http\Controllers\PostController;
Route::get('/hello', function (Request $request) {
    return response()->json(['message' => 'Hello, API!']);
});


Route::apiResource('posts', PostApiController::class);
// Route::get('/posts', function () {
//     return Post::with('category')->get()->transform(function ($post) {
//         $post->image_url = $post->image ? asset('storage/' . $post->image) : null;
//         return $post;
//     });
// });
Route::get('/posts', [PostController::class, 'userIndex']);