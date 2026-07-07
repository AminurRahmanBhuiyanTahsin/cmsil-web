import Link from 'next/link';

const Navbar = () => {
  // We define the links explicitly to prevent 404 errors on Vercel
  const navLinks = [
    { name: "About", href: "/about" },
    { name: "Faculty", href: "/faculty" },
    { name: "Notice", href: "/notice" },
    { name: "Admission", href: "/admission-calculator" }, // Explicitly linked
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md text-white shadow-2xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        
        {/* Logo and Name */}
        <Link href="/" className="flex items-center gap-4 group transition-all duration-500">
          <div className="relative">
            <img 
              src="/college_logo_no_background.webp" 
              alt="CMSIL Logo" 
              className="h-14 w-auto drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] group-hover:rotate-[360deg] transition-transform duration-1000" 
            />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-2xl tracking-tighter leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-400">
              CMSIL
            </span>
            <span className="text-[9px] uppercase tracking-[0.3em] text-blue-400 font-black">
              Engineering Institute
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-10 text-[12px] font-bold uppercase tracking-widest">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="relative py-2 transition-colors hover:text-blue-400 group"
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
          
          {/* Login Button */}
          <Link 
            href="/login" 
            className="bg-blue-600 hover:bg-blue-500 px-8 py-2.5 rounded-full text-[11px] font-black transition-all shadow-lg hover:shadow-blue-500/40 hover:-translate-y-0.5 active:scale-95"
          >
            LOGIN
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;