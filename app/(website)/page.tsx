import Link from 'next/link';
import * as motion from 'framer-motion/m'; // Safe server imports for newer framer patterns

// 1. Go up 2 levels (out of website, out of app) to hit the root where components live
import Counter from '../components/Counter';
// 2. Go up 1 level (out of website) to hit app, then go right into (dashboard)
import { getHomepageMetrics } from '../(dashboard)/dashboard/students/actions';

export default async function Home() {
  // Query active metrics live from XAMPP MariaDB instance
  const metrics = await getHomepageMetrics();

  return (
    <main className="min-h-screen bg-white">
      
      {/* 1. HERO SECTION WITH SCROLL ZOOM */}
      <section className="relative h-[85vh] w-full flex items-center justify-center overflow-hidden bg-slate-950">
        <img 
          src="/college_front_gate.webp" 
          className="absolute inset-0 w-full h-full object-cover brightness-[0.35]"
          alt="CMSIL Campus"
        />
        
        <div className="absolute inset-0 opacity-[0.15]" 
             style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        <div className="relative z-10 text-center px-4">
          <span className="text-blue-400 font-bold tracking-[0.4em] uppercase text-xs mb-6 block">Official Institutional Portal</span>
          <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-8 leading-tight">
            Innovating for <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
              A Smarter Tomorrow
            </span>
          </h1>
          <div className="flex justify-center gap-6">
            <Link href="/admission-calculator" className="bg-blue-600 text-white px-10 py-4 rounded-sm font-bold hover:bg-blue-700 transition shadow-lg uppercase text-sm tracking-widest">
              Admission 2026
            </Link>
            <Link href="/about" className="backdrop-blur-md bg-white/10 border border-white/20 text-white px-10 py-4 rounded-sm font-bold hover:bg-white hover:text-slate-900 transition uppercase text-sm tracking-widest">
              Institutional Profile
            </Link>
          </div>
        </div>
      </section>

      {/* 2. REAL-TIME ACADEMIC METRICS FROM DATABASE */}
      <section className="max-w-7xl mx-auto py-24 px-6 grid grid-cols-1 md:grid-cols-3 gap-16 border-b border-slate-100">
        
        {/* Dynamic Registered Students Counter */}
        <div className="text-center group">
          <p className="text-6xl font-black text-slate-900 mb-2 group-hover:text-blue-600 transition tracking-tighter">
            <Counter end={metrics.totalStudents} suffix="+" />
          </p>
          <div className="h-1 w-12 bg-blue-600 mx-auto mb-4" />
          <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Enrolled Engineers</p>
        </div>

        {/* Dynamic Faculty Counter */}
        <div className="text-center group">
          <p className="text-6xl font-black text-slate-900 mb-2 group-hover:text-blue-600 transition tracking-tighter">
            <Counter end={metrics.totalFaculty} suffix="+" />
          </p>
          <div className="h-1 w-12 bg-blue-600 mx-auto mb-4" />
          <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Expert Faculty</p>
        </div>

        {/* Dynamic Unique Active Departments Counter */}
        <div className="text-center group">
          <p className="text-6xl font-black text-slate-900 mb-2 group-hover:text-blue-600 transition tracking-tighter">
            <Counter end={metrics.totalDepts} suffix=" Active" />
          </p>
          <div className="h-1 w-12 bg-blue-600 mx-auto mb-4" />
          <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Engineering Departments</p>
        </div>

      </section>

      {/* 3. LATEST NEWS WITH SMOOTH OVERLAY RENDERING */}
      <section className="max-w-7xl mx-auto py-24 px-6">
        <div className="mb-16">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Latest News</h2>
          <p className="text-blue-600 font-bold text-xs tracking-[0.2em] mt-2">CAMPUS ANNOUNCEMENTS</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { img: "/lab_class.webp", title: "New Robotics Simulation Center Open", cat: "LABORATORY" },
            { img: "/teacher_meeting.webp", title: "Annual Engineering Symposium 2026", cat: "ACADEMIC" },
            { img: "/student_doing_class.webp", title: "Smart Attendance System Implementation", cat: "CAMPUS" }
          ].map((news, i) => (
            <div key={i} className="group cursor-pointer">
              <div className="relative aspect-[16/10] overflow-hidden rounded-sm mb-6 bg-slate-100">
                <img 
                  src={news.img} 
                  className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105" 
                  alt={news.title}
                />
                <div className="absolute inset-0 bg-slate-900/10 opacity-100 transition-opacity duration-300 group-hover:opacity-0" />
                <div className="absolute top-0 left-0 bg-blue-700 text-white px-4 py-2 text-[10px] font-black tracking-widest">
                  {news.cat}
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-700 transition duration-300">
                {news.title}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* 4. PRINCIPAL LEADERSHIP & BIG SPEECH */}
      <section className="bg-slate-50 py-32 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-5 gap-20 items-center">
          <div className="md:col-span-2">
            <div className="relative">
              <div className="absolute -inset-4 border-2 border-blue-600/20 translate-x-8 translate-y-8" />
              <div className="relative rounded-sm overflow-hidden shadow-2xl">
                <img src="/principle_protrait_photo.webp" className="w-full h-full object-cover" alt="Principal" />
              </div>
            </div>
          </div>

          <div className="md:col-span-3 space-y-6 text-slate-700 text-lg italic">
            <h2 className="text-3xl font-black text-slate-900 uppercase mb-8 not-italic">Message from the Principal</h2>
            <p>
              "At CMSIL, we believe that engineering is more than just a degree; it is a profound responsibility 
              to shape the future. Our core philosophy, 'Mens et Manus' (Mind and Hand), is embedded 
              in everything we do."
            </p>
            <p className="border-l-4 border-blue-600 pl-6 bg-blue-50/50 py-2">
              "We have fully embraced Digitized Governance, replacing outdated manual registers with high-performance, 
              real-time management systems. This ensures the academic lifecycle is as efficient as the systems our engineers build."
            </p>
            <p>
              "As we move into 2026, we remain steadfast in our commitment to pioneering new technical horizons. 
              The future is waiting, and we are ready to build it."
            </p>
            <div className="mt-10 pt-10 border-t border-slate-200 not-italic">
              <p className="font-black text-slate-900 text-2xl tracking-tighter">Prof. Faisal Rahman</p>
              <p className="text-blue-600 font-bold text-xs uppercase tracking-[0.3em]">Principal, CMSIL Institute</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}