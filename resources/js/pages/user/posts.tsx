import { Button } from '@/components/ui/button'; // Adjust path for Shadcn UI components
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout'; // Adjust this path if your main layout is different
import { type BreadcrumbItem } from '@/types'; // Adjust path based on your types definition
import { Head, router } from '@inertiajs/react';
import { CalendarDays, MessageSquare, Tag } from 'lucide-react'; // Icons
import { useEffect, useState } from 'react';
import { Toaster } from 'sonner'; // For notifications

// --- TypeScript Interfaces ---
interface Post {
    id: number;
    title: string;
    content: string;
    category: {
        id: number;
        name: string;
    };
    comments_count: number;
    created_at: string;
    image_url: string | null; // This is the full image URL from your Laravel model
}

interface Category {
    id: number;
    name: string;
}

interface PaginatedData {
    data: Post[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

interface PostsPageProps {
    posts: PaginatedData;
    categories: Category[];
    filters?: {
        search?: string;
        category?: string;
        sort?: string;
    };
}

// --- Default Props for safer rendering ---
const defaultPosts: PaginatedData = {
    data: [],
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
    links: [{ url: null, label: '1', active: true }],
};
const defaultFilters = {
    search: '',
    category: '',
    sort: '',
};

// --- Breadcrumbs for navigation ---
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Posts',
        href: route('user.posts.index'), // Matches the route in web.php
    },
];

