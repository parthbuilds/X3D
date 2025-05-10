'use client'

import { useState, useEffect } from "react"
import { formatCurrency } from "@/lib/formatters"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

type ProductCardProps = {
  id: string
  name: string
  priceInCents: number
  description: string
  imagePath: string
  category?: string
}

export function ProductCard({
  id,
  name,
  priceInCents,
  description,
  imagePath,
  category = "Uncategorized",
}: ProductCardProps) {
  const [wishlist, setWishlist] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((item) => item !== productId)
        : [...prev, productId]
    )
  }

  const isWished = wishlist.includes(id)

  useEffect(() => {
    setIsLoading(true) // Start loading
    // Simulate loading for the product card
    const timeout = setTimeout(() => setIsLoading(false), 1000) // Stop loading after 1 second
    return () => clearTimeout(timeout) // Cleanup on unmount
  }, [])

  if (isLoading) {
    return <ProductCardSkeleton />
  }

  return (
    <Card className="hover:shadow-lg transition border border-gray-300 rounded-2xl overflow-hidden">
      <div className="px-4 pt-4">
        <Image
          src={imagePath}
          alt={name}
          width={500}
          height={208}
          className="w-full h-52 object-cover rounded-xl"
        />
      </div>

      <CardHeader className="pt-3 pb-1 flex flex-row justify-between items-center">
        <CardTitle className="text-base line-clamp-1">{name}</CardTitle>
        <button
          onClick={() => toggleWishlist(id)}
          className="text-red-500 transition"
          aria-label="Toggle Wishlist"
        >
          <Heart
            className="w-5 h-5"
            fill={isWished ? "red" : "none"}
            stroke="red"
          />
        </button>
      </CardHeader>

      <CardContent className="pt-0 pb-4 px-4 flex flex-col gap-1">
        <p className="text-sm text-gray-500">Category: {category}</p>
        <p className="text-lg font-bold">
          {formatCurrency(priceInCents / 100)}
        </p>
        <Button asChild className="mt-3 w-full">
          <Link href={`/products/${id}/purchase`}>View Details</Link>
        </Button>
      </CardContent>
    </Card>
  )
}

export function ProductCardSkeleton() {
  return (
    <Card className="border border-gray-300 rounded-2xl overflow-hidden animate-pulse">
      <div className="px-4 pt-4">
        <div className="w-full h-52 bg-gray-300 rounded-xl" />
      </div>

      <CardHeader className="pt-3 pb-1 flex flex-row justify-between items-center">
        <div className="w-3/5 h-4 bg-gray-300 rounded" />
        <div className="w-5 h-5 bg-gray-300 rounded-full" />
      </CardHeader>

      <CardContent className="pt-0 pb-4 px-4 flex flex-col gap-2">
        <div className="w-1/3 h-3 bg-gray-300 rounded" />
        <div className="w-1/4 h-5 bg-gray-300 rounded" />
        <div className="w-full h-10 bg-gray-300 rounded-md mt-2" />
      </CardContent>
    </Card>
  )
}
