
import { NextResponse } from 'next/server';
import prisma from '@/db/db'; // adjust this path if needed

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            include: {
                category: true, // includes the related category for each product
            },
        });

        return NextResponse.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
