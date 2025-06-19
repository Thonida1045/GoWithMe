<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $latestPosts = \App\Models\Post::with('category', 'province')
            ->latest()
            ->take(5)
            ->get();

        $hotelPosts = \App\Models\Post::with('category', 'province')
            ->whereHas('category', fn($q) => $q->where('name', 'Hotel'))
            ->latest()
            ->take(6)
            ->get();

        return Inertia::render('dashboard', [
            'latestPosts' => $latestPosts,
            'hotelPosts' => $hotelPosts,
        ]);
    }
}
