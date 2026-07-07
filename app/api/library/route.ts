import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 1. GET ALL ACTIVE LOANS (To render in your Digital Library Dashboard)
export async function GET() {
  try {
    const activeLoans = await prisma.libraryBorrow.findMany({
      include: {
        book: true,
        student: {
          select: { name: true, department: true }
        }
      },
      orderBy: { borrowDate: 'desc' }
    });
    return NextResponse.json(activeLoans, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve active library circulation data' }, { status: 500 });
  }
}

// 2. CHECKOUT A NEW BOOK (Triggered from admin form)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentId, bookId } = body;

    // Check if the book has physical inventory left
    const targetBook = await prisma.book.findUnique({ where: { id: parseInt(bookId) } });
    if (!targetBook || targetBook.stockQuantity <= 0) {
      return NextResponse.json({ error: 'This technical title is currently out of stock.' }, { status: 400 });
    }

    // Insert the loan (Our database triggers will handle stock quantity reductions and auto-roll lookups)
    const loanRecord = await prisma.libraryBorrow.create({
      data: {
        studentId: parseInt(studentId),
        bookId: parseInt(bookId),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      }
    });

    return NextResponse.json(loanRecord, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Transaction engine insertion collision' }, { status: 500 });
  }
}