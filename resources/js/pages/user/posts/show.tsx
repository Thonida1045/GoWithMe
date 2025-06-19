import { useState } from 'react';
import { router, Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast, Toaster } from "sonner";

interface Comment {
    id: number;
    content: string;
    user: {
        id: number;
        name: string;
    };
    created_at: string;
}

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
    image_url?: string | null;
    comments: Comment[];
    comments_count: number;
    created_at: string;
}

interface PostShowProps {
    post: Post;
}

interface PageProps {
    auth: {
        user: {
            id: number;
            name: string;
        };
    };
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Posts',
        href: '/user/posts',
    },
    {
        title: 'View Post',
        href: '#',
    },
];

export default function PostShow({ post }: PostShowProps) {
    const [comment, setComment] = useState('');
    const { auth } = usePage<PageProps>().props;
    console.log('image_url:', post.image_url);


   const handleSubmitComment = (e: React.FormEvent) => {
        e.preventDefault();
        
        router.post(route('user.posts.comments.store', post.id), {
            content: comment
        }, {
            onSuccess: () => {
                setComment('');
                toast.success('Comment added successfully');
            },
            onError: (errors) => {
                toast.error(errors.content || 'Failed to add comment');
            },
        });
    };

    const handleDeleteComment = (commentId: number) => {
        if (confirm('Are you sure you want to delete this comment?')) {
            router.delete(route('user.posts.comments.destroy', [post.id, commentId]), {
                onSuccess: () => {
                    toast.success('Comment deleted successfully');
                    router.reload({ only: ['post'] });
                },
                onError: () => {
                    toast.error('Failed to delete comment');
                },
            });
        }
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={post.title} />
            <Toaster richColors closeButton position="top-right" />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold text-blue-900 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 px-4 py-2 rounded shadow">
                        {post.title}
                    </h1>
                    <Button variant="outline" onClick={() => router.visit(route('user.posts.index'))} className="border-blue-300 text-blue-700 hover:bg-blue-50">
                        Back to Posts
                    </Button>
                </div>

                <div className="bg-gradient-to-br from-blue-50 via-white to-purple-100 rounded-lg shadow-lg p-6 border border-blue-200">
                    {post.image_url && (
                        <div className="mb-6 flex justify-center">
                            <img
                                src={post.image_url}
                                alt={post.title}
                                className="rounded-lg max-h-96 object-contain border border-blue-200 shadow"
                                style={{ maxWidth: '100%' }}
                            />
                        </div>
                    )}
                    <div className="flex items-center gap-2 mb-4 text-sm">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-medium border border-blue-200">
                            {post.category.name}
                        </span>
                        {post.province && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 text-purple-700 font-medium border border-purple-200">
                                {post.province.name_en}
                            </span>
                        )}
                        <span className="text-gray-400">•</span>
                        <span className="text-blue-700">{new Date(post.created_at).toLocaleDateString()}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-pink-600 font-semibold">{post.comments_count} comments</span>
                    </div>
                    <div className="prose max-w-none mb-8 text-blue-900/90">
                        {post.content}
                    </div>

                    {/* Comments Section */}
                    <div className="mt-8">
                        <h2 className="text-xl font-semibold mb-4 text-purple-700">Comments</h2>
                        {/* Add Comment Form */}
                        <form onSubmit={handleSubmitComment} className="mb-8">
                            <Textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Write a comment..."
                                className="mb-2 border-blue-200 focus:border-blue-400 focus:ring-blue-200/50"
                                required
                            />
                            <Button type="submit" className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-white font-bold shadow-md hover:from-blue-500 hover:to-pink-500 hover:shadow-lg border-none">
                                Post Comment
                            </Button>
                        </form>

                        {/* Comments List */}
                        <div className="space-y-4">
                            {post.comments.map((comment) => (
                                <div key={comment.id} className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-lg p-4 border border-blue-100 shadow">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <span className="font-semibold text-blue-800">{comment.user.name}</span>
                                            <span className="text-sm text-gray-500 ml-2">
                                                {new Date(comment.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        {comment.user.id === auth.user.id && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-pink-600 hover:bg-pink-100"
                                                onClick={() => handleDeleteComment(comment.id)}
                                            >
                                                Delete
                                            </Button>
                                        )}
                                    </div>
                                    <p className="text-blue-900/90">{comment.content}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}