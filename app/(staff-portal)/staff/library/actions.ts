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
  await db.execute(
    "INSERT INTO libraryborrow (studentId, bookId, institutionalRoll, borrowDate, dueDate) VALUES (?, ?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY))", 
    [0, formData.get("bookId"), formData.get("studentRoll")]
  ); 
  await db.execute("UPDATE book SET status = 'BORROWED' WHERE id = ?", [formData.get("bookId")]);
  revalidatePath("/staff/library");
}

export async function returnBook(formData: FormData) {
  await db.execute("UPDATE libraryborrow SET returnDate = NOW() WHERE id = ?", [formData.get("id")]);
  revalidatePath("/staff/library");
}