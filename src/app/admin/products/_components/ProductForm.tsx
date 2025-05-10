"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/formatters";
import { useEffect, useState } from "react";
import { addProduct, updateProduct } from "../../_actions/products";
import { useFormState, useFormStatus } from "react-dom";
import { Product as PrismaProduct } from "@prisma/client";
import Image from "next/image";

type Product = PrismaProduct & {
  categoryId?: string;
};

type Category = {
  id: string;
  name: string;
  description: string;
};

export function ProductForm({
  product,
  categories: initialCategories,
}: {
  product?: Product | null;
  categories?: Category[];
}) {
  const [categories, setCategories] = useState<Category[]>(initialCategories ?? []);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    product?.categoryId || ""
  );
  const [error, action] = useFormState(
    product == null ? addProduct : updateProduct.bind(null, product.id),
    {}
  );
  const [priceInCents, setPriceInCents] = useState<number | undefined>(
    product?.priceInCents
  );

  // Fetch categories again from server after add/delete
  const fetchCategories = async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data || []);
  };

  const handleAddCategory = async () => {
    if (newCategoryName.trim() === "") {
      alert("Please enter a valid category name.");
      return;
    }

    if (newCategoryDescription.trim() === "") {
      alert("Please enter a category description.");
      return;
    }

    const response = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newCategoryName,
        description: newCategoryDescription,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Category added successfully!");
      setNewCategoryName("");
      setNewCategoryDescription("");
      fetchCategories();
    } else {
      alert(data.error || "An error occurred while adding the category.");
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategoryId) {
      alert("No category selected to delete.");
      return;
    }

    const response = await fetch(`/api/categories/${selectedCategoryId}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (response.ok) {
      alert("Category deleted successfully!");
      setSelectedCategoryId(null);
      fetchCategories();
    } else {
      alert(data.error || "An error occurred while deleting the category.");
    }
  };

  return (
    <form action={action} className="space-y-8">
      {/* Product Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          type="text"
          id="name"
          name="name"
          required
          defaultValue={product?.name || ""}
        />
        {error.name && <div className="text-destructive">{error.name}</div>}
      </div>

      {/* Product Price */}
      <div className="space-y-2">
        <Label htmlFor="priceInCents">Price In Cents</Label>
        <Input
          type="number"
          id="priceInCents"
          name="priceInCents"
          required
          value={priceInCents}
          onChange={(e) => setPriceInCents(Number(e.target.value) || undefined)}
        />
        <div className="text-muted-foreground">
          {formatCurrency((priceInCents || 0) / 100)}
        </div>
        {error.priceInCents && (
          <div className="text-destructive">{error.priceInCents}</div>
        )}
      </div>

      {/* Category Dropdown */}
      <div className="space-y-2">
        <Label htmlFor="categoryId">Category</Label>
        <select
          id="categoryId"
          name="categoryId"
          defaultValue={product?.categoryId || ""}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
          className="block w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">Select a category</option>
          {categories.length > 0 ? (
            categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name} - {category.description}
              </option>
            ))
          ) : (
            <option value="" disabled>
              No categories available
            </option>
          )}
        </select>
        {error.categoryId && (
          <div className="text-destructive">{error.categoryId}</div>
        )}
      </div>

      {/* Product Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          required
          defaultValue={product?.description}
        />
        {error.description && (
          <div className="text-destructive">{error.description}</div>
        )}
      </div>

      {/* Product File */}
      <div className="space-y-2">
        <Label htmlFor="file">File</Label>
        <Input type="file" id="file" name="file" required={product == null} />
        {product && <div className="text-muted-foreground">{product.filePath}</div>}
        {error.file && <div className="text-destructive">{error.file}</div>}
      </div>

      {/* Product Image */}
      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        <Input type="file" id="image" name="image" required={product == null} />
        {product && (
          <Image
            src={product.imagePath}
            height={400}
            width={400}
            alt="Product Image"
          />
        )}
        {error.image && <div className="text-destructive">{error.image}</div>}
      </div>

      <SubmitButton />

      {/* Add New Category and Delete Category Section */}
      <div className="mt-10 space-y-4 border-t pt-4">
        <h3 className="text-lg font-semibold">Manage Categories</h3>

        {/* Add New Category */}
        <div className="space-y-2">
          <Label htmlFor="newCategoryName">Add New Category</Label>
          <Input
            type="text"
            id="newCategoryName"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Enter new category name"
          />
          <Label htmlFor="newCategoryDescription">Category Description</Label>
          <Textarea
            id="newCategoryDescription"
            value={newCategoryDescription}
            onChange={(e) => setNewCategoryDescription(e.target.value)}
            placeholder="Enter category description"
            className="border-black ring-offset-background ring-input p-2"
          />
          <Button
            type="button"
            onClick={handleAddCategory}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Add Category
          </Button>
        </div>

        {/* Delete Category */}
        <div className="space-y-2">
          <Label htmlFor="deleteCategory">Delete Category</Label>
          <select
            id="deleteCategory"
            className="block w-full p-2 border border-gray-300 rounded-md"
            value={selectedCategoryId || ""}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
          >
            <option value="">Select a category to delete</option>
            {categories.length > 0 ? (
              categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))
            ) : (
              <option value="" disabled>
                No categories available
              </option>
            )}
          </select>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDeleteCategory}
            disabled={!selectedCategoryId}
          >
            Delete Selected Category
          </Button>
        </div>
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save"}
    </Button>
  );
}