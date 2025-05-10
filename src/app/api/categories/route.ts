import { NextResponse } from "next/server"
import db from "@/db/db"

// GET all categories
export async function GET() {
    try {
        const categories = await db.category.findMany()
        return NextResponse.json(categories)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
    }
}

// POST a new category
export async function POST(request: Request) {
    try {
        const { name, description } = await request.json()

        if (!name || !description) {
            return NextResponse.json(
                { error: "Category name and description are required" },
                { status: 400 }
            )
        }

        const category = await db.category.create({
            data: { name, description },
        })

        return NextResponse.json(category, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
    }
}

// DELETE a category
export async function DELETE(request: Request) {
    try {
        const { id } = await request.json()

        if (!id) {
            return NextResponse.json(
                { error: "Category ID is required" },
                { status: 400 }
            )
        }

        await db.category.delete({ where: { id } })

        return NextResponse.json({ message: "Category deleted successfully" })
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete category" }, { status: 500 })
    }
}

// PUT (update) a category
export async function PUT(request: Request) {
    try {
        const { id, name, description } = await request.json()

        if (!id || !name) {
            return NextResponse.json(
                { error: "Category ID and name are required" },
                { status: 400 }
            )
        }

        const category = await db.category.update({
            where: { id },
            data: { name, description },
        })

        return NextResponse.json(category)
    } catch (error) {
        return NextResponse.json({ error: "Failed to update category" }, { status: 500 })
    }
}
