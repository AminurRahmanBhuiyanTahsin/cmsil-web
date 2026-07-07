import { db } from "@/lib/db";
import { postNotice } from "./actions";

export default async function TeacherNoticesPage() {
  // Fetch only PRIVATE notices
  const [notices]: any = await db.execute(
    "SELECT * FROM notice WHERE scope = 'PRIVATE' ORDER BY createdAt DESC"
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-black text-slate-800">Private Notice Board</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* SECTION 1: POST NOTICE FORM */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
          <h2 className="font-black text-slate-800 mb-4">Post New Notice</h2>
          <form action={postNotice as any} className="space-y-4">
            <input name="title" placeholder="Notice Title" className="w-full p-2 border rounded-lg" required />
            <textarea name="content" placeholder="Notice Content..." className="w-full p-2 border rounded-lg h-32" required />
            <select name="category" className="w-full p-2 border rounded-lg">
              <option value="ACADEMIC">Academic</option>
              <option value="EXAM">Exam</option>
              <option value="GENERAL">General</option>
            </select>
            <button className="w-full bg-slate-900 text-white font-bold p-3 rounded-lg hover:bg-slate-800 transition">
              Publish Notice
            </button>
          </form>
        </div>

        {/* SECTION 2: VIEW NOTICES */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-black text-slate-800">Recent Notices</h2>
          {notices.map((notice: any) => (
            <div key={notice.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-black text-lg text-slate-800">{notice.title}</h3>
                <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full uppercase">
                  {notice.category}
                </span>
              </div>
              <p className="text-slate-600 text-sm mb-4">{notice.content}</p>
              <div className="text-xs text-slate-400 font-bold flex justify-between">
                <span>By: {notice.postedBy}</span>
                <span>{new Date(notice.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
          {notices.length === 0 && (
            <div className="text-center p-12 text-slate-400 font-bold">No private notices found.</div>
          )}
        </div>
      </div>
    </div>
  );
}