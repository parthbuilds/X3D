"use server";

import db from "@/db/db";
import { z } from "zod";
import fs from "fs/promises";
import path from "path";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// Validation schemas
const fileSchema = z.instanceof(File, { message: "Required" });
const imageSchema = fileSchema.refine(
  file => file.size === 0 || file.type.startsWith("image/"),
  { message: "Must be an image" }
);

const addSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  priceInCents: z.coerce.number().int().min(1, "Price must be at least 1"),
  file: fileSchema.refine(file => file.size > 0, "File is required"),
  image: imageSchema.refine(file => file.size > 0, "Image is required"),
  categoryId: z.string().optional().or(z.literal("")),
});

const editSchema = addSchema.extend({
  file: fileSchema.optional(),
  image: imageSchema.optional(),
});

async function saveFile(
  folder: string,
  file: File
): Promise<string> {
  const uploadDir = path.join(process.cwd(), "public", folder);
  await fs.mkdir(uploadDir, { recursive: true });

  const fileName = `${crypto.randomUUID()}-${file.name}`;
  const filePath = path.join(uploadDir, fileName);
  const publicPath = `/${folder}/${fileName}`;

  await fs.writeFile(filePath, new Uint8Array(await file.arrayBuffer()));
  return publicPath;
}

export async function addProduct(prevState: unknown, formData: FormData) {
  const result = addSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!result.success) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  const filePath = await saveFile("products/files", data.file);
  const imagePath = await saveFile("products/images", data.image);

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
  });

  revalidatePath("/");
  revalidatePath("/products");
  redirect("/admin/products");
}

export async function updateProduct(
  id: string,
  prevState: unknown,
  formData: FormData
) {
  const result = editSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!result.success) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;
  const product = await db.product.findUnique({ where: { id } });
  if (!product) return notFound();

  let filePath = product.filePath;
  if (data.file && data.file.size > 0) {
    await fs.unlink(path.join(process.cwd(), "public", product.filePath));
    filePath = await saveFile("products/files", data.file);
  }

  let imagePath = product.imagePath;
  if (data.image && data.image.size > 0) {
    await fs.unlink(path.join(process.cwd(), "public", product.imagePath));
    imagePath = await saveFile("products/images", data.image);
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
  });

  revalidatePath("/");
  revalidatePath("/products");
  redirect("/admin/products");
}

export async function toggleProductAvailability(
  id: string,
  isAvailableForPurchase: boolean
) {
  await db.product.update({
    where: { id },
    data: { isAvailableForPurchase },
  });

  revalidatePath("/");
  revalidatePath("/products");
}

export async function deleteProduct(id: string) {
  const product = await db.product.findUnique({ where: { id } });
  if (!product) return notFound();

  await db.product.delete({ where: { id } });

  await fs.unlink(path.join(process.cwd(), "public", product.filePath));
  await fs.unlink(path.join(process.cwd(), "public", product.imagePath));

  revalidatePath("/");
  revalidatePath("/products");
}
