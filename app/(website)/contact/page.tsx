'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, ShieldCheck, Cpu, Database, Globe } from 'lucide-react';

export default function Contact() {
  return (
    <main className="min-h-screen bg-white pb-20 selection:bg-blue-600 selection:text-white">
      
      {/* 1. HERO SECTION: Professional Branding */}
      <section className="bg-slate-950 text-white py-32 px-6 relative overflow-hidden">
        {/* Subtle Engineering Grid Background */}
        <div className="absolute inset-0 opacity-[0.05]" 
             style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto relative z-10 text-center"
        >
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4 uppercase">
            CONTACT
          </h1>
          <p className="text-blue-400 font-bold tracking-[0.5em] text-[10px] md:text-xs uppercase">
            Institutional Support & Global Systems Logistics
          </p>
        </motion.div>
      </section>

      {/* 2. INTERACTIVE INFO CARDS */}
      <section className="max-w-7xl mx-auto -mt-16 px-6 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Office Card */}
          <motion.div 
            whileHover={{ y: -12 }}
            className="bg-white p-12 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col items-center text-center group transition-all"
          >
            <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:rotate-12 transition-all duration-500">
              <MapPin className="text-blue-600 group-hover:text-white transition-colors" size={28} />
            </div>
            <h3 className="font-black text-slate-900 text-lg mb-4 uppercase tracking-widest">Main Campus</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              Plot 12, Engineering Sector,<br />Uttara, Dhaka-1212, Bangladesh
            </p>
          </motion.div>

          {/* Email Card */}
          <motion.div 
            whileHover={{ y: -12 }}
            className="bg-white p-12 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col items-center text-center group transition-all"
          >
            <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:rotate-12 transition-all duration-500">
              <Mail className="text-blue-600 group-hover:text-white transition-colors" size={28} />
            </div>
            <h3 className="font-black text-slate-900 text-lg mb-4 uppercase tracking-widest">Digital Inbox</h3>
            <p className="text-blue-600 font-black text-sm mb-2 hover:scale-105 transition-transform cursor-pointer">
              registrar@cmsil-edu.ac.bd
            </p>
            <p className="text-slate-400 text-[10px] uppercase tracking-[0.2em] font-bold">Encrypted Communication</p>
          </motion.div>

          {/* Support Card */}
          <motion.div 
            whileHover={{ y: -12 }}
            className="bg-white p-12 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col items-center text-center group transition-all"
          >
            <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:rotate-12 transition-all duration-500">
              <Phone className="text-blue-600 group-hover:text-white transition-colors" size={28} />
            </div>
            <h3 className="font-black text-slate-900 text-lg mb-4 uppercase tracking-widest">Help Desk</h3>
            <p className="text-slate-900 font-black text-xl tracking-tighter">+880-2-5566-6000</p>
            <p className="text-slate-400 text-[10px] uppercase tracking-[0.2em] font-bold mt-1">Ext: 234 (Admissions)</p>
          </motion.div>

        </div>
      </section>

      {/* 3. ADMINISTRATION STATUS SECTION */}
      <section className="max-w-7xl mx-auto py-32 px-6">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          
          {/* Engineering Visual */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2 relative group"
          >
             <div className="absolute -inset-4 border border-blue-600/10 rounded-3xl translate-x-4 translate-y-4 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-700"></div>
             <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-slate-200 aspect-video">
                <img src="/teacher_meeting.webp" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" alt="Admin Meeting" />
                <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-transparent transition-colors"></div>
             </div>
          </motion.div>

          {/* Admin Details */}
          <div className="flex-1 space-y-10">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-4">Administration Dashboard</h2>
              <div className="h-1.5 w-24 bg-blue-600 mb-8"></div>
              <p className="text-slate-500 font-medium leading-relaxed">
                Core system architecture and institutional governance maintained by the "Group-D" technical committee.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {[
                { name: "Md. Faisal Rahman", role: "Head of System Administration", icon: <ShieldCheck size={20} /> },
                { name: "Md. Aminur Rahman Bhuiyan Tahsin", role: "Lead Full-Stack Developer", icon: <Cpu size={20} /> },
                { name: "Md. Mahfuzur Rahman Nihad", role: "Database Coordinator", icon: <Database size={20} /> }
              ].map((admin, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-6 p-6 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group"
                >
                  <div className="p-4 bg-white shadow-sm rounded-xl text-blue-600 group-hover:scale-110 transition-transform">
                    {admin.icon}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-sm uppercase tracking-tight">{admin.name}</h4>
                    <p className="text-blue-600 text-[9px] font-black tracking-[0.2em] uppercase mt-1">{admin.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </section>

    </main>
  );
}