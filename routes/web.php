<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProvinceController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ContactController;


Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [PostController::class, 'dashboard'])->name('dashboard');
});

Route::prefix('admin')->name('admin.')->group(function(){
    Route::resource('categories', CategoryController::class)->except(['show']);
    Route::resource('posts', PostController::class)->except(['show']);
    Route::resource('provinces', ProvinceController::class)->except(['show']);
    // Route::get('/posts/{post}/edit', [PostController::class, 'edit'])->name('admin.posts.edit');
});

Route::prefix('user')-> name('user.')->group(function(){
    Route::resource('posts', UserController::class)->except(['show']);
    Route::get('posts/{id}', [UserController::class, 'show'])-> name ('posts.show');
    Route::post('posts/{id}/comments', [UserController::class, 'storeComment'])-> name('posts.comments.store');
    Route::delete('posts/{postId}/comments/{commentId}',[UserController::class, 'destroyComment'])-> name('posts.comments.destroy');
    Route::get('/aboutme', function () {
        return Inertia::render('user/aboutme'); // This should match React page in ./pages/AboutMe.tsx
    });
    Route::get('hotels', [UserController::class, 'hotels'])->name('hotels.index');
});

Route::get('/api/posts', function () {
    return \App\Models\Post::with('category')->get()->transform(function ($post) {
        $post->image_url = $post->image ? asset('storage/' . $post->image) : null;
        return $post;
    });
});

// Contact form endpoint
Route::post('/contact', [ContactController::class, 'send']);


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
