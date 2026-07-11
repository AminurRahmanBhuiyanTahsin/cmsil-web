"use client";

import { useEffect, useState } from "react";
import { getStudentRoutine } from "./actions";
import { Clock, MapPin, BookOpen, User, CalendarDays } from "lucide-react";

export default function StudentRoutinePage() {
  const [routine, setRoutine] = useState<any[]>([]);
  const [studentInfo, setStudentInfo] = useState({ dept: "", sem: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRoutine() {
      const res = await getStudentRoutine(); 
      
      if (res.success && res.data) {
        setRoutine(res.data);
        setStudentInfo({ dept: res.department, sem: res.semester });
      }
      setLoading(false);
    }
    fetchRoutine();
  }, []);

  // Group the flat SQL rows into an array of days
  const groupedRoutine = routine.reduce((acc: any, curr: any) => {
    if (!acc[curr.day_of_week]) acc[curr.day_of_week] = [];
    acc[curr.day_of_week].push(curr);
    return acc;
  }, {});

  if (loading) {
    return <div className="p-8 text-slate-500 font-bold animate-pulse">Loading Weekly Schedule...</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      
      {/* HEADER BANNER */}
      <section className="bg-slate-900 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden border border-slate-800">
        <div className="relative z-10 space-y-2">
          <span className="inline-block bg-blue-500/20 text-blue-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-blue-500/30">
            {studentInfo.dept} • Semester {studentInfo.sem}
          </span>
          <h1 className="text-4xl font-black text-white flex items-center gap-3">
            <CalendarDays size={36} className="text-blue-500" />
            My Weekly Routine
          </h1>
          <p className="text-slate-400 font-medium text-lg">Official Class Schedule for Summer Term 2026</p>
        </div>
      </section>

      {/* SCHEDULE LIST */}
      <div className="space-y-10">
        {Object.keys(groupedRoutine).length === 0 ? (
          <div className="text-center p-12 bg-white rounded-2xl border border-dashed border-slate-300">
            <p className="text-slate-500 font-bold text-lg">No classes assigned for this semester yet.</p>
          </div>
        ) : (
          Object.keys(groupedRoutine).map((day, index) => (
            <section key={index} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-black text-slate-800 mb-6 uppercase tracking-tight border-b border-slate-100 pb-4">
                {day}
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {groupedRoutine[day].map((cls: any, i: number) => (
                  <div key={i} className="flex flex-col sm:flex-row gap-6 p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-300 hover:shadow-md transition-all group">
                    
                    {/* Time Block */}
                    <div className="sm:w-32 sm:border-r border-slate-200 shrink-0 flex flex-col justify-center">
                      <p className="text-xl font-black text-slate-800">{cls.start_time.substring(0, 5)}</p>
                      <p className="text-sm font-bold text-slate-400">to {cls.end_time.substring(0, 5)}</p>
                    </div>

                    {/* Class Details */}
                    <div className="grow space-y-3">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-sm ${
                            cls.class_type === 'Lab' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {cls.class_type}
                          </span>
                          <span className="text-xs font-bold text-slate-500 bg-slate-200 px-2 py-1 rounded">
                            {cls.course_code || 'CODE'}
                          </span>
                        </div>
                        <h4 className="font-black text-slate-800 text-lg group-hover:text-blue-600 transition-colors">
                          {cls.course_title || 'Course Title Unavailable'}
                        </h4>
                      </div>

                      <div className="flex flex-wrap items-center text-sm text-slate-600 gap-y-2 gap-x-6">
                        <span className="flex items-center gap-1.5"><MapPin size={16} className="text-slate-400"/> {cls.room_number}</span>
                        <span className="flex items-center gap-1.5"><User size={16} className="text-slate-400"/> {cls.faculty_name || 'TBA'}</span>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}