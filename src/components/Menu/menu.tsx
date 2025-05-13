"use client"

import * as React from "react"
import Link from "next/link"
import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

interface Category {
  id: string
  name: string
  description: string
}

export function Menu() {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories") // Adjust API path as necessary
        const data = await res.json()
        setCategories(data)
      } catch (err) {
        console.error("Failed to fetch categories", err)
      }
    }

    fetchCategories()
  }, [])

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {/* Getting Started (Updated for 3D Assets) */}
        <NavigationMenuItem>
          <NavigationMenuTrigger>Explore</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 p-4 sm:w-full md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/products"
                  >
                    <div className="mb-2 mt-4 text-lg font-medium">Discover 3D Assets</div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      High-quality 3D models and assets for games, AR/VR, animation, and more.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <ListItem href="/products" title="All Assets">
                Browse our complete collection of optimized and ready-to-use 3D models.
              </ListItem>
              <ListItem href="/products?category=Featured" title="Featured Models">
                Handpicked assets that are trending and professionally crafted.
              </ListItem>
              <ListItem href="/contact" title="Need a Custom Asset?">
                Get in touch with our team to commission or request custom 3D content.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Dynamic Categories */}
        <NavigationMenuItem>
          <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 sm:w-full md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {categories.map((category) => (
                <ListItem
                  key={category.id}
                  title={category.name}
                  href={`/products?category=${encodeURIComponent(category.name)}`}
                >
                  {category.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Static Links */}
        <NavigationMenuItem>
          <Link href="/orders" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              My Orders
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/contact" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Contact Us
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

interface ListItemProps extends React.ComponentPropsWithoutRef<"a"> {
  title: string
  children: React.ReactNode
}

const ListItem = React.forwardRef<HTMLAnchorElement, ListItemProps>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <Link
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            href={props.href as string}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </Link>
        </NavigationMenuLink>
      </li>
    )
  }
)

ListItem.displayName = "ListItem"
