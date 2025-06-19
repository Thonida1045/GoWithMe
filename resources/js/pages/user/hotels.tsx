import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { CalendarDays, MessageSquare, Tag } from 'lucide-react';
import { useState } from 'react';
import { Toaster } from 'sonner';

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
    image_url: string | null;
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

interface HotelsPageProps {
    posts: PaginatedData;
    provinces: Province[];
    filters?: {
        search?: string;
        sort?: string;
        province?: string;
        category?: string; // Added category to filters type
    };
}

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
    sort: '',
    province: '',
    category: 'Hotel', // Set default category to Hotel
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Hotels',
        href: route('user.hotels.index'),
    },
];

export default function HotelsPage({ posts = defaultPosts, provinces = [], filters = defaultFilters }: HotelsPageProps) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const [sortBy, setSortBy] = useState(filters?.sort ?? 'latest');
    // Remove category state, always use 'Hotel' in params

    const getRouterParams = (newPage?: number) => ({
        page: newPage || posts.current_page,
        search: search,
        sort: sortBy,
        province: filters?.province || '',
        category: 'Hotel', // Always send category as 'Hotel'
    });

    const handleSearch = (value: string) => {
        setSearch(value);
        router.get(
            route('user.hotels.index'),
            { ...getRouterParams(), search: value },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleSortChange = (value: string) => {
        setSortBy(value);
        router.get(
            route('user.hotels.index'),
            { ...getRouterParams(), sort: value },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleProvinceChange = (value: string) => {
        router.get(
            route('user.hotels.index'),
            { ...getRouterParams(), province: value },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };

    const handlePageChange = (page: number) => {
        router.get(
            route('user.hotels.index'),
            { ...getRouterParams(), page: page },
            { preserveState: true, preserveScroll: true },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Hotels" />
            <Toaster richColors closeButton position="top-right" />
            <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8">
                <div className="mb-4 flex flex-col items-start w-full overflow-hidden">
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 w-full mb-2">
                        Hotels
                    </h1>
                    <img
                        src={"/storage/board/Hotel.gif"}
                        alt="Hotel Board"
                        className="block w-full max-w-full h-[60vh] object-contain rounded shadow-lg border border-blue-200 bg-white"
                        style={{ marginTop: '0.5rem', width: '100%', maxWidth: '100%', height: '60vh' }}
                    />
                </div>
                {/* Filters Section */}
                <div className="mb-6 flex flex-wrap items-end gap-4">
                    {/* Search */}
                    <div className="max-w-md min-w-[200px] flex-1">
                        <label htmlFor="search-hotels" className="sr-only">
                            Search Hotels
                        </label>
                        <Input
                            id="search-hotels"
                            type="text"
                            placeholder="Search hotels by title or content..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full"
                        />
                    </div>
                    {/* Province filter (native select) */}
                    <div>
                        <label htmlFor="province-select" className="sr-only">
                            Filter by Province
                        </label>
                        <select
                            id="province-select"
                            value={filters?.province || ''}
                            onChange={e => handleProvinceChange(e.target.value)}
                            className="border rounded px-3 py-2 w-[180px]"
                        >
                            <option value="">All Provinces</option>
                            {provinces
                                .filter(
                                    (province) =>
                                        province &&
                                        typeof province.id === 'number' &&
                                        province.id > 0 &&
                                        typeof province.name_en === 'string' &&
                                        province.name_en.trim() !== ''
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
                            onChange={e => handleSortChange(e.target.value)}
                            className="border rounded px-3 py-2 w-[180px]"
                        >
                            <option value="latest">Latest</option>
                            <option value="most_commented">Most Commented</option>
                            <option value="oldest">Oldest</option>
                        </select>
                    </div>
                </div>
                {/* Hotels Grid Display */}
                {posts.data.length > 0 ? (
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {posts.data.map((post) => {
                            const contentWords = post.content ? post.content.split(/\s+/) : [];
                            const truncatedContent = contentWords.length > 20
                                ? contentWords.slice(0, 20).join(' ') + '...'
                                : post.content;
                            return (
                                <div
                                    key={post.id}
                                    className="flex cursor-pointer flex-col overflow-hidden rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-purple-100 shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] min-h-[420px] h-full"
                                    style={{ minHeight: 420, height: '100%' }}
                                    onClick={() => router.visit(route('user.posts.show', post.id))}
                                >
                                    <div className="relative aspect-video w-full bg-gradient-to-tr from-blue-200 via-purple-100 to-pink-100">
                                        {post.image_url ? (
                                            <img
                                                src={post.image_url}
                                                alt={post.title || 'Hotel Image'}
                                                className="h-full w-full object-cover rounded-t-xl border-b border-blue-100"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-blue-100">
                                                <span className="text-blue-400">No Image</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-grow flex-col p-6">
                                        <div className="flex items-center justify-between mb-3">
                                            <h2 className="line-clamp-2 text-xl leading-tight font-bold text-blue-900">
                                                {post.title || 'Untitled'}
                                            </h2>
                                            {post.province && (
                                                <span className="ml-2 rounded bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 px-2 py-1 text-xs font-semibold text-purple-700 border border-purple-200 shadow-sm">
                                                    {post.province.name_en}
                                                </span>
                                            )}
                                        </div>
                                        <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-blue-700">
                                            <div className="flex items-center gap-1.5">
                                                <Tag className="h-4 w-4 text-blue-500" />
                                                <span className="font-medium">{post.category?.name || 'Uncategorized'}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <MessageSquare className="h-4 w-4 text-green-500" />
                                                <span>{post.comments_count || 0} Comments</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <CalendarDays className="h-4 w-4 text-purple-500" />
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
                                        <p className="mb-4 line-clamp-3 flex-grow text-blue-900/80">
                                            {truncatedContent}
                                            {contentWords.length > 20 && (
                                                <span className="text-blue-500 font-semibold cursor-pointer ml-1" onClick={e => { e.stopPropagation(); router.visit(route('user.posts.show', post.id)); }}>
                                                    Read more
                                                </span>
                                            )}
                                        </p>
                                        <Button
                                            variant="default"
                                            className="mt-auto w-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-white font-bold shadow-md hover:from-blue-500 hover:to-pink-500 hover:shadow-lg border-none"
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
                    <div className="rounded-lg border bg-gray-50 py-12 text-center text-lg text-gray-500">
                        <p className="mb-2">😔 No hotels found matching your criteria.</p>
                        <p>Try adjusting your search or filters.</p>
                    </div>
                )}
                {/* Pagination Controls */}
                {posts.links.length > 3 && (
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
