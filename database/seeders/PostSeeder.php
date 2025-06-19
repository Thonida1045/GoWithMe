<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('posts')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Map category and province names to their IDs
        $categoryMap = DB::table('categories')->pluck('id', 'name')->mapWithKeys(function($id, $name) {
            return [strtolower($name) => $id];
        });
        $provinceMap = DB::table('provinces')->pluck('id', 'name_en')->mapWithKeys(function($id, $name) {
            return [strtolower($name) => $id];
        });

        $posts = [
            [
                'title' => 'Angkor Wat',
                'province' => 'Siem Reap',
                'category' =>  'Temple',
                'content' => "Angkor Wat, the crown jewel of Cambodia, stands as the world's largest religious monument and a breathtaking testament to the genius of the Khmer Empire. Built in the 12th century by King Suryavarman II, this vast temple complex was originally dedicated to the Hindu god Vishnu before gradually transforming into a Buddhist center. Its perfect symmetry, intricate bas-reliefs depicting Hindu epics, and the iconic five towers that silhouette against the sunrise make it a site of profound spiritual and architectural significance. Surrounded by a massive moat, Angkor Wat is a microcosm of the Hindu universe, leaving visitors in awe of its scale and artistry.",
                'image' => 'posts/AngkorWat.jpg',
                'published_at' => Carbon::now()->subDays(10),
                'created_at' => Carbon::now()->subDays(20),
                'updated_at' => Carbon::now()->subDays(20),
            ],
            [
                'title' => 'Bayon Temple',
                'province' => 'Siem Reap',
                'category' =>  'Temple',
                'content' => "Located at the heart of the ancient city of Angkor Thom, the Bayon Temple is a masterpiece of Khmer art, famous for its enigmatic stone faces. Over 200 serene and smiling faces, thought to be a depiction of King Jayavarman VII himself as a bodhisattva, gaze out from its 54 Gothic-style towers. Unlike the classical simplicity of Angkor Wat, Bayon is a complex and richly decorated temple. Its lower galleries contain stunning bas-reliefs that vividly portray not only historical battles but also scenes of everyday life in 12th-century Cambodia, offering a unique window into the past.",
                'image' => 'posts/Bayon_Temple.jpg',
                'published_at' => Carbon::now()->subDays(9),
                'created_at' => Carbon::now()->subDays(19),
                'updated_at' => Carbon::now()->subDays(19),
            ],
            [
                'title' => 'Ta Prohm',
                'province' => 'Siem Reap',
                'category' =>  'Temple',
                'content' => "Famed for its appearance in the movie 'Tomb Raider,' Ta Prohm is the quintessential 'lost temple.' Left largely to the mercy of the jungle, its stone walls are locked in the powerful embrace of giant silk-cotton and strangler fig trees. The roots snake over doorways and through crumbling galleries, creating an otherworldly atmosphere where nature and architecture merge. Originally a Buddhist monastery and university founded by King Jayavarman VII, Ta Prohm was intentionally left unrestored to showcase how these ancient structures appeared when they were rediscovered, offering a hauntingly beautiful and romantic experience.",
                'image' => 'posts/Ta_Prohm.jpg',
                'published_at' => Carbon::now()->subDays(8),
                'created_at' => Carbon::now()->subDays(18),
                'updated_at' => Carbon::now()->subDays(18),
            ],
            [
                'title' => 'Bokor Mountain',
                'province' => 'Kampot',
                'category' =>  'Mountain',
                'content' => "Rising over 1,000 meters above the Cambodian coastline, Phnom Bokor National Park offers a cool, misty escape. The main attraction is the abandoned French colonial hill station, a ghost town featuring the hauntingly beautiful Bokor Palace Hotel & Casino and a weathered Catholic church. These ruins, often shrouded in fog, offer a glimpse into a bygone era. Today, new developments coexist with the old, but the park remains a sanctuary of lush jungle, rare wildlife, and spectacular viewpoints that stretch across the Gulf of Thailand on a clear day, making the winding journey to the top well worth the effort.",
                'image' => 'posts/Bokor_Mountain.jpg',
                'published_at' => Carbon::now()->subDays(7),
                'created_at' => Carbon::now()->subDays(17),
                'updated_at' => Carbon::now()->subDays(17),
            ],
            [
                'title' => 'Koh Rong',
                'province' => 'Preah Sihanouk',
                'category' =>  'Island',
                'content' => "Koh Rong is Cambodia's second-largest island, a tropical paradise that perfectly blends vibrant beach life with untouched nature. It boasts over 23 pristine white-sand beaches, each with its own character. The main tourist hub, Koh Touch, is famous for its bustling nightlife and guesthouses. For a more secluded experience, travelers can venture to Long Beach for spectacular sunsets or snorkel in the crystal-clear turquoise waters of Lonely Beach. A magical highlight is swimming at night among bioluminescent plankton, which light up the water around you like stars.",
                'image' => 'posts/Koh_Rong.jpg',
                'published_at' => Carbon::now()->subDays(6),
                'created_at' => Carbon::now()->subDays(16),
                'updated_at' => Carbon::now()->subDays(16),
            ],
            [
                'title' => 'Koh Rong Samloem',
                'province' => 'Preah Sihanouk',
                'category' =>  'Island',
                'content' => "A short ferry ride from its more boisterous sister island, Koh Rong Samloem offers a more serene and peaceful escape. This island is the epitome of a tranquil paradise, with the stunning, crescent-shaped Saracen Bay at its heart. Here, you'll find idyllic resorts, overwater swings, and calm, shallow waters perfect for relaxation. The island is less developed, making it ideal for nature lovers who can enjoy snorkeling at Lazy Beach or trekking through the lush jungle interior to discover hidden coves and waterfalls. It's the perfect place to disconnect and embrace the slow pace of island life.",
                'image' => 'posts/Koh_Rong_Samloem.jpg',
                'published_at' => Carbon::now()->subDays(5),
                'created_at' => Carbon::now()->subDays(15),
                'updated_at' => Carbon::now()->subDays(15),
            ],
            [
                'title' => 'Kirirom National Park',
                'province' => 'Kampong Speu',
                'category' =>  'Nationalpark',
                'content' => "Meaning 'Mountain of Joy,' Kirirom National Park is a unique high-altitude plateau known for its beautiful pine forests, a rare sight in Cambodia. Its cooler climate provides a refreshing retreat from the heat of the plains and nearby Phnom Penh. The park is a haven for nature lovers, offering hiking trails that wind through the fragrant pine trees, past cascading waterfalls and local farms. It’s an ideal destination for camping, picnicking, and discovering the diverse flora and fauna that thrive in this highland ecosystem.",
                'image' => 'posts/Kirirom_National_Park.jpg',
                'published_at' => Carbon::now()->subDays(4),
                'created_at' => Carbon::now()->subDays(14),
                'updated_at' => Carbon::now()->subDays(14),
            ],
            [
                'title' => 'Phnom Kulen',
                'province' => 'Siem Reap',
                'category' =>  'Mountain',
                'content' => "Phnom Kulen is considered by Cambodians to be the most sacred mountain in the country. It was here in 802 AD that King Jayavarman II declared himself a 'devaraja' (god-king), marking the birth of the great Khmer Empire. Today, it remains a major pilgrimage site. Visitors can explore the River of a Thousand Lingas, where ancient phallic symbols are carved into the riverbed to bless the water flowing to the Angkorian plains. The mountain is also home to a large reclining Buddha statue and two beautiful waterfalls that are popular spots for swimming and picnicking.",
                'image' => 'posts/Phnom_Kulen.jpg',
                'published_at' => Carbon::now()->subDays(3),
                'created_at' => Carbon::now()->subDays(13),
                'updated_at' => Carbon::now()->subDays(13),
            ],
            [
                'title' => 'Preah Vihear Temple',
                'province' => 'Preah Vihear',
                'category' =>  'Temple',
                'content' => "Perched dramatically atop a 525-meter cliff in the Dângrêk Mountains, Preah Vihear Temple is a UNESCO World Heritage site with an unparalleled setting. This ancient Hindu temple, built over several centuries, was dedicated to the god Shiva. Its series of sanctuaries, linked by a system of causeways and staircases over an 800-meter axis, is a masterpiece of Khmer architecture. The real highlight is the breathtaking panoramic view from the top, which extends for miles across the vast Cambodian plains, offering a sense of awe and wonder.",
                'image' => 'posts/Preah_Vihear_Temple.jpg',
                'published_at' => Carbon::now()->subDays(2),
                'created_at' => Carbon::now()->subDays(12),
                'updated_at' => Carbon::now()->subDays(12),
            ],
            [
                'title' => 'Wat Phnom',
                'province' => 'Phnom Penh',
                'category' =>  'Temple',
                'content' => "Wat Phnom is the historical and spiritual heart of Cambodia's capital city. According to legend, the first pagoda was erected here in 1372 by a wealthy widow named Penh after she discovered four sacred Buddha statues in a floating Koki tree. The temple sits on a 27-meter-high man-made hill, the only one in the city. Today, it's a bustling hub of activity where locals come to pray for good fortune and success. The complex, with its central stupa, shrines, and lush gardens, offers a peaceful green space and a glimpse into the city's founding myth.",
                'image' => 'posts/Wat_Phnom.jpg',
                'published_at' => Carbon::now()->subDay(),
                'created_at' => Carbon::now()->subDays(11),
                'updated_at' => Carbon::now()->subDays(11),
            ],
            [
                'title' => 'Royal Palace',
                'province' => 'Phnom Penh',
                'category' => 'Palace' ,
                'content' => 'A grand complex serving as the official residence of Cambodia’s royal family.',
                'image' => 'posts/RoyalPalace.jpg',
                'published_at' => Carbon::now()->subDays(10),
                'created_at' => Carbon::now()->subDays(10),
                'updated_at' => Carbon::now()->subDays(10),
            ],
            [
                'title' => 'Independence Monument',
                'province' => 'Phnom Penh',
                'category' =>  'Monument',
                'content' => 'A landmark monument honoring Cambodia’s independence from France in 1953.',
                'image' => 'posts/Independence_Monument.jpg',
                'published_at' => Carbon::now()->subDays(9),
                'created_at' => Carbon::now()->subDays(9),
                'updated_at' => Carbon::now()->subDays(9),
            ],
            [
                'title' => 'Tonle Sap Lake',
                'province' => 'Siem Reap',
                'category' =>  'Lake',
                'content' => 'Southeast Asia\'s largest freshwater lake, home to floating villages and diverse wildlife.',
                'image' => 'posts/Tonle_Sap_Lake.jpg',
                'published_at' => Carbon::now()->subDays(8),
                'created_at' => Carbon::now()->subDays(8),
                'updated_at' => Carbon::now()->subDays(8),
            ],
            [
                'title' => 'Cardamom Mountains',
                'province' => 'Koh Kong',
                'category' =>  'Mountain',
                'content' => 'A vast, untouched rainforest region perfect for eco-tourism, trekking, and wildlife exploration.',
                'image' => 'posts/Cardamom_Mountains.jpg',
                'published_at' => Carbon::now()->subDays(7),
                'created_at' => Carbon::now()->subDays(7),
                'updated_at' => Carbon::now()->subDays(7),
            ],
            [
                'title' => 'Sambor Prei Kuk',
                'province' => 'Kampong Thom',
                'category' =>  'Temple',
                'content' => 'A pre-Angkorian archaeological site with ancient temples hidden in the jungle.',
                'image' => 'posts/Sambor_Prei_Kuk.jpg',
                'published_at' => Carbon::now()->subDays(6),
                'created_at' => Carbon::now()->subDays(6),
                'updated_at' => Carbon::now()->subDays(6),
            ],
            [
                'title' => 'Otres Beach',
                'province' => 'Preah Sihanouk',
                'category' =>  'Beach',
                'content' => 'A peaceful stretch of sandy beach, popular with backpackers and nature lovers.',
                'image' => 'posts/Otres_Beach.jpg',
                'published_at' => Carbon::now()->subDays(5),
                'created_at' => Carbon::now()->subDays(5),
                'updated_at' => Carbon::now()->subDays(5),
            ],
            [
                'title' => 'Kampot River',
                'province' => 'Kampot',
                'category' =>  'River',
                'content' => 'A scenic river perfect for kayaking, sunset cruises, and riverside dining.',
                'image' => 'posts/Kampot_River.jpg',
                'published_at' => Carbon::now()->subDays(4),
                'created_at' => Carbon::now()->subDays(4),
                'updated_at' => Carbon::now()->subDays(4),
            ],
            [
                'title' => 'Phnom Sampov',
                'province' => 'Battambang',
                'category' =>  'Mountain',
                'content' => 'A hilltop temple complex with war memorials and the famous bat cave.',
                'image' => 'posts/Phnom_Sampov.jpg',
                'published_at' => Carbon::now()->subDays(3),
                'created_at' => Carbon::now()->subDays(3),
                'updated_at' => Carbon::now()->subDays(3),
            ],
            [
                'title' => 'Ek Phnom Temple',
                'province' => 'Battambang',
                'category' => 'Temple',
                'content' => 'A partially collapsed 11th-century temple surrounded by rural countryside.',
                'image' => 'posts/Ek_Phnom_Temple.jpg',
                'published_at' => Carbon::now()->subDays(2),
                'created_at' => Carbon::now()->subDays(2),
                'updated_at' => Carbon::now()->subDays(2),
            ],
            [
                'title' => 'Ream National Park',
                'province' => 'Preah Sihanouk',
                'category' => 'Nationalpark',
                'content' => 'A coastal park featuring mangroves, islands, wildlife, and quiet beaches.',
                'image' => 'posts/Ream_National_Park.jpg',
                'published_at' => Carbon::now()->subDay(),
                'created_at' => Carbon::now()->subDay(),
                'updated_at' => Carbon::now()->subDay(),
            ],
            [
                'title' => 'Raffles Hotel Le Royal',
                'province' => 'Phnom Penh',
                'category' => 'Hotel',
                'content' => 'An iconic heritage hotel, Raffles Le Royal offers a journey back to a bygone era of elegance and charm. With its classic French colonial architecture, lush tropical gardens, and two swimming pools, it provides a sanctuary in the heart of the capital. Don’t miss a signature cocktail at the legendary Elephant Bar. From the hotel, you can easily explore the city’s key attractions. A short trip takes you to the historic Wat Phnom, the dazzling Royal Palace, the Silver Pagoda, and the National Museum, which houses priceless Khmer artifacts. A stroll along the nearby riverside promenade is perfect for a relaxing evening.',
                'image' => 'posts/RafflesHotelLeRoyal.webp',
                'published_at' => Carbon::now()->subDays(1),
                'created_at' => Carbon::now()->subDays(1),
                'updated_at' => Carbon::now()->subDays(1),
            ],
            [
                'title' => 'Rosewood Phnom Penh',
                'province' => 'Phnom Penh',
                'category' => 'Hotel',
                'content' => 'Occupying the top 14 floors of the modern Vattanac Capital Tower, Rosewood offers unparalleled luxury and breathtaking 360-degree views of Phnom Penh. The hotel features ultra-modern rooms, a serene spa, and exquisite dining options, including the stunning Sora Sky Bar. Staying here places you in a prime location to explore. You can visit the art deco Central Market (Phsar Thmey) for shopping, discover the nearby historic Phnom Penh Railway Station, or take a short tuk-tuk ride to the bustling Riverside area for dining and sightseeing.',
                'image' => 'posts/RosewoodPhnomPenh.jpg',
                'published_at' => Carbon::now()->subDays(1),
                'created_at' => Carbon::now()->subDays(1),
                'updated_at' => Carbon::now()->subDays(1),
            ],
            [
                'title' => 'Park Hyatt Siem Reap',
                'province' => 'Siem Reap',
                'category' => 'Hotel',
                'content' => 'A luxurious blend of Khmer-inspired design and modern comfort, the Park Hyatt is a sophisticated oasis in the heart of Siem Reap. This elegant hotel is known for its beautiful courtyard, two swimming pools, and art deco aesthetics. It offers a tranquil retreat just steps away from the city’s vibrant center. When you venture out, the lively Pub Street and the bustling Old Market (Phsar Chas) are within easy walking distance. The magnificent temples of the Angkor Archaeological Park, including the world-famous Angkor Wat, are just a short drive away.',
                'image' => 'posts/ParkHyattSiemReap.jpg',
                'published_at' => Carbon::now()->subDays(1),
                'created_at' => Carbon::now()->subDays(1),
                'updated_at' => Carbon::now()->subDays(1),
            ],
            [
                'title' => 'Song Saa Private Island',
                'province' => 'Preah Sihanouk',
                'category' => 'Hotel',
                'content' => 'Song Saa offers the ultimate "barefoot luxury" experience on its own private island in the Koh Rong archipelago. The resort features stunning overwater, jungle, and ocean-view villas, each with a private pool. It is a leader in sustainable tourism, with a focus on protecting the local marine life and supporting the nearby community. While the island itself is the main destination, activities abound. You can explore the resort’s private marine reserve by snorkeling or kayaking, relax at the world-class spa, or take a boat to the nearby village of Prek Svay to experience local life.',
                'image' => 'posts/SongSaaPrivateIsland.jpg',
                'published_at' => Carbon::now()->subDays(1),
                'created_at' => Carbon::now()->subDays(1),
                'updated_at' => Carbon::now()->subDays(1),
            ],
            [
                'title' => 'Knai Bang Chatt',
                'province' => 'Kep',
                'category' => 'Hotel',
                'content' => 'Located in the charming coastal town of Kep, Knai Bang Chatt is a unique boutique resort composed of beautifully restored 1960s modernist villas. The hotel exudes an atmosphere of serene tranquility, with a stunning infinity pool that looks out over the Gulf of Thailand. From this peaceful base, you can easily explore the best of Kep. A must-do is visiting the famous Kep Crab Market for fresh seafood. For nature lovers, Kep National Park offers scenic hiking trails with monkeys and beautiful viewpoints. You can also take a short boat trip to the rustic Rabbit Island (Koh Tonsay) for a day of swimming and relaxation.',
                'image' => 'posts/Knai BangChatt.jpg',
                'published_at' => Carbon::now()->subDays(1),
                'created_at' => Carbon::now()->subDays(1),
                'updated_at' => Carbon::now()->subDays(1),
            ],
            [
                'title' => 'Amber Kampot',
                'province' => 'Kampot',
                'category' => 'Hotel',
                'content' => 'Amber Kampot is a premier luxury resort situated on the tranquil banks of the Kampot River. It features contemporary and spacious villas, many with their own private pools, set against a backdrop of lush greenery. The resort is a perfect blend of modern comfort and natural beauty. Staying here allows you to enjoy the peaceful riverside while being close to local attractions. You can take a sunset cruise on the river to see the fireflies, visit the famous local pepper plantations to learn about world-renowned Kampot pepper, or take a day trip up the winding road to explore the cool climate and historic ruins of Bokor National Park.',
                'image' => 'posts/AmberKampot.jpg',
                'published_at' => Carbon::now()->subDays(1),
                'created_at' => Carbon::now()->subDays(1),
                'updated_at' => Carbon::now()->subDays(1),
            ],
            [
                'title' => 'Jaya House River Park',
                'province' => 'Siem Reap',
                'category' => 'Hotel',
                'content' => 'A tranquil gem located along the Siem Reap River, Jaya House is a boutique hotel with a strong commitment to environmental sustainability and community. The hotel is renowned for its exceptional service, lush tropical gardens, and two stunning swimming pools. Its location offers a peaceful escape from the downtown hustle. From here, you can enjoy a scenic drive along the river to the Angkor complex. It is also well-positioned for visiting the Landmine Museum and the beautiful temple of Banteay Srei. The hotel offers free tuk-tuk service to the city center for when you wish to explore Pub Street and the markets.',
                'image' => 'posts/JayaHouseRiverPark.jpg',
                'published_at' => Carbon::now()->subDays(1),
                'created_at' => Carbon::now()->subDays(1),
                'updated_at' => Carbon::now()->subDays(1),
            ],
            [
                'title' => 'Six Senses Krabey Island',
                'province' => 'Preah Sihanouk',
                'category' => 'Hotel',
                'content' => 'Six Senses Krabey Island is a secluded paradise dedicated to wellness, luxury, and nature. The resort features 40 private pool villas nestled into the lush vegetation of a pristine private island. The world-class spa is a highlight, offering a wide range of holistic treatments and wellness programs. The island itself is the main attraction, with a private beach, water sports, and beautiful nature trails. From the mainland jetty, you are close enough to explore the mangrove forests of Ream National Park before or after your island escape, giving you a perfect combination of jungle and sea.',
                'image' => 'posts/SixSensesKrabeyIsland.jpg',
                'published_at' => Carbon::now()->subDays(1),
                'created_at' => Carbon::now()->subDays(1),
                'updated_at' => Carbon::now()->subDays(1),
            ],
            [
                'title' => 'Shinta Mani Angkor',
                'province' => 'Siem Reap',
                'category' => 'Hotel',
                'content' => 'Designed by the acclaimed architect Bill Bensley, Shinta Mani Angkor is a stylish boutique hotel that artfully blends modern design with Khmer inspiration. Located in the quiet French Quarter, the hotel is also a leader in responsible tourism, with proceeds supporting the Shinta Mani Foundation to empower the local community. It offers a sophisticated and peaceful stay. From the hotel, you are just a short walk from the Angkor National Museum and the vibrant restaurant scene. The main temples of Angkor Wat are easily accessible by a short tuk-tuk ride, making it an ideal base for both cultural exploration and relaxation.',
                'image' => 'posts/ShintaManiAngkor.jpg',
                'published_at' => Carbon::now()->subDays(1),
                'created_at' => Carbon::now()->subDays(1),
                'updated_at' => Carbon::now()->subDays(1),
            ],
            [
                'title' => 'Mayura Hill Resort',
                'province' => 'Mondulkiri',
                'category' => 'Hotel',
                'content' => 'Escape to the cool, rolling hills of Cambodia’s eastern province at Mayura Hill Resort. This boutique resort offers comfortable and elegant villas with stunning panoramic views of the surrounding landscape, providing a luxurious base for exploring this unique region. Mondulkiri is known for its natural beauty and indigenous culture. From the resort, you can arrange a visit to the acclaimed Elephant Valley Project, an ethical elephant sanctuary. You can also travel to the thunderous Bou Sra Waterfall, one of Cambodia’s largest, or visit local Bunong villages to learn about their unique culture and coffee plantations.',
                'image' => 'posts/MayuraHillResort.avif',
                'published_at' => Carbon::now()->subDays(1),
                'created_at' => Carbon::now()->subDays(1),
                'updated_at' => Carbon::now()->subDays(1),
            ],
        ];

        $finalPosts = [];
        foreach ($posts as $post) {
            $categoryKey = strtolower($post['category']);
            $provinceKey = strtolower($post['province']);
            $categoryId = $categoryMap[$categoryKey] ?? null;
            $provinceId = $provinceMap[$provinceKey] ?? null;
            if ($categoryId && $provinceId) {
                $slug = Str::slug($post['title']);
                $finalPosts[] = [
                    'title' => $post['title'],
                    'slug' => $slug,
                    'category_id' => $categoryId,
                    'province_id' => $provinceId,
                    'content' => $post['content'],
                    'image' => $post['image'],
                    'published_at' => $post['published_at'],
                    'created_at' => $post['created_at'],
                    'updated_at' => $post['updated_at'],
                ];
            }
        }

        DB::table('posts')->insert($finalPosts);
    }
}
