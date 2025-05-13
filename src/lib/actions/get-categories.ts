import prisma from "@/db/db";

export async function getCategories() {
  return await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true // ensure slug is in the model
    },
  });
}
