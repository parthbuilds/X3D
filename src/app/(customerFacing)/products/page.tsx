'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Img from 'next/image';

type Category = {
  id: string;
  name: string;
  description: string;
};

type Product = {
  id: string;
  name: string;
  priceInCents: number;
  imagePath: string;
  categoryId: string;
  category: {
    id: string;
    name: string;
  };
};

export default function ProductsPage() {
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

        {/* Category Cards */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Browse by Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Card
                key={category.id}
                className="cursor-pointer hover:shadow-lg transition border border-gray-300 rounded-2xl"
                onClick={() => handleCategoryChange(category.id)}
              >
                <CardHeader>
                  <CardTitle>{category.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{category.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="hover:shadow-lg transition border border-gray-300 rounded-2xl"
            >
              <Img
                src={product.imagePath || '/placeholder.jpg'}
                alt={product.name}
                className="w-full h-48 object-cover rounded-t-2xl"
                width={400}
                height={300}
              />
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Category: {product.category.name}</p>
                <p className="text-lg font-bold">
                  ₹{(product.priceInCents / 100).toFixed(2)}
                </p>
                <Button
                  className="mt-4 w-full"
                  onClick={() => handleViewDetails(product.id, product.categoryId)}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
