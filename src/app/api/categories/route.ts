import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET all categories with at least one product
export async function GET() {
  const categories = await prisma.category.findMany({
    where: {
      products: {
        some: {}, 
      },
    },
    include: {
      products: true,
    },
    
  });

  return NextResponse.json(categories);
}


export async function POST(request: NextRequest) {
    try {
        const { name, description } = await request.json();

        if (!name || !description) {
            return NextResponse.json({ error: 'Name and description are required' }, { status: 400 });
        }

        const newCategory = await prisma.category.create({
            data: {
                name,
                description,
            },
        });

        return NextResponse.json(newCategory, { status: 201 });
    } catch (error) {
        console.error('Error creating category:', error);
        return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const categoryId = params.id;

    if (!categoryId) {
        return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    try {
        const deletedCategory = await prisma.category.delete({
            where: {
                id: categoryId,
            },
        });

        if (!deletedCategory) {
            return NextResponse.json({ error: `Category with ID ${categoryId} not found` }, { status: 404 });
        }

        return NextResponse.json({ message: `Category with ID ${categoryId} deleted successfully` });
    } catch (error) {
        console.error(`Error deleting category with ID ${categoryId}:`, error);
        return NextResponse.json({ error: `Failed to delete category with ID ${categoryId}` }, { status: 500 });
    }
}

// If you need to handle PUT/PATCH for updating categories, you can add those functions here.
// Example for PUT:
/*
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const categoryId = params.id;

  if (!categoryId) {
    return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
  }

  try {
    const { name, description } = await request.json();

    if (!name || !description) {
      return NextResponse.json({ error: 'Name and description are required for update' }, { status: 400 });
    }

    const updatedCategory = await prisma.category.update({
      where: {
        id: categoryId,
      },
      data: {
        name,
        description,
      },
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error(`Error updating category with ID ${categoryId}:`, error);
    return NextResponse.json({ error: `Failed to update category with ID ${categoryId}` }, { status: 500 });
  }
}
*/