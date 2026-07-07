"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedCounter from "./AnimatedCounter";

export default function FacultyDirectory({ facultyData }: { facultyData: any[] }) {
  const [selectedTeacher, setSelectedTeacher] = useState<any | null>(null);

  const groupedFaculty = facultyData.reduce((acc: any, member: any) => {
    if (!acc[member.department]) acc[member.department] = [];
    acc[member.department].push(member);
    return acc;
  }, {});

  const totalDepts = Object.keys(groupedFaculty).length;
  const totalFaculty = facultyData.length;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      {/* Counters Header */}
      <div className="flex justify-center gap-8 mb-12">
        <div className="bg-white px-10 py-5 rounded-2xl shadow-sm border border-slate-100 text-center">
          <div className="text-4xl font-black text-indigo-600"><AnimatedCounter from={0} to={totalDepts} /></div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Departments</div>
        </div>
        <div className="bg-white px-10 py-5 rounded-2xl shadow-sm border border-slate-100 text-center">
          <div className="text-4xl font-black text-orange-500"><AnimatedCounter from={0} to={totalFaculty} /></div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Faculty</div>
        </div>
      </div>

      {/* Directory Content */}
      {Object.entries(groupedFaculty).map(([dept, members]: [string, any]) => (
        <section key={dept} className="max-w-7xl mx-auto mb-12">
          <h2 className="text-2xl font-black text-slate-800 mb-6 border-l-4 border-indigo-500 pl-4">{dept}</h2>
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {members.map((t: any) => (
              <motion.div 
                key={t.id} 
                whileHover={{ y: -5 }}
                onClick={() => setSelectedTeacher(t)}
                className="min-w-[260px] bg-white rounded-2xl p-6 shadow-sm border border-slate-200 cursor-pointer hover:border-indigo-300 transition-colors"
              >
                <img src={t.imageUrl} className="w-20 h-20 rounded-full mx-auto mb-4 object-cover" />
                <h3 className="font-bold text-center text-slate-800">{t.name}</h3>
                <p className="text-xs text-indigo-600 text-center font-semibold uppercase tracking-wide">{t.designation}</p>
              </motion.div>
            ))}
          </div>
        </section>
      ))}

{/* Sidebar Overlay - Updated for better visibility and bolder styling */}
<AnimatePresence>
  {selectedTeacher && (
    <>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }}
        onClick={() => setSelectedTeacher(null)}
        className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 h-full w-full md:w-[450px] bg-white z-50 p-10 shadow-2xl overflow-y-auto"
      >
        <button 
          onClick={() => setSelectedTeacher(null)} 
          className="text-slate-500 hover:text-slate-900 mb-8 font-bold text-lg"
        >
          Close ✕
        </button>
        
        {/* Larger Image Styling */}
        <img 
          src={selectedTeacher.imageUrl} 
          className="w-48 h-48 rounded-3xl mb-8 mx-auto object-cover shadow-2xl border-4 border-slate-100" 
        />
        
        {/* Bolder, Larger Text */}
        <h2 className="text-3xl font-extrabold mb-2 text-slate-900 text-center">{selectedTeacher.name}</h2>
        <p className="text-xl font-semibold text-indigo-700 mb-10 text-center">{selectedTeacher.designation}</p>
        
        {/* Information Grid with clearer, bolder text */}
        <div className="space-y-8 bg-slate-50 p-8 rounded-2xl border border-slate-100">
          <div>
            <label className="text-slate-500 block font-bold uppercase text-[11px] tracking-widest mb-2">Degree</label>
            <span className="text-lg font-semibold text-slate-800">{selectedTeacher.highestDegree}</span>
          </div>
          <div>
            <label className="text-slate-500 block font-bold uppercase text-[11px] tracking-widest mb-2">Alma Mater</label>
            <span className="text-lg font-semibold text-slate-800">{selectedTeacher.almaMater}</span>
          </div>
          <div>
            <label className="text-slate-500 block font-bold uppercase text-[11px] tracking-widest mb-2">Office Room</label>
            <span className="text-lg font-semibold text-slate-800">{selectedTeacher.roomNumber}</span>
          </div>
          <div>
            <label className="text-slate-500 block font-bold uppercase text-[11px] tracking-widest mb-2">Research Interest</label>
            <span className="text-lg font-semibold text-indigo-900 leading-relaxed">{selectedTeacher.researchInterest}</span>
          </div>
        </div>
      </motion.div>
    </>
  )}
</AnimatePresence>
    </div>
  );
}