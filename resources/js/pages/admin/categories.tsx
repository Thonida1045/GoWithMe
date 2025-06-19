import { useState } from 'react';
import { router, Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast, Toaster } from "sonner";

interface Category {
    id: number;
    name: string;
    posts_count: number;
}

interface PaginatedData {
    data: Category[];
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

interface CategoriesPageProps {
    categories: PaginatedData;
}

const breadcrumbs: BreadcrumbItem[] = [

    {
        title: 'Categories',
        href: '/admin/categories',
    },
];

export default function CategoriesPage({ categories }: CategoriesPageProps) {
    const [showModal, setShowModal] = useState(false);
    const [editCategory, setEditCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({
        name: '',
    });

    const handleAdd = () => {
        setEditCategory(null);
        setFormData({ name: '' });
        setShowModal(true);
    };

    const handleEdit = (category: Category) => {
        setEditCategory(category);
        setFormData({ name: category.name });
        setShowModal(true);
    };



    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this category?')) {
            router.delete(`/admin/categories/${id}`, {
                onSuccess: () => {
                    toast.success('Category deleted successfully');
                },
                onError: (errors) => {
                    toast.error(errors.error || 'Failed to delete category');
                },
            });
        }
    };



    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editCategory) {
            router.put(`/admin/categories/${editCategory.id}`, formData, {
                onSuccess: () => {
                    setShowModal(false);
                    toast.success('Category updated successfully');
                },
                onError: (errors) => {
                    toast.error(errors.name || 'Failed to update category');
                },
            });
        } else {
            router.post('/admin/categories', formData, {
                onSuccess: () => {
                    setShowModal(false);
                    toast.success('Category created successfully');
                },
                onError: (errors) => {
                    toast.error(errors.name || 'Failed to create category');
                },
            });
        }
    };




    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePageChange = (page: number) => {
        router.get(route('admin.categories.index'), { page }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categories" />
            <Toaster richColors closeButton position="top-right" />
            <div className="flex flex-col gap-4 p-4 min-h-screen bg-blue-50">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold text-blue-700">Categories</h1>
                    <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={handleAdd}>
                        Add Category
                    </Button>
                </div>
                <div className="rounded border bg-white">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-blue-100">
                                <TableHead className="text-blue-700">Name</TableHead>
                                <TableHead className="text-blue-700">Posts Count</TableHead>
                                <TableHead className="text-blue-700">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.data.map((category, idx) => (
                                <TableRow key={category.id} className={idx % 2 === 0 ? "bg-white" : "bg-blue-50"}>
                                    <TableCell className="text-blue-900">{category.name}</TableCell>
                                    <TableCell className="text-blue-900">{category.posts_count}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" className="border-blue-400 text-blue-700 hover:bg-blue-100" onClick={() => handleEdit(category)}>
                                                Edit
                                            </Button>
                                            <Button variant="destructive" size="sm" className="bg-red-500 text-white hover:bg-red-600 border-none" onClick={() => handleDelete(category.id)}>
                                                Delete
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                {/* Pagination */}
                <div className="flex justify-start mt-4">
                    <nav className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handlePageChange(categories.current_page - 1)} disabled={categories.current_page === 1} className="h-8 px-2 border-blue-400 text-blue-700 hover:bg-blue-100">
                            Previous
                        </Button>
                        <div className="flex items-center space-x-1">
                            {categories.links.map((link, i) => {
                                if (link.label === '...') {
                                    return (
                                        <span key={i} className="px-2 text-blue-700">...</span>
                                    );
                                }
                                // Hide "Previous" and "Next" labels from Laravel pagination
                                if (link.label === '&laquo; Previous' || link.label === 'Next &raquo;' || link.url === null) {
                                    return null;
                                }
                                const page = parseInt(link.label);
                                if (isNaN(page)) {
                                    return null;
                                }
                                return (
                                    <Button key={i} variant={link.active ? "default" : "outline"} size="sm" onClick={() => handlePageChange(page)} className={`h-8 w-8 p-0 ${link.active ? 'bg-blue-600 text-white' : 'border-blue-400 text-blue-700 hover:bg-blue-100'}`}> 
                                        {link.label}
                                    </Button>
                                );
                            })}
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handlePageChange(categories.current_page + 1)} disabled={categories.current_page === categories.last_page} className="h-8 px-2 border-blue-400 text-blue-700 hover:bg-blue-100">
                            Next
                        </Button>
                    </nav>
                </div>
                {/* Add/Edit Category Modal */}
                <Dialog open={showModal} onOpenChange={setShowModal}>
                    <DialogContent className="sm:max-w-[425px] bg-white border border-blue-200 rounded shadow">
                        <DialogHeader>
                            <DialogTitle className="text-blue-700">{editCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
                            <DialogDescription className="text-blue-500">
                                {editCategory ? 'Make changes to your category here.' : 'Create a new category here.'}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-blue-700">Name</Label>
                                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required className="border-blue-300 focus:border-blue-500" />
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" className="hover:bg-blue-100 text-blue-700 border-blue-400" onClick={() => setShowModal(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
                                    {editCategory ? 'Update' : 'Create'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
