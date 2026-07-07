import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Import your mysql2 pool from image_a6893a.png

export async function GET() {
  try {
    // 1. Execute raw SQL query against the MariaDB pool
    const [rows] = await db.query(
      'SELECT id, title, content, category, scope, postedBy, createdAt FROM notice ORDER BY createdAt DESC'
    );
    
    // 2. Return the data rows directly to the client
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json(
      { error: 'Failed to extract bulletin board registries via native driver' }, 
      { status: 500 }
    );
  }
}