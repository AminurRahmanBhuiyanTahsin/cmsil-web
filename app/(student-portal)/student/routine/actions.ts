"use server";

import { db } from "@/lib/db"; 
import { cookies } from "next/headers"; // Added cookie import!

export async function getStudentRoutine() { // Removed the studentId parameter
  try {
    // 1. Get the dynamic student ID from the cookie
    const cookieStore = await cookies();
    const studentIdString = cookieStore.get("studentId")?.value;
    
    if (!studentIdString) {
      return { success: false, message: "Unauthorized: No session found." };
    }
    
    const studentId = parseInt(studentIdString, 10);

    // 2. Get the student's department and semester
    const [studentRows]: any = await db.execute(
      `SELECT department, currentSemester FROM enrolledstudent WHERE id = ?`,
      [studentId]
    );

    if (studentRows.length === 0) {
      return { success: false, message: "Student not found" };
    }

    const { department, currentSemester } = studentRows[0];

    // 3. Fetch routine WITH the JOINs using your exact column names
    const [routineRows]: any = await db.execute(
      `SELECT 
        cr.day_of_week, 
        cr.start_time, 
        cr.end_time, 
        cr.room_number, 
        cr.class_type,
        c.title AS course_title,
        c.course_code AS course_code,
        f.name AS faculty_name
       FROM class_routine cr
       LEFT JOIN courses c ON cr.course_id = c.id
       LEFT JOIN faculty f ON cr.faculty_id = f.id
       WHERE cr.department = ? AND cr.semester = ?
       ORDER BY 
        FIELD(cr.day_of_week, 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'), 
        cr.start_time`,
      [department, currentSemester]
    );

    return { success: true, data: routineRows, department, semester: currentSemester };
  } catch (error) {
    console.error("Error fetching student routine:", error);
    return { success: false, message: "Failed to load routine" };
  }
}