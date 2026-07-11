"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { 
  CheckSquare, 
  PenTool, 
  Megaphone, 
  Calendar, 
  Clock, 
  MapPin, 
  BookOpen 
} from "lucide-react";
import { getTeacherRoutine } from "./routine/actions"; // We'll use the routine action

export default function TeacherDashboard() {
  const [nextClass, setNextClass] = useState<any>(null);
  
  // Hardcoded ID 45 for Dr. Mahbubur Rahman as discussed
  useEffect(() => {
    async function fetchNextClass() {
      const res = await getTeacherRoutine(45);
      // We cast res.data to 'any[]' so TypeScript knows it's an array
      const data = res.data as any[]; 
      
      if (res.success && data && data.length > 0) {
        setNextClass(data[0]); 
      }
    }
    fetchNextClass();
  }, []);

  const quickLinks = [
    { title: "Record Attendance", href: "/teacher/attendance", icon: <CheckSquare size={28} />, desc: "Mark today's classes", color: "text-emerald-600" },
    { title: "Input Grades", href: "/teacher/grading", icon: <PenTool size={28} />, desc: "Update lab & theory marks", color: "text-amber-600" },
    { title: "Full Routine", href: "/teacher/routine", icon: <Calendar size={28} />, desc: "View weekly schedule", color: "text-blue-600" },
    { title: "Publish Notice", href: "/teacher/notices", icon: <Megaphone size={28} />, desc: "Send alerts to students", color: "text-rose-600" },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      
      {/* BANNER */}
      <section className="bg-slate-900 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden border border-slate-800">
        <div className="relative z-10 space-y-2">
          <span className="inline-block bg-orange-500/20 text-orange-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-orange-500/30">
            Summer Term 2026
          </span>
          <h1 className="text-4xl font-black text-white">Welcome, Dr. Mahbubur Rahman</h1>
          <p className="text-slate-400 font-medium text-lg">Professor & Head of Dept • Department of CSE</p>
        </div>
      </section>

      {/* QUICK ACTIONS */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickLinks.map((link, i) => (
          <Link href={link.href} key={i}>
            <div className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:border-orange-300 transition-all duration-300 h-full flex flex-col">
              <div className={`w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 ${link.color} group-hover:scale-105 transition-transform`}>
                {link.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">{link.title}</h3>
              <p className="text-slate-500 text-sm grow">{link.desc}</p>
            </div>
          </Link>
        ))}
      </section>

      {/* LIVE SCHEDULE */}
      <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center">
          <Calendar className="mr-2" size={16} /> Next Class
        </h3>
        
        {nextClass ? (
          <div className="flex items-center gap-6 p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all">
            <div className="w-24 text-center shrink-0 border-r border-slate-200">
              <p className="text-xl font-black text-slate-800">
                {nextClass.start_time.substring(0, 5)}
              </p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Start Time</p>
            </div>
            <div className="grow">
              <div className="flex items-center space-x-2">
                 <h4 className="font-black text-slate-800 text-lg">{nextClass.title}</h4>
                 <span className="text-xs font-bold bg-slate-200 px-2 py-1 rounded">{nextClass.course_code}</span>
              </div>
              <div className="flex items-center text-sm text-slate-500 mt-2 space-x-4">
                <span className="flex items-center"><MapPin size={14} className="mr-1"/> {nextClass.room_number}</span>
                <span className="flex items-center"><Clock size={14} className="mr-1"/> {nextClass.class_type}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            <BookOpen className="mx-auto text-slate-300 mb-2" size={32} />
            <p className="text-slate-500 font-medium">No more classes scheduled for today. Enjoy your day!</p>
          </div>
        )}
      </section>
      
    </div>
  );
}