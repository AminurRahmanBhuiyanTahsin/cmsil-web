import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const staffRecords = await prisma.staff.findMany({
      orderBy: { staffId: 'asc' }
    });
    return NextResponse.json(staffRecords, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve institutional staff layers.' }, { status: 500 });
  }
}