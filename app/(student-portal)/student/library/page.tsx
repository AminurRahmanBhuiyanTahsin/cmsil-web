"use client";

import { useEffect, useState } from "react";
import { getLibraryData } from "./actions";
import { BookMarked, Library, Clock, AlertCircle, MapPin, BookOpen, Search } from "lucide-react";

export default function StudentLibraryPage() {
  const [borrowedBooks, setBorrowedBooks] = useState<any[]>([]);
  const [catalog, setCatalog] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // NEW: Search state
  const [searchQuery, setSearchQuery] = useState("");

  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function fetchData() {
      const res = await getLibraryData();
      if (res.success) {
        setBorrowedBooks(res.borrowed || []);
        setCatalog(res.catalog || []);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const getCountdown = (dueDateString: string) => {
    const due = new Date(dueDateString);
    const diffMs = due.getTime() - now.getTime();
    
    if (diffMs < 0) return { text: "OVERDUE", color: "text-rose-600 bg-rose-100 border-rose-200", isOverdue: true };

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
    
    if (days > 0) return { text: `${days}d ${hours}h remaining`, color: "text-amber-700 bg-amber-100 border-amber-200", isOverdue: false };
    return { text: `${hours}h remaining!`, color: "text-rose-600 bg-rose-100 border-rose-200 animate-pulse", isOverdue: false };
  };

  // NEW: Filter the catalog based on the search query
  const filteredCatalog = catalog.filter((book) => {
    const query = searchQuery.toLowerCase();
    return (
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.isbn.includes(query)
    );
  });

  if (loading) {
    return <div className="p-8 text-slate-500 font-bold animate-pulse">Loading Library Data...</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      
      {/* HEADER BANNER */}
      <section className="bg-slate-900 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden border border-slate-800">
        <div className="relative z-10 space-y-2">
          <span className="inline-block bg-purple-500/20 text-purple-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-purple-500/30">
            Digital Library
          </span>
          <h1 className="text-4xl font-black text-white flex items-center gap-3">
            <Library size={36} className="text-purple-500" />
            Resource Center
          </h1>
          <p className="text-slate-400 font-medium text-lg">Manage your borrowed books and explore the catalog.</p>
        </div>
      </section>

      {/* MY BORROWED BOOKS SECTION */}
      <section>
        <h2 className="text-xl font-black text-slate-800 mb-6 uppercase tracking-tight flex items-center gap-2">
          <BookMarked className="text-purple-600" /> My Active Loans
        </h2>
        
        {borrowedBooks.length === 0 ? (
          <div className="text-center p-10 bg-white rounded-2xl border border-dashed border-slate-300">
            <p className="text-slate-500 font-bold">You currently have no borrowed books.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {borrowedBooks.map((book: any, i: number) => {
              const timerInfo = getCountdown(book.dueDate);
              
              return (
                <div key={i} className={`p-6 rounded-2xl border bg-white shadow-sm flex flex-col sm:flex-row gap-6 ${timerInfo.isOverdue ? 'border-rose-300' : 'border-slate-200'}`}>
                  <div className="grow space-y-2">
                    <h3 className="font-black text-slate-800 text-lg leading-tight">{book.title}</h3>
                    <p className="text-sm font-semibold text-slate-500">{book.author}</p>
                    <p className="text-xs text-slate-400 font-mono mt-2">ISBN: {book.isbn}</p>
                  </div>
                  
                  <div className="shrink-0 flex flex-col justify-center sm:items-end border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-6">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Time Left</p>
                    <div className={`px-3 py-1.5 rounded-lg border font-black text-sm flex items-center gap-2 ${timerInfo.color}`}>
                      {timerInfo.isOverdue ? <AlertCircle size={16} /> : <Clock size={16} />}
                      {timerInfo.text}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* AVAILABLE CATALOG SECTION */}
      <section>
        {/* NEW: Flex container for Header + Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-slate-200 pb-4">
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-2 shrink-0">
            <BookOpen className="text-slate-500" /> Available Catalog
          </h2>
          
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search by title, author, or ISBN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm transition-shadow"
            />
          </div>
        </div>
        
        {/* NEW: Map over filteredCatalog instead of catalog */}
        {filteredCatalog.length === 0 ? (
          <div className="text-center p-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            <p className="text-slate-500 font-bold">No books found matching "{searchQuery}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCatalog.map((book: any, i: number) => (
              <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-purple-300 transition-all group">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
                    {book.stockQuantity} Available
                  </span>
                  <span className="flex items-center text-xs font-bold text-slate-400 gap-1 bg-slate-100 px-2 py-1 rounded">
                    <MapPin size={12}/> {book.location}
                  </span>
                </div>
                <h4 className="font-bold text-slate-800 leading-tight mb-1 group-hover:text-purple-700 transition-colors">
                  {book.title}
                </h4>
                <p className="text-sm text-slate-500 mb-3">{book.author}</p>
                <p className="text-[10px] text-slate-400 font-mono tracking-widest">ISBN: {book.isbn}</p>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}