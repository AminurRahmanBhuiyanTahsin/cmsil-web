import React from 'react';
import { ShieldCheck, Award, BookOpen, Clock, Target, Eye, Mail, MapPin } from 'lucide-react';

export default function AboutPage() {
  const stats = [
    { label: "Active Enrolled Students", value: "240+", icon: <Award className="w-5 h-5 text-blue-600" /> },
    { label: "Engineering Faculty", value: "40", icon: <ShieldCheck className="w-5 h-5 text-indigo-600" /> },
    { label: "Core Library Assets", value: "800", icon: <BookOpen className="w-5 h-5 text-blue-700" /> },
    { label: "Engineering Departments", value: "4", icon: <Clock className="w-5 h-5 text-slate-700" /> },
  ];

  const policies = [
    {
      title: "Identity Verification Protocol",
      description: "100% user authentication layer enforced across all campus domains via pre-provisioned institutional credentials.",
      badge: "Security Standard"
    },
    {
      title: "Academic Attendance Standing",
      description: "A strict 75% minimum classroom session footprint is mandatory for semester final examination seat clearance allocation.",
      badge: "Academic Code"
    },
    {
      title: "Asset Circulation Liability",
      description: "7-Day active circulation limits applied to core textbook engineering reserves with automated late-return tracking.",
      badge: "Library Policy"
    }
  ];

  const admins = [
    {
      name: "Kazi Arifuzzaman",
      role: "Registrar & Chief Administrator",
      room: "Office Room: Admin-101",
      email: "registrar@cmsil-edu.ac.bd",
      img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600"
    },
    {
      name: "Nusrat Jahan Popi",
      role: "Human Resources Director",
      room: "Office Room: Admin-102",
      email: "hr@cmsil-edu.ac.bd",
      img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600"
    },
    {
      name: "Lutfor Rahman",
      role: "Chief Financial Officer",
      room: "Office Room: Accounts-201",
      email: "accounts@cmsil-edu.ac.bd",
      img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600"
    }
  ];

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen font-sans antialiased selection:bg-blue-600 selection:text-white">
      
      {/* 1. Trust-Building Clean Hero Section */}
      <div className="relative bg-gradient-to-b from-white to-slate-100 border-b border-slate-200/80 py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <span className="text-blue-700 font-semibold tracking-wider text-xs uppercase px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20">
            Established 2012 • Institutional Profile
          </span>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-950 mt-4">
            About CMSIL Engineering Institute
          </h1>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto text-base leading-relaxed">
            Dedicated to shaping the next vanguard of technological talent through structured academic excellence, empirical laboratory discovery, and transparent governance systems.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16 space-y-24">
        
        {/* 2. Institutional Statistics Grid Card Matrix */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-2 bg-slate-100 w-fit rounded-lg border border-slate-200">
                {stat.icon}
              </div>
              <div className="text-2xl font-bold tracking-tight text-slate-900 mt-4">{stat.value}</div>
              <div className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* 3. Core Strategy Framework (Mission / Vision) */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 text-slate-100 pointer-events-none">
              <Target className="w-24 h-24" />
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              <h3 className="text-lg font-bold text-slate-900 tracking-wide">Institutional Mission</h3>
            </div>
            <p className="mt-4 text-slate-600 text-sm leading-relaxed relative z-10">
              To cultivate rigorous analytical environments that accelerate core engineering capabilities. Through hand-on discovery and structural curriculum framework delivery, we empower engineers to solve modern industrial constraints.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 text-slate-100 pointer-events-none">
              <Eye className="w-24 h-24" />
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-indigo-600" />
              <h3 className="text-lg font-bold text-slate-900 tracking-wide">Future Vision</h3>
            </div>
            <p className="mt-4 text-slate-600 text-sm leading-relaxed relative z-10">
              To achieve continuous standing as a leading regional hub for practical engineering research and physical systems development, seamlessly connecting academic projects to real industry workflows.
            </p>
          </div>
        </div>

        {/* 4. Strategic Campus Policies Section */}
        <div className="space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">Standard Governance & Policies</h2>
            <p className="text-xs text-slate-500 mt-0.5">Operational guidelines uniformly enforced across student and administrative networks.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {policies.map((policy, index) => (
              <div key={index} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider px-2 py-0.5 bg-blue-50 border border-blue-100 rounded">
                    {policy.badge}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-2">{policy.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{policy.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Executive Administration - Refined Horizontal Grid Row Layout */}
        <div className="space-y-8">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">Institute Administration</h2>
            <p className="text-xs text-slate-500 mt-0.5">The senior leadership steering institutional operations and academic framework logs.</p>
          </div>
          
          <div className="grid gap-6">
            {admins.map((admin, index) => (
              <div key={index} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col md:flex-row group items-center">
                {/* Image Container with increased size, width, and uncropped aspect matching */}
                <div className="w-full md:w-56 h-56 md:h-44 bg-slate-100 border-b md:border-b-0 md:border-r border-slate-200 shrink-0">
                  <img 
                    src={admin.img} 
                    className="w-full h-full object-cover object-top group-hover:scale-101 transition-transform duration-300"
                    alt={admin.name}
                  />
                </div>
                
                {/* Admin Profile Data Grid Frame */}
                <div className="p-6 flex-grow w-full text-left">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg tracking-tight">{admin.name}</h4>
                      <p className="text-xs text-blue-700 font-semibold tracking-wide uppercase mt-0.5">{admin.role}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{admin.room}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="font-mono text-[11px]">{admin.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}