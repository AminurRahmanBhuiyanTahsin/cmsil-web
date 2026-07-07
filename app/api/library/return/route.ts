import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { borrowId } = body; // Pass the primary ID of the transaction row

    const updatedLoan = await prisma.libraryBorrow.update({
      where: { id: parseInt(borrowId) },
      data: {
        returnDate: new Date(), // This sets the timestamp and kicks off our "after_book_return" trigger!
      }
    });

    return NextResponse.json(updatedLoan, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Processing return logs failed' }, { status: 500 });
  }
}