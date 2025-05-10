// Example of the delete API handler (in `/pages/api/categories/[id].ts`)
import { NextApiRequest, NextApiResponse } from "next"
import prisma from "@/db/db" // Adjust to your actual prisma client import

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "DELETE") {
        const { id } = req.query

        try {
            const category = await prisma.category.delete({
                where: {
                    id: String(id),
                },
            })

            res.status(200).json({ message: "Category deleted successfully", category })
        } catch (error) {
            res.status(500).json({ error: "Failed to delete category" })
        }
    } else {
        res.status(405).json({ error: "Method Not Allowed" })
    }
}
