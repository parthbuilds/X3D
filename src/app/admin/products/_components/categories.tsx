'use client';

import { useState } from 'react';
import { addProduct, updateProduct } from '@/app/admin/_actions/products'; // Adjust the path as needed
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useFormState, useFormStatus } from 'react-dom';
import { Product as PrismaProduct } from '@prisma/client';

type Product = PrismaProduct & {
    categoryId?: string;
};

type Category = {
    id: string;
    name: string;
};

export default function DeleteCategories({
    product,
    categories: initialCategories,
}: {
    product?: Product | null;
    categories: Category[];
}) {
    const [error, action]: [
        {
            categoryId?: string[];
            name?: string[];
            description?: string[];
            priceInCents?: string[];
            file?: string[];
            image?: string[];
        },
        any
    ] = useFormState(
        product == null ? addProduct : updateProduct.bind(null, product.id),
        {}
    );

    const [priceInCents, setPriceInCents] = useState<number | undefined>(
        product?.priceInCents
    );

    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');

    const handleDeleteCategory = async () => {
        if (!selectedCategoryId) return;

        try {
            const response = await fetch('/api/categories/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: selectedCategoryId }),
            });

            if (response.ok) {
                setCategories((prev) =>
                    prev.filter((category) => category.id !== selectedCategoryId)
                );
                setSelectedCategoryId('');
            } else {
                console.error('Failed to delete category');
            }
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    return (
        <form action={action} className="space-y-8">

            {/* Category Management */}
            <div className="space-y-2">
                <Label htmlFor="deleteCategory">Delete a Category</Label>
                <div className="flex gap-2 items-end">
                    <select
                        id="deleteCategory"
                        value={selectedCategoryId}
                        onChange={(e) => setSelectedCategoryId(e.target.value)}
                        className="block w-full p-2 border border-gray-300 rounded-md"
                    >
                        <option value="">Select a category to delete</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDeleteCategory}
                        disabled={!selectedCategoryId}
                    >
                        Delete
                    </Button>
                </div>
            </div>

            {/* Remaining product fields */}

            <SubmitButton />
        </form>
    );
}

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" disabled={pending}>
            {pending ? 'Saving...' : 'Save'}
        </Button>
    );
}
