// app/(teacher-portal)/teacher/routine/page.tsx
"use client";

import { useState, useEffect } from "react";
import { getTeacherRoutine } from "./actions";

const CURRENT_FACULTY_ID = 45;

const ClockIcon = () => (
  <svg className="w-4 h-4 mr-1.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const LocationIcon = () => (
  <svg className="w-4 h-4 mr-1.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

// Helper to convert 24h SQL time to readable 12h AM/PM
function formatTime(timeStr: string) {
  if (!timeStr) return "";
  const [hourString, minute] = timeStr.split(":");
  const hour = parseInt(hourString, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minute} ${ampm}`;
}

export default function RoutinePage() {
  const [routine, setRoutine] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRoutine() {
      setLoading(true);
      const res = await getTeacherRoutine(CURRENT_FACULTY_ID);
      if (res.success) {
        setRoutine((res.data as any[]) || []);
      }
      setLoading(false);
    }
    fetchRoutine();
  }, []);

  // Group the flat SQL rows by day of the week
  const groupedRoutine = routine.reduce((acc, curr) => {
    if (!acc[curr.day_of_week]) acc[curr.day_of_week] = [];
    acc[curr.day_of_week].push(curr);
    return acc;
  }, {} as Record<string, any[]>);

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* --- Header Section --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-8 md:px-10 md:py-10">
            <h1 className="text-3xl font-bold text-white tracking-tight">Weekly Schedule</h1>
            <p className="text-slate-300 mt-2 font-medium">Your upcoming classes and lab sessions.</p>
          </div>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-medium">Loading schedule...</p>
          </div>
        )}

        {!loading && routine.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">No Classes Scheduled</h3>
            <p className="mt-1 text-sm text-gray-500">You do not have any classes assigned in the routine database.</p>
          </div>
        )}

        {/* --- Weekly Schedule Cards --- */}
        {!loading && routine.length > 0 && (
          <div className="space-y-6">
            {daysOfWeek.map((day) => {
              const classesForDay = groupedRoutine[day];
              if (!classesForDay) return null; // Skip days with no classes

              return (
                <div key={day} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="bg-slate-50 border-b border-gray-200 px-6 py-4">
                    <h2 className="text-lg font-bold text-slate-800">{day}</h2>
                  </div>
                  
                  <div className="divide-y divide-gray-100">
                  {classesForDay.map((cls: any) => (
                      <div key={cls.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-slate-50/50 transition-colors">
                        
                        <div className="flex-1 mb-4 md:mb-0">
                          <div className="flex items-center space-x-3 mb-1">
                            <span className="text-sm font-bold text-slate-500">{cls.course_code}</span>
                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${cls.class_type === 'Lab' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'}`}>
                              {cls.class_type}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900">{cls.title}</h3>
                          <div className="text-sm font-medium text-gray-500 mt-1">
                            {cls.department} • Semester {cls.semester}
                          </div>
                        </div>

                        <div className="flex flex-col space-y-2 md:items-end">
                          <div className="flex items-center text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg font-semibold text-sm w-fit">
                            <ClockIcon />
                            {formatTime(cls.start_time)} - {formatTime(cls.end_time)}
                          </div>
                          <div className="flex items-center text-slate-600 font-medium text-sm">
                            <LocationIcon />
                            Room {cls.room_number}
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}