import trainVideo from '@/components/assets/train.mp4';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { BookOpen, Folder, FolderPlus } from 'lucide-react';

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
            <div className="flex h-full flex-1 flex-col gap-8 rounded-xl bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50 p-4 shadow-xl">
                <div className="mb-8 text-center">
                    <h1 className="animate-fade-in mb-4 flex items-center justify-center gap-4 bg-gradient-to-r from-green-600 via-blue-600 to-yellow-500 bg-clip-text text-5xl font-extrabold text-transparent drop-shadow-lg">
                        <img src="https://freesvg.org/img/AngkorWat.png" alt="Angkor Wat" className="h-20 w-20" />
                        Welcome to the Cambodia Tourism Blog
                        <img src="https://upload.wikimedia.org/wikipedia/commons/8/83/Flag_of_Cambodia.svg" alt="Flag" className="h-10 w-20" />
                    </h1>

                    <p className="animate-fade-in mx-auto mb-4 max-w-2xl text-xl text-gray-700 delay-100">
                        Discover the beauty, culture, and destinations of Cambodia. Explore blog posts, find hotels, and get inspired for your next
                        adventure. This platform helps travelers and locals share experiences, find the best places to stay, and plan memorable
                        journeys across Cambodia—all with a beautiful, easy-to-use interface.
                    </p>
                    <video
                        src={trainVideo}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="animate-fade-in mx-auto mb-6 w-full max-w-2xl rounded-lg shadow-lg delay-150"
                    />
                    <p className="animate-fade-in mx-auto max-w-xl text-lg font-semibold text-green-700 delay-200">
                        Life can be hard, but don't forget to take a break and explore the world around you. Cambodia is waiting for you—get out,
                        travel, and make memories. You deserve it!
                    </p>
                </div>
                <div className="flex justify-center gap-6">
                    <a
                        href="/user/posts"
                        className="flex items-center gap-2 rounded-lg border-2 border-blue-300 px-6 py-3 text-blue-300 transition hover:bg-blue-300 hover:text-white"
                    >
                        <BookOpen className="h-6 w-6" />
                        Blogs
                    </a>
                    <a
                        href="/user/posts?category=12"
                        className="flex items-center gap-2 rounded-lg border-2 border-green-300 px-6 py-3 text-green-300 transition hover:bg-green-300 hover:text-white"
                    >
                        <FolderPlus className="h-6 w-6" />
                        Hotels
                    </a>
                    <a
                        href="/user/aboutme"
                        className="flex items-center gap-2 rounded-lg border-2 border-yellow-300 px-6 py-3 text-yellow-300 transition hover:bg-yellow-300 hover:text-white"
                    >
                        <Folder className="h-6 w-6" />
                        AboutMe
                    </a>
                </div>
            </div>
        </AppLayout>
    );
}
