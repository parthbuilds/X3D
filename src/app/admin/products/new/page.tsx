import { PageHeader } from "../../_components/PageHeader"
import { ProductForm } from "../_components/ProductForm"
import db from "@/db/db"

export default async function NewProductPage() {
  const categories = await db.category.findMany()

  return (
    <>
      <PageHeader>Add Product</PageHeader>
      <ProductForm categories={categories} />
    </>
  )
}
