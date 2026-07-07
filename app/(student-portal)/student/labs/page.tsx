"use client";

import { useEffect, useState } from "react";
import { getStudentLabs } from "./actions";
import { Microscope, MapPin, User, Clock, MonitorPlay, Beaker } from "lucide-react";

export default function StudentLabsPage() {
  const [labs, setLabs] = useState<any[]>([]);
  const [studentInfo, setStudentInfo] = useState({ dept: "", sem: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLabs() {
      // Hardcoded ID 401 (Ahsan Habib) for testing
      const res = await getStudentLabs(401); 
      
      if (res.success && res.data) {
        setLabs(res.data);
        setStudentInfo({ dept: res.department, sem: res.semester });
      }
      setLoading(false);
    }
    fetchLabs();
  }, []);

  if (loading) {
    return <div className="p-8 text-slate-500 font-bold animate-pulse">Initializing Laboratory Data...</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      
      {/* HEADER BANNER */}
      <section className="bg-slate-950 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 p-8 opacity-10">
           <Beaker size={120} />
        </div>
        <div className="relative z-10 space-y-2">
          <span className="inline-block bg-cyan-500/20 text-cyan-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-cyan-500/30">
            {studentInfo.dept} • Semester {studentInfo.sem}
          </span>
          <h1 className="text-4xl font-black text-white flex items-center gap-3 tracking-tight">
            <Microscope size={36} className="text-cyan-400" />
            Laboratory Assignments
          </h1>
          <p className="text-slate-400 font-medium text-lg">Practical sessions and technical workflows.</p>
        </div>
      </section>

      {/* LAB CLASSES GRID */}
      <section>
        {labs.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-2xl border border-dashed border-slate-300">
            <p className="text-slate-500 font-bold text-lg">No laboratory sessions assigned for this semester.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {labs.map((lab: any, i: number) => (
              <div key={i} className="flex flex-col sm:flex-row p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-cyan-300 hover:shadow-md transition-all group">
                
                {/* Visual Icon Block */}
                <div className="hidden sm:flex w-20 bg-slate-50 rounded-xl items-center justify-center border border-slate-100 mr-6 group-hover:bg-cyan-50 group-hover:border-cyan-200 transition-colors">
                  <MonitorPlay size={32} className="text-slate-400 group-hover:text-cyan-600 transition-colors" />
                </div>

                {/* Lab Details */}
                <div className="flex-grow space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-sm bg-cyan-100 text-cyan-700">
                        PRACTICAL
                      </span>
                      <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                        {lab.course_code}
                      </span>
                    </div>
                    <h3 className="font-black text-slate-800 text-xl group-hover:text-cyan-700 transition-colors leading-tight">
                      {lab.course_title}
                    </h3>
                    <p className="text-sm font-semibold text-slate-500 flex items-center gap-1.5 mt-2">
                      <User size={16} className="text-slate-400" /> 
                      {lab.faculty_name}
                    </p>
                  </div>

                  {/* Scheduling Footer inside the card */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                    <div className="flex items-start gap-2">
                      <Clock size={18} className="text-cyan-600 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{lab.day_of_week}</p>
                        <p className="text-sm font-bold text-slate-700">{lab.start_time.substring(0, 5)} - {lab.end_time.substring(0, 5)}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin size={18} className="text-cyan-600 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Location</p>
                        <p className="text-sm font-bold text-slate-700">{lab.room_number}</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}