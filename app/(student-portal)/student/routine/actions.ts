"use server";

import { db } from "@/lib/db"; 

export async function getStudentRoutine(studentId: number) {
  try {
    // 1. Get the student's department and semester
    const [studentRows]: any = await db.execute(
      `SELECT department, currentSemester FROM enrolledstudent WHERE id = ?`,
      [studentId]
    );

    if (studentRows.length === 0) {
      return { success: false, message: "Student not found" };
    }

    const { department, currentSemester } = studentRows[0];

    // 2. Fetch routine WITH the JOINs using your exact column names
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