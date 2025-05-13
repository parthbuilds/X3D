// app/api/categories/route.ts

import { NextResponse, NextRequest } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// ✅ GET all categories
export async function GET() {
    try {
        const categories = await prisma.category.findMany()
        return NextResponse.json(categories)
    } catch (error) {
        console.error("GET /api/categories failed:", error)
        return NextResponse.json([], { status: 500 })
    }
}

// ✅ POST - Create a new category
export async function POST(request: NextRequest) {
    try {
        const { name, description } = await request.json()

        if (!name || !description) {
            return NextResponse.json({ error: 'Name and description are required' }, { status: 400 })
        }

        const newCategory = await prisma.category.create({
            data: { name, description },
        })

        return NextResponse.json(newCategory, { status: 201 })
    } catch (error: any) {
        console.error("POST /api/categories failed:", error)
        return NextResponse.json({ error: error?.message || "Failed to create category" }, { status: 500 })
    }
}
