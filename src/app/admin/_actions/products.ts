"use server"

import db from "@/db/db"
import { z } from "zod"
import fs from "fs/promises"
import { notFound, redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

// Validation schemas
const fileSchema = z.instanceof(File, { message: "Required" })
const imageSchema = fileSchema.refine(
  file => file.size === 0 || file.type.startsWith("image/"),
  { message: "Must be an image" }
)

const addSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  priceInCents: z.coerce.number().int().min(1, "Price must be at least 1"),
  file: fileSchema.refine(file => file.size > 0, "File is required"),
  image: imageSchema.refine(file => file.size > 0, "Image is required"),
  categoryId: z.string().optional().or(z.literal("")),
})

const editSchema = addSchema.extend({
  file: fileSchema.optional(),
  image: imageSchema.optional(),
})

// CREATE PRODUCT
export async function addProduct(prevState: unknown, formData: FormData) {
  const result = addSchema.safeParse(Object.fromEntries(formData.entries()))
  if (!result.success) {
    return result.error.formErrors.fieldErrors
  }

  const data = result.data

  // Save product file
  await fs.mkdir("products", { recursive: true })
  const filePath = `products/${crypto.randomUUID()}-${data.file.name}`
  await fs.writeFile(filePath, new Uint8Array(await data.file.arrayBuffer()))

  // Save image
  await fs.mkdir("public/products", { recursive: true })
  const imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`
  await fs.writeFile(
    `public${imagePath}`,
    new Uint8Array(await data.image.arrayBuffer())
  )

  // Save to DB
  await db.product.create({
    data: {
      name: data.name,
      description: data.description,
      priceInCents: data.priceInCents,
      filePath,
      imagePath,
      isAvailableForPurchase: false,
      categoryId: data.categoryId || null,
    },
  })

  revalidatePath("/")
  revalidatePath("/products")
  redirect("/admin/products")
}

// UPDATE PRODUCT
export async function updateProduct(
  id: string,
  prevState: unknown,
  formData: FormData
) {
  const result = editSchema.safeParse(Object.fromEntries(formData.entries()))
  if (!result.success) {
    return result.error.formErrors.fieldErrors
  }

  const data = result.data
  const product = await db.product.findUnique({ where: { id } })
  if (!product) return notFound()

  let filePath = product.filePath
  if (data.file && data.file.size > 0) {
    await fs.unlink(product.filePath)
    filePath = `products/${crypto.randomUUID()}-${data.file.name}`
    await fs.writeFile(filePath, new Uint8Array(await data.file.arrayBuffer()))
  }

  let imagePath = product.imagePath
  if (data.image && data.image.size > 0) {
    await fs.unlink(`public${product.imagePath}`)
    imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`
    await fs.writeFile(
      `public${imagePath}`,
      new Uint8Array(await data.image.arrayBuffer())
    )
  }

  await db.product.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      priceInCents: data.priceInCents,
      filePath,
      imagePath,
      categoryId: data.categoryId || null,
    },
  })

  revalidatePath("/")
  revalidatePath("/products")
  redirect("/admin/products")
}

// TOGGLE AVAILABILITY
export async function toggleProductAvailability(
  id: string,
  isAvailableForPurchase: boolean
) {
  await db.product.update({
    where: { id },
    data: { isAvailableForPurchase },
  })

  revalidatePath("/")
  revalidatePath("/products")
}

// DELETE PRODUCT
export async function deleteProduct(id: string) {
  const product = await db.product.delete({ where: { id } })
  if (!product) return notFound()

  await fs.unlink(product.filePath)
  await fs.unlink(`public${product.imagePath}`)

  revalidatePath("/")
  revalidatePath("/products")
}
