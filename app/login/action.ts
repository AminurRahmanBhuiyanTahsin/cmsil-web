"use server";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function verifyLogin(idString: string, plainTextPassword: string, role: string) {
  try {
    let query = "";
    
    // 1. Database Queries
    if (role === "student") {
      query = "SELECT * FROM enrolledstudent WHERE institutionalRoll = ?";
    } else if (role === "teacher") {
      query = "SELECT * FROM faculty WHERE facultyId = ?"; 
    } else {
      query = "SELECT * FROM staff WHERE staffId = ?";
    }

    const [rows] = await db.execute(query as string, [idString]);
    const users = rows as any[];

    if (users.length === 0) {
      return { success: false, message: "User not found." };
    }

    const user = users[0];

    // 2. Security Checks
    if (!user.passwordHash) {
      return { success: false, message: "Account not fully set up. Missing password." };
    }

    const isPasswordValid = await bcrypt.compare(plainTextPassword, user.passwordHash);

    if (!isPasswordValid) {
      return { success: false, message: "Invalid password." };
    }
  
    // 3. Cookie Storage & Smart Routing
    const cookieStore = await cookies();
    let targetUrl = "/"; // Fallback URL
    
    if (role === "student") {
      cookieStore.set("studentId", user.id.toString());
      cookieStore.set("studentName", String(user.name || "Student"));
      cookieStore.set("institutionalRoll", String(user.institutionalRoll));
      cookieStore.set("studentDepartment", String(user.department || "Engineering"));
      cookieStore.set("studentCgpa", String(user.cgpa || "0.00"));
      cookieStore.set("studentSemester", String(user.currentSemester || "1"));
      
      targetUrl = "/student";

    } else if (role === "teacher") {
      cookieStore.set("teacherName", String(user.name || "Faculty"));
      cookieStore.set("teacherDepartment", String(user.department || "Engineering"));
      cookieStore.set("teacherDesignation", String(user.designation || "Faculty Member"));
      
      // ADD THIS LINE: This saves the email so the profile page can find the user!
      cookieStore.set("userEmail", String(user.email || "")); 
      
      targetUrl = "/teacher"; // Ensure this matches your file path!

    } else {
      // STAFF LOGIN LOGIC
      cookieStore.set("staffName", String(user.name || "Staff"));
      cookieStore.set("staffRole", String(user.role || "ADMINISTRATION")); 
      cookieStore.set("userEmail", String(user.email || "")); 
      
      // Route staff based on their specific job
      const staffJob = user.role;
      if (staffJob === "LIBRARY") targetUrl = "/staff/library";
      else if (staffJob === "ACCOUNTS") targetUrl = "/staff/finance";
      else if (staffJob === "IT_SUPPORT") targetUrl = "/staff/it-desk";
      else targetUrl = "/staff"; // Default Admin dashboard
    }

    // 4. Return success AND the custom URL!
    return { 
      success: true, 
      message: "Login successful!", 
      name: user.name,
      redirectUrl: targetUrl 
    };
  
  } catch (error) {
    console.error("Login Error:", error);
    return { success: false, message: "Server error during login." };
  }
}