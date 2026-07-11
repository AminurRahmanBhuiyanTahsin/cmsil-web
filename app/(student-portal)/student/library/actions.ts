"use server";

import { db } from "@/lib/db"; 
import { cookies } from "next/headers"; // Add this import!

export async function getLibraryData() {
  try {
    // 1. Get the dynamic student ID from the cookie
    const cookieStore = await cookies();
    const studentIdString = cookieStore.get("studentId")?.value;
    
    if (!studentIdString) {
      return { success: false, message: "Unauthorized: No session found." };
    }
    
    const studentId = parseInt(studentIdString, 10);

    // 2. Fetch active borrowed books for this specific student
    const [borrowedRows]: any = await db.execute(
      `SELECT 
        lb.id as borrow_id, 
        lb.borrowDate, 
        lb.dueDate, 
        lb.isOverdue,
        b.title, 
        b.author, 
        b.isbn
       FROM libraryborrow lb
       JOIN book b ON lb.bookId = b.id
       WHERE lb.studentId = ? AND lb.returnDate IS NULL
       ORDER BY lb.dueDate ASC`,
      [studentId]
    );

    // 3. Fetch the available library catalog
    const [catalogRows]: any = await db.execute(
      `SELECT id, isbn, title, author, stockQuantity, location 
       FROM book 
       WHERE status = 'AVAILABLE' 
       ORDER BY title ASC`
    );

    // Serialize dates to strings to pass safely from Server to Client
    const serializedBorrowed = borrowedRows.map((row: any) => ({
      ...row,
      borrowDate: row.borrowDate ? new Date(row.borrowDate).toISOString() : null,
      dueDate: row.dueDate ? new Date(row.dueDate).toISOString() : null,
    }));

    return { 
      success: true, 
      borrowed: serializedBorrowed, 
      catalog: catalogRows 
    };
  } catch (error) {
    console.error("🔥 SQL CRASH REPORT:", error);
    return { success: false, message: "Failed to load library data" };
  }
}