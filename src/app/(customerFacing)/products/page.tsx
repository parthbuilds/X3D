'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ProductCard } from '@/components/ProductCard'; // Update the path to the correct location

type Category = {
  id: string;
  name: string;
  description: string;
};

type Product = {
  id: string;
  name: string;
  priceInCents: number;
  filePath: string;
  imagePath: string;
  description: string;
  isAvailableForPurchase: boolean;
  createdAt: string;
  updatedAt: string;
  categoryId: string;
  category: {
    id: string;
    name: string;
    description: string;
  };
};

function ProductsClientPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');

  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        if (!res.ok) throw new Error('Failed to fetch categories');
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategoryId(categoryParam);
    } else {
      setSelectedCategoryId('all');
    }
  }, [categoryParam]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    if (categoryId === 'all') {
      router.push('/products');
    } else {
      router.push(`/products?category=${encodeURIComponent(categoryId)}`);
    }
  };

  const filteredProducts =
    selectedCategoryId === 'all'
      ? products
      : products.filter((product) => product.categoryId === selectedCategoryId);

  const handleViewDetails = (productId: string, categoryId: string): void => {
    router.push(`/products/${categoryId}/${productId}`);
  };

  return (
    <section
      style={{
        backgroundColor: '#e5e5f7',
        opacity: '1',
        backgroundImage: 'radial-gradient(#444cf7 0.5px, #e5e5f7 0.5px)',
        backgroundSize: '20px 20px',
      }}
    >
      <div className="container mx-auto py-10">
        {/* Category Filter Dropdown */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">3D Assets</h1>
          <Select onValueChange={handleCategoryChange} value={selectedCategoryId}>
            <SelectTrigger className="w-[200px] bg-white text-gray-800 border border-gray-300 rounded-lg shadow-sm">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                priceInCents={product.priceInCents}
                description={product.description}
                imagePath={product.imagePath || '/placeholder.jpg'}
                category={product.category.name}
              />
            ))}
          </div>
        ) : (
          <div className="text-center mt-10 text-gray-600">
            No products found for this category.
          </div>
        )}
      </div>
    </section>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading products...</div>}>
      <ProductsClientPage />
    </Suspense>
  );
}
