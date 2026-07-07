"use server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function addBook(formData: FormData) {
  // Added stockQuantity and location to match your phpMyAdmin schema
  await db.execute(
    "INSERT INTO book (title, author, isbn, stockQuantity, location, status) VALUES (?, ?, ?, ?, ?, 'AVAILABLE')", 
    [
      formData.get("title"), 
      formData.get("author"), 
      formData.get("isbn"),
      formData.get("stockQuantity") || 1, // Default to 1 if empty
      formData.get("location") || "Unassigned"
    ]
  );
  revalidatePath("/staff/library");
}

export async function issueBook(formData: FormData) {
  const studentRoll = formData.get("studentRoll");
  const bookId = formData.get("bookId");

  // 1. Get the actual student ID from the enrolledstudent table
  const [students]: any = await db.execute(
    "SELECT id FROM enrolledstudent WHERE institutionalRoll = ?", 
    [studentRoll]
  );

  if (!students || students.length === 0) {
    throw new Error("Student not found with this Roll number.");
  }

  const studentId = students[0].id;

  // 2. Perform the insertion using the correct studentId
  await db.execute(
    "INSERT INTO libraryborrow (studentId, bookId, institutionalRoll, borrowDate, dueDate) VALUES (?, ?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY))", 
    [studentId, bookId, studentRoll]
  );

  // 3. Update book status
  await db.execute("UPDATE book SET status = 'BORROWED' WHERE id = ?", [bookId]);
  
  revalidatePath("/staff/library");
}

export async function returnBook(formData: FormData) {
  await db.execute("UPDATE libraryborrow SET returnDate = NOW() WHERE id = ?", [formData.get("id")]);
  revalidatePath("/staff/library");
}