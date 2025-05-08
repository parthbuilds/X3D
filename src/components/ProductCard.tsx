import { formatCurrency } from "@/lib/formatters"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

type ProductCardProps = {
  id: string
  name: string
  priceInCents: number
  description: string
  imagePath: string
}

export function ProductCard({
  id,
  name,
  priceInCents,
  description,
  imagePath,
}: ProductCardProps) {
  return (
    <Card className="rounded-xl border-1 flex flex-col">
      <CardContent className="flex flex-col space-y-4">
        <div className="relative w-full h-60 bg-gray-200 rounded-lg overflow-hidden">
          <Image src={imagePath} fill alt={name} style={{ objectFit: 'cover' }} className="rounded-lg" />
        </div>
        <h4 className="text-xl font-semibold">{name}</h4>
        <p className="text-gray-500">{formatCurrency(priceInCents / 100)}</p>
        <p className="line-clamp-2 text-gray-700">{description}</p>
        <div className="flex items-center justify-end mt-auto">
          <Button>
            <Link href={`/products/${id}/purchase`}>Purchase</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function ProductCardSkeleton() {
  return (
    <Card className="rounded-xl border-1 flex flex-col animate-pulse">
      <CardContent className="flex flex-col space-y-4">
        <div className="w-full h-60 bg-gray-300 rounded-lg" />
        <div className="w-3/4 h-6 rounded-full bg-gray-300" />
        <div className="w-1/2 h-4 rounded-full bg-gray-300" />
        <div className="w-full h-4 rounded-full bg-gray-300" />
        <div className="w-1/4 h-10 ml-auto bg-gray-300 rounded-md mt-2" />
      </CardContent>
    </Card>
  )
}
