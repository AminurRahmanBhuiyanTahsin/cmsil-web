import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET ALL FACULTY MEMBERS
export async function GET() {
  try {
    const facultyList = await prisma.faculty.findMany({
      orderBy: {
        department: 'asc'
      }
    });
    return NextResponse.json(facultyList, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to extract faculty data layers.' }, { status: 500 });
  }
}

// REGISTER NEW FACULTY MEMBERS (Admin Dashboard Submission Form)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, designation, department, email, imageUrl } = body;

    // Validate enum department constraints matches Prisma rules
    if (!['CSE', 'EEE', 'CE', 'ME'].includes(department)) {
      return NextResponse.json({ error: 'Invalid department sector assignment.' }, { status: 400 });
    }

    const newFaculty = await prisma.faculty.create({
      data: {
        name,
        designation,
        department,
        email,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400' // Default fallback placeholder avatar
      }
    });

    return NextResponse.json(newFaculty, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Database record registration collision.' }, { status: 500 });
  }
}