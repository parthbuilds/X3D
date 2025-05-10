import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import db from "@/db/db";
import { cache } from "@/lib/cache";
import { Product } from "@prisma/client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Hero from "@/components/Hero/page";
import CtaBlock from "@/components/CtaBlock/page";
import Contact from "@/components/Contact/page";
import Footer from "@/components/Footer/page";

// Fetch the 6 most popular products
const getMostPopularProducts = cache(
  () =>
    db.product.findMany({
      where: { isAvailableForPurchase: true },
      orderBy: { orders: { _count: "desc" } },
      take: 6,
    }),
  ["/", "getMostPopularProducts"],
  { revalidate: 60 * 60 * 24 }
);

// Fetch top 3 categories and their 6 newest products
const getTopCategoriesWithProducts = cache(
  () =>
    db.category.findMany({
      take: 3,
      orderBy: { name: "asc" },
      include: {
        products: {
          where: { isAvailableForPurchase: true },
          take: 6,
          orderBy: { createdAt: "desc" },
        },
      },
    }),
  ["/", "getTopCategoriesWithProducts"]
);

export default async function HomePage() {
  const categories = await getTopCategoriesWithProducts();
  const mostPopularProducts = await getMostPopularProducts();

  return (
    <main>
      <div className="min-h-screen bg-white text-gray-900">
        <Hero />
        <CtaBlock />

        {/* Most Popular Products Section */}
        <div className="p-6">
          <ProductGridSection title="Most Popular" products={mostPopularProducts} />
        </div>

        {/* Top Categories Section */}
        <div className="p-6 space-y-10">
          {categories.map((category) => (
            <CategoryGrid
              key={category.id}
              title={category.name}
              products={category.products}
              categoryId={category.id}
            />
          ))}
        </div>

        <Contact />
        <Footer />
      </div>
    </main>
  );
}

// Generic product grid
type ProductGridSectionProps = {
  title: string;
  products: Product[];
};

function ProductGridSection({ title, products }: ProductGridSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <h2 className="text-3xl font-bold">{title}</h2>
        <Button variant="outline" asChild>
          <Link href="/products" className="space-x-2">
            <span>View All</span>
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.length === 0 ? (
          <>
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </>
        ) : (
          products.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              id={product.id} // Keep as string
              category="Most Popular"
            />
          ))
        )}
      </div>
    </div>
  );
}

// Category-specific product grid
type CategoryGridProps = {
  title: string;
  products: Product[];
  categoryId: string;
};

function CategoryGrid({ title, products, categoryId }: CategoryGridProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <h2 className="text-3xl font-bold">{title}</h2>
        <Button variant="outline" asChild>
          <Link href={`/products?category=${encodeURIComponent(categoryId)}`} className="space-x-2">
            <span>View All</span>
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              id={product.id} // No conversion
              category={title}
            />
          ))
        ) : (
          <p>No products available in this category.</p>
        )}
      </div>
    </div>
  );
}
