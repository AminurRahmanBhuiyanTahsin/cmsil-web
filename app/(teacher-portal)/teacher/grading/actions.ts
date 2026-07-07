// app/(teacher-portal)/teacher/grading/actions.ts
"use server";
import { db } from "@/lib/db"; // Ensure this path points to your mysql2 connection pool

// Define the shape of the data we expect when saving grades
type GradePayload = {
  student_id: number;
  institutionalRoll: string;
  course_id: number;
  semester: number;
  marks_obtained: number;
  grade_letter: string;
  gpa_point: number;
};

// 1. Function to fetch students and their existing grades
export async function getStudentsForGrading(department: string, semester: number, courseId: number) {
  try {
    const query = `
      SELECT 
        e.*, 
        g.marks_obtained, 
        g.grade_letter, 
        g.gpa_point
      FROM enrolledstudent e
      LEFT JOIN grades g ON e.id = g.student_id AND g.course_id = ?
      WHERE e.department = ? AND e.currentSemester = ?
      ORDER BY e.institutionalRoll ASC
    `;
    
    // Using mysql2's parameterization to prevent SQL injection
    const [rows] = await db.execute(query, [courseId, department, semester]);
    
    return { success: true, data: rows };
  } catch (error) {
    console.error("Error fetching roster:", error);
    return { success: false, message: "Failed to load students." };
  }
}

// 2. Function to safely save/update the grades in bulk
export async function saveBulkGrades(gradesData: GradePayload[]) {
  // Grab a dedicated connection from the pool so we can use a transaction
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const query = `
      INSERT INTO grades (student_id, institutionalRoll, course_id, semester, marks_obtained, grade_letter, gpa_point)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        marks_obtained = VALUES(marks_obtained),
        grade_letter = VALUES(grade_letter),
        gpa_point = VALUES(gpa_point)
    `;

    // Loop through the grades and execute the upsert for each one
    for (const grade of gradesData) {
      await connection.execute(query, [
        grade.student_id,
        grade.institutionalRoll,
        grade.course_id,
        grade.semester,
        grade.marks_obtained,
        grade.grade_letter,
        grade.gpa_point,
      ]);
    }

    await connection.commit();
    return { success: true, message: "Grades saved successfully!" };
    
  } catch (error) {
    await connection.rollback(); // If anything fails, undo all changes
    console.error("Error saving bulk grades:", error);
    return { success: false, message: "Failed to save grades to the database." };
  } finally {
    connection.release(); // Always return the connection to the pool
  }
}

// 3. Function to fetch courses for the dropdown menu
export async function getCoursesForDropdown(department: string, semester: number) {
    try {
      const query = `
        SELECT id, course_code, title 
        FROM courses 
        WHERE department = ? AND semester = ? 
        ORDER BY course_code ASC
      `;
      
      const [rows] = await db.execute(query, [department, semester]);
      
      return { success: true, data: rows };
    } catch (error) {
      console.error("Error fetching courses:", error);
      return { success: false, data: [] };
    }
  }