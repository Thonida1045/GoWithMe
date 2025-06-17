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

    const [form, setForm] = useState<{
        title: string;
        content: string;
        category_id: string;
        province_id: string;
        image: File | null;
        published_at: string;
    }>({
        title: "",
        content: "",
        category_id: categories[0]?.id?.toString() || "",
        province_id: provinces[0]?.id?.toString() || "",
        image: null,
        published_at: "",
    });

    const [editForm, setEditForm] = useState({
        title: '',
        content: '',
        category_id: '',
        province_id: '', // Do not default to first province
        image: null as File | null,
        published_at: '',
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
            province_id: post.province?.id?.toString() || '', // Only set if post has province
            image: null,
            published_at: post.published_at || '',
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
                ? new Date().toISOString().slice(0, 19).replace('T', ' ')
                : (editForm.published_at
                    ? new Date(editForm.published_at).toISOString().slice(0, 19).replace('T', ' ')
                    : '')
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
            },
            onError: (errors) => {
                console.log(errors);
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
                },
                onError: (errors) => {
                    toast.error('Failed to delete post.');
                    console.error('Delete error:', errors);
                },
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    // const filters = props.filters || {};

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Posts" />
            <Toaster richColors closeButton position="top-right" />
            <div className="flex flex-col gap-4 p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Manage Posts</h1>
                    <Button onClick={() => setShowCreateModal(true)}>Add New Post</Button>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-wrap gap-4 mb-6">
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
                        className="w-64"
                    />
                    <select
                        value={props.filters?.category || ""}
                        onChange={e => {
                            router.get(route('admin.posts.index'), { ...props.filters, category: e.target.value }, {
                                preserveState: true,
                                preserveScroll: true,
                            });
                        }}
                        className="border rounded px-3 py-2"
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
                        className="border rounded px-3 py-2"
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
                        className="border rounded px-3 py-2"
                    >
                        <option value="latest">Latest</option>
                        <option value="oldest">Oldest</option>
                        <option value="most_commented">Most Commented</option>
                    </select>
                </div>

                {/* Posts Table */}
                {posts.data.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-200 bg-white">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border px-4 py-2 text-left">Image</th>
                                    <th className="border px-4 py-2 text-left">Title</th>
                                    <th className="border px-4 py-2 text-left">Category</th>
                                    <th className="border px-4 py-2 text-left">Province</th>
                                    <th className="border px-4 py-2 text-center">Comments</th>
                                    <th className="border px-4 py-2 text-left">Created At</th>
                                    <th className="border px-4 py-2 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {posts.data.map((post) => (
                                    <tr key={post.id} className="hover:bg-gray-50">
                                        <td className="border px-4 py-2">
                                            {post.image_url ? (
                                                <img
                                                    src={post.image_url}
                                                    alt={post.title || 'Post Image'}
                                                    className="h-12 w-20 rounded object-cover"
                                                />
                                            ) : (
                                                <span className="text-gray-400">No Image</span>
                                            )}
                                        </td>
                                        <td className="max-w-xs truncate border px-4 py-2">{post.title || 'Untitled'}</td>
                                        <td className="border px-4 py-2">{post.category?.name || 'Uncategorized'}</td>
                                        <td className="border px-4 py-2">{post.province?.name_en || 'No Province'}</td>
                                        <td className="border px-4 py-2 text-center">{post.comments_count || 0}</td>
                                        <td className="border px-4 py-2">
                                            {post.created_at ? new Date(post.created_at).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="space-x-1 border px-4 py-2 text-center">
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => openEditModal(post)}
                                                title="Edit"
                                                className="inline-flex items-center"
                                            >
                                                <Pencil className="mr-1 h-4 w-4" />
                                                Edit
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDeletePost(post.id)}
                                                title="Delete"
                                                className="inline-flex items-center"
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

                {/* Create Post Modal */}
                <Dialog open={showCreateModal} onClose={setShowCreateModal}>
                    <div className="fixed inset-0 z-40 bg-white/30 backdrop-blur-sm" aria-hidden="true" />
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <Dialog.Panel className="w-full max-w-md rounded-lg bg-white/90 p-6 shadow-xl">
                            <div className="max-h-[80vh] overflow-y-auto">
                                <div className="mb-4">
                                    <h2 className="text-lg font-semibold">Create New Post</h2>
                                    <p className="text-sm text-gray-500">Fill in the details to create a new post.</p>
                                </div>
                                <form onSubmit={e => handleCreatePost(e, false)} className="space-y-4">
                                    <div className="space-y-2">
                                        <label htmlFor="title" className="block font-medium">
                                            Title
                                        </label>
                                        <Input
                                            id="title"
                                            value={form.title}
                                            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="content" className="block font-medium">
                                            Description
                                        </label>
                                        <textarea
                                            id="content"
                                            className="w-full rounded border px-3 py-2"
                                            value={form.content}
                                            onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="category_id" className="block font-medium">
                                            Category
                                        </label>
                                        <select
                                            id="category_id"
                                            value={form.category_id || ""}
                                            onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}
                                            required
                                        >
                                            <option value="">Select a category</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="province_id" className="block font-medium">
                                            Province
                                        </label>
                                        <select
                                            id="province_id"
                                            name="province_id"
                                            value={form.province_id || ""}
                                            onChange={e => setForm(f => ({ ...f, province_id: e.target.value }))}
                                            required
                                        >
                                            <option value="">Select a province</option>
                                            {provinces.map(prov => (
                                                <option key={prov.id} value={prov.id}>{prov.name_en}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="image" className="block font-medium">
                                            Image
                                        </label>
                                        <input
                                            id="image"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setForm((f) => ({ ...f, image: e.target.files?.[0] || null }))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="published_at" className="block font-medium">
                                            Post Date & Time
                                        </label>
                                        <input
                                            id="published_at"
                                            type="datetime-local"
                                            className="w-full rounded border px-3 py-2"
                                            value={form.published_at}
                                            onChange={(e) => setForm((f) => ({ ...f, published_at: e.target.value }))}
                                            required
                                        />
                                    </div>
                                    <div className="flex justify-end gap-2 pt-2">
                                        <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>
                                            Cancel
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="default"
                                            disabled={creating}
                                            onClick={e => handleCreatePost(e as any, true)}
                                        >
                                            {creating ? 'Posting...' : 'Post'}
                                        </Button>
                                        <Button type="submit" disabled={creating}>
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
                    <div className="fixed inset-0 z-40 bg-white/30 backdrop-blur-sm" aria-hidden="true" />
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <Dialog.Panel className="w-full max-w-md rounded-lg bg-white/90 p-6 shadow-xl">
                            <div className="max-h-[80vh] overflow-y-auto">
                                <div className="mb-4">
                                    <h2 className="text-lg font-semibold">Edit Post</h2>
                                    <p className="text-sm text-gray-500">Update the details of the post.</p>
                                </div>
                                {editingPost && (
                                    <form onSubmit={e => handleEditSubmit(e, false)} className="space-y-4">
                                        <div className="space-y-2">
                                            <label htmlFor="title" className="block font-medium">
                                                Title
                                            </label>
                                            <Input
                                                id="title"
                                                name="title"
                                                value={editForm.title}
                                                onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="content" className="block font-medium">
                                                Description
                                            </label>
                                            <textarea
                                                id="content"
                                                name="content"
                                                className="w-full rounded border px-3 py-2"
                                                value={editForm.content}
                                                onChange={(e) => setEditForm((f) => ({ ...f, content: e.target.value }))}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="category_id" className="block font-medium">
                                                Category
                                            </label>
                                            <select
                                                id="category_id"
                                                name="category_id"
                                                className="w-full rounded border px-3 py-2"
                                                value={editForm.category_id || ""}
                                                onChange={(e) => setEditForm((f) => ({ ...f, category_id: e.target.value }))}
                                                required
                                            >
                                                <option value="">Select a category</option>
                                                {categories && categories.map(cat => (
                                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="province_id" className="block font-medium">
                                                Province
                                            </label>
                                            <select
                                                id="province_id"
                                                name="province_id"
                                                className="w-full rounded border px-3 py-2"
                                                value={editForm.province_id || ""}
                                                onChange={(e) => setEditForm((f) => ({ ...f, province_id: e.target.value }))}
                                                required
                                            >
                                                <option value="">Select a province</option>
                                                {provinces.map(province => (
                                                    <option key={province.id} value={province.id}>{province.name_en}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="image" className="block font-medium">
                                                Image
                                            </label>
                                            {editingPost?.image_url && (
                                                <img src={editingPost.image_url} alt="Current" className="mb-2 h-32 rounded object-cover" />
                                            )}
                                            <input
                                                id="image"
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setEditForm((f) => ({ ...f, image: e.target.files?.[0] || null }))}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="published_at" className="block font-medium">
                                                Post Date & Time
                                            </label>
                                            <input
                                                id="published_at"
                                                type="datetime-local"
                                                className="w-full rounded border px-3 py-2"
                                                value={editForm.published_at}
                                                onChange={(e) => setEditForm((f) => ({ ...f, published_at: e.target.value }))}
                                                required
                                            />
                                        </div>
                                        <div className="flex justify-end gap-2 pt-2">
                                            <Button type="button" variant="outline" onClick={() => setShowEditModal(false)}>
                                                Cancel
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="default"
                                                onClick={e => handleEditSubmit(e as any, true)}
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
