"use client";

import React, { useState, useEffect } from 'react';
import { Megaphone, Lock, Eye, Calendar, User, Tag, Loader2 } from 'lucide-react';

interface Notice {
  id: number;
  title: string;
  content: string;
  category: string;
  scope: 'PUBLIC' | 'PRIVATE';
  postedBy: string;
  createdAt: string;
}

export default function NoticePage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'PUBLIC' | 'PRIVATE'>('ALL');
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch directly from our API route connected to lib/db.ts
  useEffect(() => {
    async function fetchNotices() {
      try {
        const response = await fetch('/api/notices');
        if (response.ok) {
          const data = await response.json();
          setNotices(data);
        }
      } catch (error) {
        console.error('Data connection failed:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchNotices();
  }, []);

  const filteredNotices = notices.filter(notice => {
    if (filter === 'ALL') return true;
    return notice.scope === filter;
  });

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen font-sans antialiased">
      
      {/* 1. Header Frame */}
      <div className="bg-white border-b border-slate-200 py-12">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-blue-700 font-semibold text-xs uppercase tracking-wider">
              <Megaphone className="w-4 h-4" />
              <span>Bulletin Coordination Desk</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-950 tracking-tight mt-2">
              Institutional Notice Board
            </h1>
          </div>

          {/* Scope Toggle Filter */}
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200/60 self-start md:self-auto">
            {(['ALL', 'PUBLIC', 'PRIVATE'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  filter === type
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {type === 'ALL' ? 'All Bulletins' : type === 'PUBLIC' ? 'Public' : 'Internal (Private)'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Content Stack Frame */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-xs font-medium tracking-wide">Querying live database indexes...</p>
          </div>
        ) : filteredNotices.length > 0 ? (
          <div className="space-y-4">
            {filteredNotices.map((notice) => (
              <div 
                key={notice.id} 
                className={`border rounded-xl p-6 shadow-sm transition-all text-left ${
                  notice.scope === 'PRIVATE'
                    ? 'bg-gradient-to-r from-amber-50/40 to-white border-amber-200/80 hover:border-amber-300 shadow-amber-50/10'
                    : 'bg-white border-slate-200 hover:border-blue-200 hover:shadow-md'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded tracking-wide uppercase ${
                      notice.category === 'EXAM' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                      notice.category === 'REGISTRATION' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                      'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {notice.category}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base md:text-lg tracking-tight">
                      {notice.title}
                    </h3>
                  </div>

                  {/* Privacy Flag Badge with matching theme color fills */}
                  <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    notice.scope === 'PUBLIC' 
                      ? 'bg-blue-50 text-blue-700 border border-blue-100' 
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}>
                    {notice.scope === 'PUBLIC' ? <Eye className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                    {notice.scope}
                  </span>
                </div>

                <p className="mt-4 text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                  {notice.content}
                </p>

                {/* Footer Metadata Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{notice.postedBy}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Posted: {new Date(notice.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:justify-end text-blue-700 font-medium">
                    <Tag className="w-3.5 h-3.5 text-blue-400" />
                    <span>CMSIL Authority Verified</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
            <p className="text-sm text-slate-500">No active bulletins match the selected filter profile.</p>
          </div>
        )}
      </div>
    </div>
  );
}