export default function PostsPage({ posts = defaultPosts, categories = [], filters = defaultFilters }: PostsPageProps) {
    // --- State for filters ---
    const [search, setSearch] = useState(filters?.search ?? '');
    const [selectedCategory, setSelectedCategory] = useState(filters?.category ?? 'all');
    const [sortBy, setSortBy] = useState(filters?.sort ?? 'latest');

    // Helper to construct query parameters for Inertia visits
    const getRouterParams = (newPage?: number) => ({
        page: newPage || posts.current_page,
        search: search,
        category: selectedCategory === 'all' ? '' : selectedCategory,
        sort: sortBy,
    });

    // --- Handlers for filter changes ---
    const handleSearch = (value: string) => {
        setSearch(value);
        router.get(
            route('user.posts.index'),
            { ...getRouterParams(), search: value }, // Update search param
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleCategoryChange = (value: string) => {
        setSelectedCategory(value);
        router.get(
            route('user.posts.index'),
            { ...getRouterParams(), category: value === 'all' ? '' : value }, // Update category param
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const handleSortChange = (value: string) => {
        setSortBy(value);
        router.get(
            route('user.posts.index'),
            { ...getRouterParams(), sort: value }, // Update sort param
            { preserveState: true, preserveScroll: true },
        );
    };

    // --- Handler for pagination changes ---
    const handlePageChange = (page: number) => {
        router.get(
            route('user.posts.index'),
            { ...getRouterParams(), page: page }, // Update page param
            { preserveState: true, preserveScroll: true },
        );
    };

    // Debug: Log the first post to check image_url
    useEffect(() => {
        if (posts.data.length > 0) {
            // eslint-disable-next-line no-console
            console.log('First post object:', posts.data[0]);
        }
    }, [posts.data]);

    // Fetch posts data from API
    // useEffect(() => {
    //     fetch('/api/posts')
    //         .then((res) => res.json())
    //         .then((data) => setPosts(data));
    // }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Posts" />
            <Toaster richColors closeButton position="top-right" />
            <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8">
                {' '}
                {/* Adjusted padding and gap */}
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Blog Posts</h1> {/* Enhanced title */}
                </div>
                {/* Filters Section */}
                <div className="mb-6 flex flex-wrap items-end gap-4">
                    {' '}
                    {/* Added items-end for alignment */}
                    <div className="max-w-md min-w-[200px] flex-1">
                        <label htmlFor="search-posts" className="sr-only">
                            Search Posts
                        </label>{' '}
                        {/* Accessibility */}
                        <Input
                            id="search-posts"
                            type="text"
                            placeholder="Search posts by title or content..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full"
                        />
                    </div>
                    <div>
                        <label htmlFor="category-select" className="sr-only">
                            Filter by Category
                        </label>
                        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                            <SelectTrigger id="category-select" className="w-[180px]">
                                <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.id.toString()}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <label htmlFor="sort-select" className="sr-only">
                            Sort by
                        </label>
                        <Select value={sortBy} onValueChange={handleSortChange}>
                            <SelectTrigger id="sort-select" className="w-[180px]">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="latest">Latest</SelectItem>
                                <SelectItem value="most_commented">Most Commented</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                {/* Posts Grid Display */}
                {Array.isArray(posts.data) && posts.data.length > 0 ? (
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {' '}
                        {/* Increased gap, added xl column */}
                        {posts.data.map((post) => (
                            <div
                                key={post.id}
                                className="flex cursor-pointer flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg transition-all duration-300 hover:shadow-xl" // Added flex-col for consistent height
                                onClick={() => router.visit(route('user.posts.show', post.id))} // Make entire card clickable
                            >
                                {/* IMAGE SECTION: This comes first */}
                                <div className="relative">
                                    {post.image_url ? (
                        <img
                          src={post.image_url}
                          alt={post.title || 'Post Image'}
                          className="w-20 h-12 object-cover rounded"
                        />
                      ) : (
                        <span className="text-gray-400">No Image</span>
                      )}

                                    <div className="bg-opacity-70 absolute bottom-1 left-1 rounded bg-white px-1 text-xs text-gray-500">
                                        {post.image_url || 'No image_url'}
                                    </div>
                                </div>

                                <div className="flex flex-grow flex-col p-6">
                                    {' '}
                                    {/* Added flex-grow */}
                                    {/* TITLE SECTION: This comes after the image section */}
                                    <h2 className="mb-3 line-clamp-2 text-xl leading-tight font-bold text-gray-900">
                                        {' '}
                                        {/* Stronger title styling */}
                                        {post.title || 'Untitled'}
                                    </h2>
                                    <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                        {' '}
                                        {/* Slightly darker text, added flex-wrap */}
                                        <div className="flex items-center gap-1.5">
                                            {' '}
                                            {/* Adjusted gap */}
                                            <Tag className="h-4 w-4 text-blue-500" /> {/* Icon color */}
                                            <span className="font-medium">{post.category?.name || 'Uncategorized'}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <MessageSquare className="h-4 w-4 text-green-500" /> {/* Icon color */}
                                            <span>{post.comments_count || 0} Comments</span> {/* Added "Comments" text */}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <CalendarDays className="h-4 w-4 text-purple-500" /> {/* Icon color */}
                                            <span>
                                                {post.created_at
                                                    ? new Date(post.created_at).toLocaleDateString('en-US', {
                                                          year: 'numeric',
                                                          month: 'short',
                                                          day: 'numeric',
                                                      })
                                                    : 'N/A'}
                                            </span>{' '}
                                            {/* Nicer date format */}
                                        </div>
                                    </div>
                                    <p className="mb-4 line-clamp-3 flex-grow text-gray-700">
                                        {' '}
                                        {/* Slightly darker content text, flex-grow */}
                                        {post.content || 'No content available for this post.'}
                                    </p>
                                    <Button
                                        variant="default" // Changed to default variant for more prominence
                                        className="mt-auto w-full" // Pushed to bottom of card
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent card's onClick from firing again
                                            router.visit(route('user.posts.show', post.id));
                                        }}
                                    >
                                        Read More
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-lg border bg-gray-50 py-12 text-center text-lg text-gray-500">
                        <p className="mb-2">😔 No posts found matching your criteria.</p>
                        <p>Try adjusting your search or filters.</p>
                    </div>
                )}
                {/* Pagination Controls */}
                {posts.links.length > 3 && ( // Only show pagination if there are actual links beyond prev/next
                    <div className="mt-8 flex justify-center">
                        <nav className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(posts.current_page - 1)}
                                disabled={posts.current_page === 1}
                                className="h-8 px-2"
                            >
                                Previous
                            </Button>

                            <div className="flex items-center space-x-1">
                                {Array.isArray(posts.links) &&
                                    posts.links.map((link, i) => {
                                        // Filter out default "Previous" and "Next" labels from Laravel pagination links
                                        if (!link || link.label === '&laquo; Previous' || link.label === 'Next &raquo;') {
                                            return null;
                                        }

                                        if (link.label === '...') {
                                            return (
                                                <span key={i} className="px-2">
                                                    ...
                                                </span>
                                            );
                                        }

                                        // Ensure link.url exists and label is a number for page buttons
                                        if (!link.url || isNaN(parseInt(link.label))) {
                                            return null;
                                        }

                                        const page = parseInt(link.label);

                                        return (
                                            <Button
                                                key={i}
                                                variant={link.active ? 'default' : 'outline'}
                                                size="sm"
                                                onClick={() => handlePageChange(page)}
                                                className="h-8 w-8 p-0"
                                            >
                                                {link.label}
                                            </Button>
                                        );
                                    })}
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(posts.current_page + 1)}
                                disabled={posts.current_page === posts.last_page}
                                className="h-8 px-2"
                            >
                                Next
                            </Button>
                        </nav>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

