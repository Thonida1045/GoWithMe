<?php
// database/migrations/YYYY_MM_DD_HHMMSS_add_slug_to_posts_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            // Add the slug column after the 'title' column
            $table->string('slug')->unique()->after('title');
        });
    }

    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            // Drop the slug column if rolling back
            $table->dropColumn('slug');
        });
    }
};