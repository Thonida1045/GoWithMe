import React, { useState } from 'react';
import { router, Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast, Toaster } from "sonner";
import { Eye, Trash2, Pencil } from 'lucide-react';
import { Dialog } from "@headlessui/react"; // or use your own modal component
import { DialogContent } from '@radix-ui/react-dialog';
import { DialogHeader, DialogDescription, DialogFooter } from '@/components/ui/dialog';

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
  image_url: string | null;
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

interface AdminPostsPageProps {
  posts: PaginatedData;
  categories: Category[];
  filters?: {
    search?: string;
    category?: string;
    sort?: string;
  };
}

const defaultPosts: PaginatedData = {
  data: [],
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0,
  links: [{ url: null, label: '1', active: true }]
};


const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Posts',
    href: route('admin.posts.index'),
  },
];

export default function AdminPostsPage(props: AdminPostsPageProps) {
const posts = props.posts ?? defaultPosts;
const categories = props.categories ?? [];
const filters = props.filters ?? { search: '', category: 'all', sort: 'latest' };


  const [search, setSearch] = useState(filters.search ?? '');
  const [selectedCategory, setSelectedCategory] = useState(filters.category ?? 'all');
  const [sortBy, setSortBy] = useState(filters.sort ?? 'latest');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [form, setForm] = useState({
    title: "",
    content: "",
    category_id: categories[0]?.id || "",
    image: null as File | null,
    published_at: "",
  });
  const [creating, setCreating] = useState(false);

  const getRouterParams = (newPage?: number) => ({
    page: newPage || posts.current_page,
    search: search,
    category: selectedCategory === 'all' ? '' : selectedCategory,
    sort: sortBy,
  });

  const handleSearch = (value: string) => {
    setSearch(value);
    router.get(
      route('admin.posts.index'),
      { ...getRouterParams(), search: value },
      { preserveState: true, preserveScroll: true }
    );
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    router.get(
      route('admin.posts.index'),
      { ...getRouterParams(), category: value === 'all' ? '' : value },
      { preserveState: true, preserveScroll: true, replace: true }
    );
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    router.get(
      route('admin.posts.index'),
      { ...getRouterParams(), sort: value },
      { preserveState: true, preserveScroll: true }
    );
  };

  const handlePageChange = (page: number) => {
    router.get(
      route('admin.posts.index'),
      { ...getRouterParams(), page: page },
      { preserveState: true, preserveScroll: true }
    );
  };

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

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("content", form.content);
    formData.append("category_id", String(form.category_id));
    if (form.image) formData.append("image", form.image);
    formData.append("published_at", form.published_at);

    router.post(route("admin.posts.store"), formData, {
      forceFormData: true,
      onSuccess: () => {
        toast.success("Post created successfully!");
        setShowCreateModal(false);
        setForm({
          title: "",
          content: "",
          category_id: categories[0]?.id || "",
          image: null,
          published_at: "",
        });
      },
      onError: () => {
        toast.error("Failed to create post.");
      },
      onFinish: () => setCreating(false),
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Admin Posts" />
      <Toaster richColors closeButton position="top-right" />
      <div className="flex flex-col gap-4 p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Manage Posts</h1>
          <Button onClick={() => setShowCreateModal(true)}>
            Add New Post
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px] max-w-md">
            <Input
              type="text"
              placeholder="Search posts..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select category" />
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
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="most_commented">Most Commented</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Posts Table */}
        {posts.data.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2 text-left">Image</th>
                  <th className="border px-4 py-2 text-left">Title</th>
                  <th className="border px-4 py-2 text-left">Category</th>
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
                          className="w-20 h-12 object-cover rounded"
                        />
                      ) : (
                        <span className="text-gray-400">No Image</span>
                      )}
                    </td>
                    <td className="border px-4 py-2 max-w-xs truncate">{post.title || 'Untitled'}</td>
                    <td className="border px-4 py-2">{post.category?.name || 'Uncategorized'}</td>
                    <td className="border px-4 py-2 text-center">{post.comments_count || 0}</td>
                    <td className="border px-4 py-2">
                      {post.created_at ? new Date(post.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="border px-4 py-2 text-center space-x-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.visit(route('user.posts.show', post.id))}
                        title="View"
                        className="inline-flex items-center"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => router.visit(route('admin.posts.edit', post.id))}
                        title="Edit"
                        className="inline-flex items-center"
                      >
                        <Pencil className="w-4 h-4 mr-1" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeletePost(post.id)}
                        title="Delete"
                        className="inline-flex items-center"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">No posts found.</div>
        )}

        {/* Pagination */}
        {posts.links.length > 1 && (
          <div className="flex justify-center mt-8">
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
                {posts.links.map((link, i) => {
                  if (!link || link.label === '&laquo; Previous' || link.label === 'Next &raquo;') {
                    return null;
                  }

                  if (link.label === '...') {
                    return (
                      <span key={i} className="px-2 select-none">
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

      {/* Create Post Modal */}
      <Dialog open={showCreateModal} onClose={setShowCreateModal} className="relative z-50">
        {/* Blurred overlay */}
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded-lg bg-white/90 shadow-xl p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Create New Post</h2>
              <p className="text-gray-500 text-sm">Fill in the details to create a new post.</p>
            </div>
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="title" className="block font-medium">Title</label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="content" className="block font-medium">Description</label>
                <textarea
                  id="content"
                  className="w-full border rounded px-3 py-2"
                  value={form.content}
                  onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="category_id" className="block font-medium">Category</label>
                <select
                  id="category_id"
                  className="w-full border rounded px-3 py-2"
                  value={form.category_id}
                  onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}
                  required
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="image" className="block font-medium">Image</label>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={e => setForm(f => ({ ...f, image: e.target.files?.[0] || null }))}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="published_at" className="block font-medium">Post Date & Time</label>
                <input
                  id="published_at"
                  type="datetime-local"
                  className="w-full border rounded px-3 py-2"
                  value={form.published_at}
                  onChange={e => setForm(f => ({ ...f, published_at: e.target.value }))}
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={creating}>
                  {creating ? "Creating..." : "Create"}
                </Button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </AppLayout>
  );
}
