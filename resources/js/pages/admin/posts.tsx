import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Dialog } from '@headlessui/react';
import { Head, router } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { toast, Toaster } from 'sonner';

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
    published_at?: string;
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
}

interface AdminPostsPageProps {
    posts: PaginatedData;
    categories: Category[];
    provinces: Province[];
    filters?: {
        search?: string;
        category?: string;
        province?: string;
        sort?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Posts',
        href: '/admin/posts',
    },
];

export default function AdminPostsPage(props: AdminPostsPageProps) {
    const posts = props.posts;
    const categories = props.categories || [];
    const provinces = props.provinces || [];

    // Modal and form state
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [creating, setCreating] = useState(false);
    const [editingPost, setEditingPost] = useState<Post | null>(null);

    const [form, setForm] = useState({
        title: "",
        content: "",
        category_id: categories[0]?.id?.toString() || "",
        province_id: provinces[0]?.id?.toString() || "",
        image: null as File | null,
        published_at: "",
    });

    const [editForm, setEditForm] = useState({
        title: "",
        content: "",
        category_id: "",
        province_id: "",
        image: null as File | null,
        published_at: "",
    });

    // Utility to get current datetime-local string
    function getNowDatetimeLocal() {
        const now = new Date();
        now.setSeconds(0, 0);
        return now.toISOString().slice(0, 16);
    }

    // Create Post
    const handleCreatePost = (e: React.FormEvent, publishNow = false) => {
        e.preventDefault();
        setCreating(true);
        // Ensure province_id is always set to a valid value
        const provinceId = form.province_id || (provinces[0]?.id?.toString() || '');
        const formData = new FormData();
        formData.append('title', form.title);
        formData.append('content', form.content);
        formData.append('category_id', String(form.category_id));
        formData.append('province_id', provinceId);
        if (form.image) formData.append('image', form.image);
        formData.append('published_at', publishNow ? getNowDatetimeLocal() : (form.published_at || ''));

        router.post(route('admin.posts.store'), formData, {
            forceFormData: true,
            onSuccess: () => {
                toast.success('Post created successfully!');
                setShowCreateModal(false);
                setForm({
                    title: '',
                    content: '',
                    category_id: categories[0]?.id?.toString() || '',
                    province_id: provinces[0]?.id?.toString() || '',
                    image: null,
                    published_at: '',
                });
                router.reload();
            },
            onError: () => {
                toast.error('Failed to create post.');
            },
            onFinish: () => setCreating(false),
        });
    };

    // Open Edit Modal
    const openEditModal = (post: Post) => {
        setEditingPost(post);
        setEditForm({
            title: post.title,
            content: post.content,
            category_id: post.category?.id?.toString() || '',
            province_id: post.province?.id?.toString() || '',
            image: null,
            published_at: post.published_at
                ? new Date(post.published_at).toISOString().slice(0, 16)
                : '',
        });
        setShowEditModal(true);
    };

    // Edit Post
    const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>, publishNow = false) => {
        e.preventDefault();
        if (!editingPost) {
            toast.error('No post selected for editing.');
            return;
        }
        // Prevent submit if required fields are empty
        if (!editForm.title.trim() || !editForm.content.trim()) {
            toast.error('Title and content are required.');
            return;
        }
        // Debug: log the form values before submitting
        console.log('Submitting edit form:', editForm);
        // Do not force provinceId to first province, just use what is in editForm
        const formData = new FormData();
        formData.append('title', editForm.title);
        formData.append('content', editForm.content);
        formData.append('category_id', String(editForm.category_id));
        formData.append('province_id', editForm.province_id);
        if (editForm.image) formData.append('image', editForm.image);
        formData.append(
            'published_at',
            publishNow
                ? getNowDatetimeLocal()
                : (editForm.published_at ? editForm.published_at : '')
        );
        // Fix: Add _method=PUT for Laravel to recognize the request as a PUT
        formData.append('_method', 'PUT');

        router.post(route('admin.posts.update', editingPost.id), formData, {
            forceFormData: true,
            onSuccess: () => {
                toast.success('Post updated successfully!');
                setShowEditModal(false);
                setEditingPost(null);
                setEditForm({
                    title: '',
                    content: '',
                    category_id: '',
                    province_id: '',
                    image: null,
                    published_at: '',
                });
                router.reload(); // <-- Force reload to get latest data
            },
            onError: () => {
                toast.error('Failed to update post.');
            },
        });
    };

    // Delete Post
    const handleDeletePost = (postId: number) => {
        if (confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
            router.delete(route('admin.posts.destroy', postId), {
                onSuccess: () => {
                    toast.success('Post deleted successfully.');
                    router.reload();
                },
                onError: () => {
                    toast.error('Failed to delete post.');
                },
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    // Pagination handler
    const handlePageChange = (page: number) => {
        if (page < 1 || page > posts.last_page) return;
        router.get(route('admin.posts.index'), { ...props.filters, page }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // const filters = props.filters || {};

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Posts" />
            <Toaster richColors closeButton position="top-right" />
            <div className="flex flex-col gap-4 p-4 min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-yellow-50">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-pink-500 to-yellow-500 drop-shadow-lg">Manage Posts</h1>
                    <Button className="bg-gradient-to-r from-pink-500 to-yellow-400 text-white shadow-lg hover:from-pink-600 hover:to-yellow-500" onClick={() => setShowCreateModal(true)}>Add New Post</Button>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-wrap gap-4 mb-6 bg-white/80 rounded-lg p-4 shadow-md">
                    <Input
                        type="text"
                        placeholder="Search posts..."
                        value={props.filters?.search || ""}
                        onChange={e => {
                            router.get(route('admin.posts.index'), { ...props.filters, search: e.target.value }, {
                                preserveState: true,
                                preserveScroll: true,
                            });
                        }}
                        className="w-64 border-pink-300 focus:border-pink-500"
                    />
                    <select
                        value={props.filters?.category || ""}
                        onChange={e => {
                            router.get(route('admin.posts.index'), { ...props.filters, category: e.target.value }, {
                                preserveState: true,
                                preserveScroll: true,
                            });
                        }}
                        className="border rounded px-3 py-2 border-blue-200 focus:border-blue-400 bg-blue-50"
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                    <select
                        value={props.filters?.province || ""}
                        onChange={e => {
                            router.get(route('admin.posts.index'), { ...props.filters, province: e.target.value }, {
                                preserveState: true,
                                preserveScroll: true,
                            });
                        }}
                        className="border rounded px-3 py-2 border-yellow-200 focus:border-yellow-400 bg-yellow-50"
                    >
                        <option value="">All Provinces</option>
                        {provinces.map(prov => (
                            <option key={prov.id} value={prov.id}>{prov.name_en}</option>
                        ))}
                    </select>
                    <select
                        value={props.filters?.sort || "latest"}
                        onChange={e => {
                            router.get(route('admin.posts.index'), { ...props.filters, sort: e.target.value }, {
                                preserveState: true,
                                preserveScroll: true,
                            });
                        }}
                        className="border rounded px-3 py-2 border-pink-200 focus:border-pink-400 bg-pink-50"
                    >
                        <option value="latest">Latest</option>
                        <option value="oldest">Oldest</option>
                        <option value="most_commented">Most Commented</option>
                    </select>
                </div>

                {/* Posts Table */}
                {posts.data.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-200 bg-white rounded-lg shadow-lg overflow-hidden">
                            <thead className="bg-gradient-to-r from-blue-200 via-pink-200 to-yellow-200">
                                <tr>
                                    <th className="border px-4 py-2 text-left">Image</th>
                                    <th className="border px-4 py-2 text-left">Title</th>
                                    <th className="border px-4 py-2 text-left">Category</th>
                                    <th className="border px-4 py-2 text-left">Province</th>
                                    <th className="border px-4 py-2 text-center">Comments</th>
                                    <th className="border px-4 py-2 text-left">Created At</th>
                                    <th className="border px-4 py-2 text-center ">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {posts.data.map((post, idx) => (
                                    <tr key={post.id} className={idx % 2 === 0 ? "bg-blue-50 hover:bg-blue-100" : "bg-pink-50 hover:bg-pink-100"}>
                                        <td className="border px-4 py-2">
                                            {post.image_url ? (
                                                <img
                                                    src={post.image_url}
                                                    alt={post.title || 'Post Image'}
                                                    className="h-12 w-20 rounded object-cover border-2 border-yellow-300 shadow"
                                                />
                                            ) : (
                                                <span className="text-gray-400">No Image</span>
                                            )}
                                        </td>
                                        <td className="max-w-xs truncate border px-4 py-2 font-semibold  ">{post.title || 'Untitled'}</td>
                                        <td className="border px-4 py-2">
                                            <span className="inline-block px-2 py-1 rounded-full bg-yellow-200 text-yellow-800 text-xs font-bold shadow">{post.category?.name || 'Uncategorized'}</span>
                                        </td>
                                        <td className="border px-4 py-2">
                                            <span className="inline-block px-2 py-1 rounded-full bg-blue-200 text-blue-800 text-xs font-bold shadow">{post.province?.name_en || 'No Province'}</span>
                                        </td>
                                        <td className="border px-4 py-2 text-center  font-bold">{post.comments_count || 0}</td>
                                        <td className="border px-4 py-2 ">
                                            {post.created_at ? new Date(post.created_at).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="space-x-1 border px-4 py-2 text-center">
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                className="bg-gradient-to-r from-blue-100 to-pink-100 text-blue-600 border border-blue-200 hover:from-blue-200 hover:to-pink-200 shadow-none hover:shadow-md transition-all duration-200"
                                                onClick={() => openEditModal(post)}
                                                title="Edit"
                                            >
                                                <Pencil className="mr-1 h-4 w-4" />
                                                Edit
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                className="bg-gradient-to-r from-pink-100 to-yellow-100 text-pink-600 border border-pink-200 hover:from-pink-200 hover:to-yellow-200 shadow-none hover:shadow-md transition-all duration-200"
                                                onClick={() => handleDeletePost(post.id)}
                                                title="Delete"
                                            >
                                                <Trash2 className="mr-1 h-4 w-4" />
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="py-8 text-center text-gray-500">No posts found.</div>
                )}

                {/* Pagination UI */}
                <div className="flex justify-start mt-4">
                    <nav className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handlePageChange(posts.current_page - 1)} disabled={posts.current_page === 1} className="h-8 px-2 border-blue-400 text-blue-700 hover:bg-blue-100">
                            Previous
                        </Button>
                        <div className="flex items-center space-x-1">
                            {posts.links
                                .filter(link => {
                                    // Remove links with 'Previous', 'Next', '«', '»' in label
                                    const label = link.label.toLowerCase();
                                    return !label.includes('previous') && !label.includes('next') && !label.includes('«') && !label.includes('»');
                                })
                                .map((link, i) => {
                                    if (link.label === '...') {
                                        return (
                                            <span key={i} className="px-2 text-blue-700">...</span>
                                        );
                                    }
                                    if (link.url === null) {
                                        return null;
                                    }
                                    const page = parseInt(link.label);
                                    return (
                                        <Button key={i} variant={link.active ? "default" : "outline"} size="sm" onClick={() => handlePageChange(page)} className={`h-8 w-8 p-0 ${link.active ? 'bg-blue-600 text-white' : 'border-blue-400 text-blue-700 hover:bg-blue-100'}`}> 
                                            {link.label}
                                        </Button>
                                    );
                                })}
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handlePageChange(posts.current_page + 1)} disabled={posts.current_page === posts.last_page} className="h-8 px-2 border-blue-400 text-blue-700 hover:bg-blue-100">
                            Next
                        </Button>
                    </nav>
                </div>

                {/* Create Post Modal */}
                <Dialog open={showCreateModal} onClose={setShowCreateModal}>
                    <div className="fixed inset-0 z-40 bg-gradient-to-br backdrop-blur-sm" aria-hidden="true" />
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <Dialog.Panel className="w-full max-w-md rounded-2xl bg-gradient-to-br from-white via-yellow-50 to-pink-50 p-6 shadow-2xl border-2 border-pink-200">
                            <div className="max-h-[80vh] overflow-y-auto">
                                <div className="mb-4">
                                    <h2 className="text-xl font-bold">Create New Post</h2>
                                    <p className="text-sm text-gray-500">Fill in the details to create a new post.</p>
                                </div>
                                <form onSubmit={e => handleCreatePost(e, false)} className="space-y-4">
                                    <div className="space-y-2">
                                        <label htmlFor="title" className="block font-medium text-blue-700">Title</label>
                                        <Input
                                            id="title"
                                            value={form.title}
                                            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                                            required
                                            className="border-pink-300 focus:border-pink-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="content" className="block font-medium text-yellow-700">Description</label>
                                        <textarea
                                            id="content"
                                            className="w-full rounded border px-3 py-2 border-yellow-200 focus:border-yellow-400 bg-yellow-50"
                                            value={form.content}
                                            onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="category_id" className="block font-medium text-pink-700">Category</label>
                                        <select
                                            id="category_id"
                                            value={form.category_id || ""}
                                            onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}
                                            required
                                            className="w-full rounded border px-3 py-2 border-pink-200 focus:border-pink-400 bg-pink-50"
                                        >
                                            <option value="">Select a category</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="province_id" className="block font-medium text-blue-700">Province</label>
                                        <select
                                            id="province_id"
                                            name="province_id"
                                            value={form.province_id || ""}
                                            onChange={e => setForm(f => ({ ...f, province_id: e.target.value }))}
                                            required
                                            className="w-full rounded border px-3 py-2 border-blue-200 focus:border-blue-400 bg-blue-50"
                                        >
                                            <option value="">Select a province</option>
                                            {provinces.map(prov => (
                                                <option key={prov.id} value={prov.id}>{prov.name_en}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="image" className="block font-medium text-yellow-700">Image</label>
                                        <input
                                            id="image"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setForm((f) => ({ ...f, image: e.target.files?.[0] || null }))}
                                            className="w-full rounded border px-3 py-2 border-yellow-200 focus:border-yellow-400 bg-yellow-50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="published_at" className="block font-medium text-pink-700">Post Date & Time</label>
                                        <input
                                            id="published_at"
                                            type="datetime-local"
                                            className="w-full rounded border px-3 py-2 border-pink-200 focus:border-pink-400 bg-pink-50"
                                            value={form.published_at}
                                            onChange={(e) => setForm((f) => ({ ...f, published_at: e.target.value }))}
                                            required
                                        />
                                    </div>
                                    <div className="flex justify-end gap-2 pt-2">
                                        <Button type="button" variant="outline" className="hover:bg-pink-50 border border-pink-200 text-pink-600" onClick={() => setShowCreateModal(false)}>
                                            Cancel
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="default"
                                            disabled={creating}
                                            className="bg-gradient-to-r from-pink-100 to-yellow-100 text-pink-600 border border-pink-200 hover:from-pink-200 hover:to-yellow-200 shadow-none hover:shadow-md transition-all duration-200"
                                            onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleCreatePost(e as unknown as React.FormEvent, true)}
                                        >
                                            {creating ? 'Posting...' : 'Post'}
                                        </Button>
                                        <Button type="submit" disabled={creating} className="bg-gradient-to-r from-blue-100 to-pink-100 text-blue-600 border border-blue-200 hover:from-blue-200 hover:to-pink-200 shadow-none hover:shadow-md transition-all duration-200">
                                            {creating ? 'Creating...' : 'Create (Draft)'}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </Dialog.Panel>
                    </div>
                </Dialog>

                {/* Edit Post Modal */}
                <Dialog open={showEditModal} onClose={() => setShowEditModal(false)}>
                    <div className="fixed inset-0 z-40 bg-gradient-to-br from-blue-200/60 via-pink-100/60 to-yellow-200/60 backdrop-blur-sm" aria-hidden="true" />
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <Dialog.Panel className="w-full max-w-md rounded-2xl bg-gradient-to-br from-white via-blue-50 to-pink-50 p-6 shadow-2xl border-2 border-blue-200">
                            <div className="max-h-[80vh] overflow-y-auto">
                                <div className="mb-4">
                                    <h2 className="text-xl font-bold text-blue-600">Edit Post</h2>
                                    <p className="text-sm text-gray-500">Update the details of the post.</p>
                                </div>
                                {editingPost && (
                                    <form onSubmit={e => handleEditSubmit(e, false)} className="space-y-4">
                                        <div className="space-y-2">
                                            <label htmlFor="title" className="block font-medium text-blue-700">Title</label>
                                            <Input
                                                id="title"
                                                name="title"
                                                value={editForm.title}
                                                onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                                                required
                                                className="border-pink-300 focus:border-pink-500"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="content" className="block font-medium text-yellow-700">Description</label>
                                            <textarea
                                                id="content"
                                                name="content"
                                                className="w-full rounded border px-3 py-2 border-yellow-200 focus:border-yellow-400 bg-yellow-50"
                                                value={editForm.content}
                                                onChange={(e) => setEditForm((f) => ({ ...f, content: e.target.value }))}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="category_id" className="block font-medium text-pink-700">Category</label>
                                            <select
                                                id="category_id"
                                                name="category_id"
                                                className="w-full rounded border px-3 py-2 border-pink-200 focus:border-pink-400 bg-pink-50"
                                                value={typeof editForm.category_id === 'string' || typeof editForm.category_id === 'number' ? String(editForm.category_id) : ''}
                                                onChange={e => setEditForm((f) => ({ ...f, category_id: e.target.value }))}
                                                required
                                            >
                                                <option value="">Select a category</option>
                                                {categories && categories.map(cat => (
                                                    <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="province_id" className="block font-medium text-blue-700">Province</label>
                                            <select
                                                id="province_id"
                                                name="province_id"
                                                className="w-full rounded border px-3 py-2 border-blue-200 focus:border-blue-400 bg-blue-50"
                                                value={typeof editForm.province_id === 'string' || typeof editForm.province_id === 'number' ? String(editForm.province_id) : ''}
                                                onChange={e => setEditForm((f) => ({ ...f, province_id: e.target.value }))}
                                                required
                                            >
                                                <option value="">Select a province</option>
                                                {provinces.map(province => (
                                                    <option key={province.id} value={String(province.id)}>{province.name_en}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="image" className="block font-medium text-yellow-700">Image</label>
                                            {editingPost?.image_url && (
                                                <img src={editingPost.image_url} alt="Current" className="mb-2 h-32 rounded object-cover border-2 border-yellow-300 shadow" />
                                            )}
                                            <input
                                                id="image"
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setEditForm((f) => ({ ...f, image: e.target.files?.[0] || null }))}
                                                className="w-full rounded border px-3 py-2 border-yellow-200 focus:border-yellow-400 bg-yellow-50"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="published_at" className="block font-medium text-pink-700">Post Date & Time</label>
                                            <input
                                                id="published_at"
                                                type="datetime-local"
                                                className="w-full rounded border px-3 py-2 border-pink-200 focus:border-pink-400 bg-pink-50"
                                                value={editForm.published_at}
                                                onChange={(e) => setEditForm((f) => ({ ...f, published_at: e.target.value }))}
                                                required
                                            />
                                        </div>
                                        <div className="flex justify-end gap-2 pt-2">
                                            <Button type="button" variant="outline" className="hover:bg-blue-100" onClick={() => setShowEditModal(false)}>
                                                Cancel
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="default"
                                                className="bg-gradient-to-r from-blue-400 to-pink-400 text-white hover:from-blue-500 hover:to-pink-500 shadow"
                                                onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleEditSubmit(e as unknown as React.FormEvent<HTMLFormElement>, true)}
                                            >
                                                Save
                                            </Button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </Dialog.Panel>
                    </div>
                </Dialog>
            </div>
        </AppLayout>
    );
}
