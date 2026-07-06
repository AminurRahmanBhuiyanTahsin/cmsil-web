// app/(teacher-portal)/teacher/courses/page.tsx
"use client";

import { useState, useEffect } from "react";
import { getTeacherCourses } from "./actions";
import Link from "next/link";

// For testing purposes. In production, get this from your Auth Session/Context.
const CURRENT_FACULTY_ID = 45; 

const BookIcon = () => (
  <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const ChartIcon = () => (
  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMyCourses() {
      setLoading(true);
      const res = await getTeacherCourses(CURRENT_FACULTY_ID);
      if (res.success) {
        setCourses((res.data as any[]) || []);
      }
      setLoading(false);
    }
    fetchMyCourses();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* --- Header Section --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-8 md:px-10 md:py-10">
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">My Courses</h1>
                <p className="text-slate-300 mt-2 font-medium">Overview of the modules you are currently tutoring.</p>
              </div>
              <div className="hidden md:block">
                <span className="bg-slate-700/50 text-slate-100 text-sm font-bold px-4 py-2 rounded-lg backdrop-blur-sm border border-slate-600/50">
                  {courses.length} Active Courses
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* --- Loading State --- */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-medium">Loading your course assignments...</p>
          </div>
        )}

        {/* --- Empty State --- */}
        {!loading && courses.length === 0 && (
          <div className="text-center py-24 bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
              <BookIcon />
            </div>
            <h3 className="text-xl font-bold text-gray-900">No Courses Assigned</h3>
            <p className="mt-2 text-gray-500 max-w-md">You currently have no active course assignments for this semester. Contact the administration if this is a mistake.</p>
          </div>
        )}

        {/* --- Courses Grid --- */}
        {!loading && courses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
                
                {/* Card Header (Dynamic color based on Department) */}
                <div className={`h-2 w-full ${
                  course.department === 'CSE' ? 'bg-blue-500' : 
                  course.department === 'EEE' ? 'bg-orange-500' : 
                  course.department === 'CE' ? 'bg-emerald-500' : 'bg-purple-500'
                }`}></div>
                
                <div className="p-6 flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200">
                      Semester {course.semester}
                    </span>
                    <span className="text-sm font-bold text-slate-400">{course.course_code}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-slate-700 transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                  
                  <div className="flex items-center text-sm font-medium text-gray-500 space-x-4 mt-4">
                     <div className="flex items-center">
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-bold mr-2">
                          {course.department}
                        </span>
                     </div>
                     <div>•</div>
                     <div>{course.credits} Credits</div>
                  </div>
                </div>
                
                {/* Card Actions Footer */}
                <div className="bg-gray-50 p-4 border-t border-gray-100 grid grid-cols-2 gap-3">
                  <Link href="/teacher/attendance" className="inline-flex justify-center items-center px-3 py-2 text-sm font-semibold text-slate-700 bg-white border border-gray-300 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm">
                    <UsersIcon />
                    Attendance
                  </Link>
                  <Link href="/teacher/grading" className="inline-flex justify-center items-center px-3 py-2 text-sm font-semibold text-white bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors shadow-sm">
                    <ChartIcon />
                    Grades
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}