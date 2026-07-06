"use server";

import { db } from "@/lib/db"; 

export async function getStudentResults(studentId: number) {
  try {
    // 1. Get basic student info (Name, Roll, Dept)
    const [studentRows]: any = await db.execute(
      `SELECT name, institutionalRoll, department, cgpa FROM enrolledstudent WHERE id = ?`,
      [studentId]
    );

    if (studentRows.length === 0) {
      return { success: false, message: "Student not found" };
    }

    // 2. Fetch all grades and join with the courses table for names and credits
    const [gradeRows]: any = await db.execute(
      `SELECT 
        g.semester,
        g.marks_obtained,
        g.grade_letter,
        g.gpa_point,
        c.course_code,
        c.title AS course_title,
        c.credits
       FROM grades g
       LEFT JOIN courses c ON g.course_id = c.id
       WHERE g.student_id = ?
       ORDER BY g.semester DESC, c.course_code ASC`,
      [studentId]
    );

    return { 
      success: true, 
      student: studentRows[0], 
      grades: gradeRows 
    };
  } catch (error) {
    console.error("🔥 SQL CRASH REPORT:", error);
    return { success: false, message: "Failed to load results" };
  }
}