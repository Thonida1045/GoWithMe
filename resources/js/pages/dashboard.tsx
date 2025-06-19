import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import trainVideo from '@/components/assets/train.mp4';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Home',
        href: '/',
    },
];

export default function WelcomePage() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Welcome" />
            <div className="flex h-full flex-1 flex-col gap-8 rounded-xl p-4 bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50 shadow-xl">
                <div className="mb-8 text-center">
                    <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-blue-600 to-yellow-500 mb-4 drop-shadow-lg animate-fade-in">Welcome to the Cambodia Tourism Blog</h1>
                    <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-4 animate-fade-in delay-100">
                        Discover the beauty, culture, and destinations of Cambodia. Explore blog posts, find hotels, and get inspired for your next adventure. This platform helps travelers and locals share experiences, find the best places to stay, and plan memorable journeys across Cambodia—all with a beautiful, easy-to-use interface.
                    </p>
                    <video src={trainVideo} autoPlay loop muted playsInline className="w-full max-w-2xl mx-auto rounded-lg shadow-lg mb-6 animate-fade-in delay-150" />
                    <p className="text-green-700 font-semibold text-lg max-w-xl mx-auto animate-fade-in delay-200">
                        Life can be hard, but don't forget to take a break and explore the world around you. Cambodia is waiting for you—get out, travel, and make memories. You deserve it!
                    </p>
                </div>
                
            </div>
        </AppLayout>
    );
}
