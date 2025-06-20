import { Button } from '@/components/ui/button'; // Adjust path for Shadcn UI components
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout'; // Adjust this path if your main layout is different
import { type BreadcrumbItem } from '@/types'; // Adjust path based on your types definition
import { Head, router } from '@inertiajs/react';
  import { CalendarDays, MessageSquare, Tag } from 'lucide-react'; // Icons
  import { useEffect, useState } from 'react';
  import Board from "/storage/app/public/board/Board.gif";
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
    province?: {
        id: number;
        name_en: string;
        name_km: string;
    };
    comments_count: number;
    created_at: string;
    image_url: string | null; // This is the full image URL from your Laravel model
}

interface Category {
    id: number;
    name: string;
}

interface Province {
    id: number;
    name_en: string;
    name_km: string;
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
    provinces?: Province[];
}

interface PostsPageProps {
    posts: PaginatedData;
    categories: Category[];
    provinces: Province[]; // <-- Add this line
    filters?: {
        search?: string;
        category?: string;
        sort?: string;
        province?: string;
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
    province: '',
};

// --- Breadcrumbs for navigation ---
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Posts',
        href: route('user.posts.index'), // Matches the route in web.php
    },
];

export default function PostsPage({ posts = defaultPosts, categories = [], provinces = [], filters = defaultFilters }: PostsPageProps) {
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
            console.log('First post object:', posts.data[0]);
        }
        // Log provinces for debugging Select.Item error
        if (provinces && provinces.length > 0) {
            console.log('Provinces for Select:', provinces);
        }
    }, [posts.data, provinces]);

    // Fetch posts data from API
    // useEffect(() => {
    //     fetch('/api/posts')
    //         .then((res) => res.json())
    //         .then((data) => setPosts(data));
    // }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Posts" />
            <Toaster richColors closeButton position="top-right" theme="system" />
            <div className="flex min-h-screen flex-col gap-6 bg-white p-4 transition-colors duration-300 md:p-6 lg:p-8 dark:bg-[#18181b]">
                {' '}
                {/* Adjusted padding and gap */}
                <div className="mb-6 flex w-full flex-wrap items-end gap-4">
                    <h3 className="mr-6 mb-0 text-xl font-bold tracking-tight whitespace-nowrap text-gray-900 dark:text-gray-100">Blog Posts</h3>
                    {/* Filters Section */}
                    <div className="flex flex-1 flex-wrap items-end gap-4">
                        {/* Search */}
                        <div className="max-w-md min-w-[200px] flex-1">
                            <label htmlFor="search-posts" className="sr-only">
                                Search Posts
                            </label>
                            <Input
                                id="search-posts"
                                type="text"
                                placeholder="Search posts by title or content..."
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="w-full"
                            />
                        </div>
                        {/* Category filter (native select) */}
                        <div>
                            <label htmlFor="category-select" className="sr-only">
                                Filter by Category
                            </label>
                            <select
                                id="category-select"
                                value={selectedCategory}
                                onChange={(e) => handleCategoryChange(e.target.value)}
                                className="w-[180px] rounded border px-3 py-2"
                            >
                                <option value="all">All Categories</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id.toString()}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* Province filter (native select) */}
                        <div>
                            <label htmlFor="province-select" className="sr-only">
                                Filter by Province
                            </label>
                            <select
                                id="province-select"
                                value={(() => {
                                    const validProvinceIds = provinces.map((p) => p.id.toString());
                                    return typeof filters?.province === 'string' &&
                                        (filters.province === '' || validProvinceIds.includes(filters.province))
                                        ? filters.province
                                        : '';
                                })()}
                                onChange={(e) => {
                                    router.get(
                                        route('user.posts.index'),
                                        { ...getRouterParams(), province: e.target.value },
                                        { preserveState: true, preserveScroll: true, replace: true },
                                    );
                                }}
                                className="w-[180px] rounded border px-3 py-2"
                            >
                                <option value="">All Provinces</option>
                                {provinces
                                    .filter(
                                        (province) =>
                                            province &&
                                            typeof province.id === 'number' &&
                                            province.id > 0 &&
                                            typeof province.name_en === 'string' &&
                                            province.name_en.trim() !== '',
                                    )
                                    .map((province: Province) => (
                                        <option key={province.id} value={province.id.toString()}>
                                            {province.name_en}
                                        </option>
                                    ))}
                            </select>
                        </div>
                        {/* Sort filter (native select) */}
                        <div>
                            <label htmlFor="sort-select" className="sr-only">
                                Sort by
                            </label>
                            <select
                                id="sort-select"
                                value={sortBy}
                                onChange={(e) => handleSortChange(e.target.value)}
                                className="w-[180px] rounded border px-3 py-2"
                            >
                                <option value="latest">Latest</option>
                                <option value="most_commented">Most Commented</option>
                                <option value="oldest">Oldest</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="mb-4 flex w-full flex-col items-start overflow-hidden">
                    <img
                        src={Board}
                        alt="Board"
                        className="block h-[60vh] w-full max-w-full rounded border border-blue-200 bg-white object-contain shadow-lg dark:border-gray-700 dark:bg-[#23232a]"
                        style={{ marginTop: '0.5rem', width: '100%', maxWidth: '100%', height: '60vh' }}
                    />
                </div>
                {/* Posts Grid Display */}
                {Array.isArray(posts.data) && posts.data.length > 0 ? (
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {' '}
                        {/* Increased gap, added xl column */}
                        {posts.data.map((post) => {
                            // Truncate content to 20 words
                            const contentWords = post.content ? post.content.split(/\s+/) : [];
                            const truncatedContent = contentWords.length > 20 ? contentWords.slice(0, 20).join(' ') + '...' : post.content;
                            return (
                                <div
                                    key={post.id}
                                    className="flex h-full min-h-[420px] cursor-pointer flex-col overflow-hidden rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-purple-100 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl dark:border-gray-700 dark:from-[#23232a] dark:via-[#18181b] dark:to-[#23232a]"
                                    style={{ minHeight: 420, height: '100%' }}
                                    onClick={() => router.visit(route('user.posts.show', post.id))}
                                >
                                    {/* IMAGE SECTION: This comes first */}
                                    <div className="relative aspect-video w-full bg-gradient-to-tr from-blue-200 via-purple-100 to-pink-100 dark:from-[#23232a] dark:via-[#18181b] dark:to-[#23232a]">
                                        {post.image_url ? (
                                            <img
                                                src={post.image_url}
                                                alt={post.title || 'Post Image'}
                                                className="h-full w-full rounded-t-xl border-b border-blue-100 object-cover dark:border-gray-700"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-blue-100 dark:bg-[#23232a]">
                                                <span className="text-blue-400 dark:text-gray-400">No Image</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-grow flex-col p-6">
                                        <div className="mb-3 flex items-center justify-between">
                                            <h2 className="line-clamp-2 text-xl leading-tight font-bold text-blue-900 dark:text-blue-200">
                                                {post.title || 'Untitled'}
                                            </h2>
                                            {post.province && (
                                                <span className="ml-2 rounded border border-purple-200 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 px-2 py-1 text-xs font-semibold text-purple-700 shadow-sm dark:border-purple-800 dark:from-[#23232a] dark:via-[#18181b] dark:to-[#23232a] dark:text-purple-300">
                                                    {post.province.name_en}
                                                </span>
                                            )}
                                        </div>
                                        <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-blue-700 dark:text-blue-300">
                                            <div className="flex items-center gap-1.5">
                                                <Tag className="h-4 w-4 text-blue-500 dark:text-blue-300" />
                                                <span className="font-medium">{post.category?.name || 'Uncategorized'}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <MessageSquare className="h-4 w-4 text-green-500 dark:text-green-300" />
                                                <span>{post.comments_count || 0} Comments</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <CalendarDays className="h-4 w-4 text-purple-500 dark:text-purple-300" />
                                                <span>
                                                    {post.created_at
                                                        ? new Date(post.created_at).toLocaleDateString('en-US', {
                                                              year: 'numeric',
                                                              month: 'short',
                                                              day: 'numeric',
                                                          })
                                                        : 'N/A'}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="mb-4 line-clamp-3 flex-grow text-blue-900/80 dark:text-blue-100/80">
                                            {truncatedContent}
                                            {contentWords.length > 20 && (
                                                <span
                                                    className="ml-1 cursor-pointer font-semibold text-blue-500 dark:text-blue-300"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        router.visit(route('user.posts.show', post.id));
                                                    }}
                                                >
                                                    Read more
                                                </span>
                                            )}
                                        </p>
                                        <Button
                                            variant="default"
                                            className="mt-auto w-full border-none bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 font-bold text-white shadow-md hover:from-blue-500 hover:to-pink-500 hover:shadow-lg dark:bg-gradient-to-r dark:from-blue-700 dark:via-purple-700 dark:to-pink-700"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                router.visit(route('user.posts.show', post.id));
                                            }}
                                        >
                                            Read More
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="rounded-lg border bg-gray-50 py-12 text-center text-lg text-gray-500 dark:bg-[#23232a] dark:text-gray-300">
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
