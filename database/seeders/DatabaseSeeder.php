<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

         User::updateOrCreate(
        ['email' => 'thonida2@gamil.com'],
        [
            'name' => 'Admin',
            'password' => bcrypt('Rupp2023@'), // set a secure password here
            // optionally, 'is_admin' => true, if you have an admin flag
        ]
    );

        $this->call([
        CategorySeeder::class,
        ProvinceSeeder::class,
    ]);
    }
}
