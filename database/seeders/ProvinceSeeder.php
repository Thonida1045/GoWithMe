<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Province; // <--- Add this line

class ProvinceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $provinces = [
            ['name_en' => 'Banteay Meanchey', 'name_km' => 'បន្ទាយមានជ័យ'],
            ['name_en' => 'Battambang', 'name_km' => 'បាត់ដំបង'],
            ['name_en' => 'Kampong Cham', 'name_km' => 'កំពង់ចាម'],
            ['name_en' => 'Kampong Chhnang', 'name_km' => 'កំពង់ឆ្នាំង'],
            ['name_en' => 'Kampong Speu', 'name_km' => 'កំពង់ស្ពឺ'],
            ['name_en' => 'Kampong Thom', 'name_km' => 'កំពង់ធំ'],
            ['name_en' => 'Kampot', 'name_km' => 'កំពត'],
            ['name_en' => 'Kandal', 'name_km' => 'កណ្ដាល'],
            ['name_en' => 'Koh Kong', 'name_km' => 'កោះកុង'],
            ['name_en' => 'Kratie', 'name_km' => 'ក្រចេះ'],
            ['name_en' => 'Mondulkiri', 'name_km' => 'មណ្ឌលគិរី'],
            ['name_en' => 'Phnom Penh', 'name_km' => 'ភ្នំពេញ'],
            ['name_en' => 'Preah Vihear', 'name_km' => 'ព្រះវិហារ'],
            ['name_en' => 'Prey Veng', 'name_km' => 'ព្រៃវែង'],
            ['name_en' => 'Pursat', 'name_km' => 'ពោធិ៍សាត់'],
            ['name_en' => 'Ratanakiri', 'name_km' => 'រតនគិរី'],
            ['name_en' => 'Siem Reap', 'name_km' => 'សៀមរាប'],
            ['name_en' => 'Preah Sihanouk', 'name_km' => 'ព្រះសីហនុ'],
            ['name_en' => 'Stung Treng', 'name_km' => 'ស្ទឹងត្រែង'],
            ['name_en' => 'Svay Rieng', 'name_km' => 'ស្វាយរៀង'],
            ['name_en' => 'Takeo', 'name_km' => 'តាកែវ'],
            ['name_en' => 'Oddar Meanchey', 'name_km' => 'ឧត្ដរមានជ័យ'],
            ['name_en' => 'Kep', 'name_km' => 'កែប'],
            ['name_en' => 'Pailin', 'name_km' => 'ប៉ៃលិន'],
            ['name_en' => 'Tboung Khmum', 'name_km' => 'ត្បូងឃ្មុំ'],
        ];

        foreach ($provinces as $provinceData) {
            // Check if a province with this English name already exists
            // You can also check by 'name_km' if you prefer, or both
            $existingProvince = Province::where('name_en', $provinceData['name_en'])->first();

            if (!$existingProvince) {
                // If it doesn't exist, create it
                Province::create($provinceData);
            }
        }
    }
}