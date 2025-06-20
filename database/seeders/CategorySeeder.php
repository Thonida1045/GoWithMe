<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        DB::table('categories')->insert([
            ['name' => 'Temple'],
            ['name' => 'River'],
            ['name' => 'Lake'],
            ['name' => 'Mountain'],
            ['name' => 'Hotel'],
            ['name' => 'Waterfall'],
            ['name' => 'National Park'],
            ['name' => 'Sanctuary'],
            ['name' => 'Palace'],
            ['name' => 'Monument'],
            ['name' => 'Farm'],
        ]);
    }
}
