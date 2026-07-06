import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { updatePassword, updateProfile } from "./actions";

export default async function TeacherProfilePage() {
  const cookieStore = await cookies();
  const email = cookieStore.get("userEmail")?.value || "";

  if (!email) return <div className="p-8 text-rose-600 font-bold">Please log in.</div>;

  const [rows]: any = await db.execute("SELECT * FROM faculty WHERE email = ?", [email]);
  const teacher = rows[0];

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-6">
      
      {/* --- HEADER WITH PHOTO --- */}
      <div className="flex items-center gap-6 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <img 
          src={teacher.imageUrl} 
          alt={teacher.name} 
          className="w-24 h-24 rounded-full object-cover border-4 border-slate-100"
        />
        <div>
          <h1 className="text-3xl font-black text-slate-800">{teacher.name}</h1>
          <p className="text-indigo-600 font-bold">{teacher.designation}</p>
          <p className="text-slate-500 text-sm">{teacher.department}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* --- EDITABLE ACADEMIC INFO --- */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <h2 className="font-black text-slate-800 mb-6">Update Academic Details</h2>
          <form action={updateProfile as any} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500">Highest Degree</label>
                <input name="highestDegree" defaultValue={teacher.highestDegree} className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500">Alma Mater</label>
                <input name="almaMater" defaultValue={teacher.almaMater} className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500">Room Number & Building</label>
              <input name="roomNumber" defaultValue={teacher.roomNumber} className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500">Research Interests</label>
              <textarea name="researchInterest" defaultValue={teacher.researchInterest} className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 h-24" />
            </div>
            <button className="bg-indigo-600 text-white font-bold px-6 py-2 rounded-lg hover:bg-indigo-700 transition">Save Changes</button>
          </form>
        </div>

        {/* --- SECURITY SETTINGS --- */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <h2 className="font-black text-rose-600 mb-6">Security Settings</h2>
          <form action={updatePassword as any} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500">Current Password</label>
              <input type="password" name="currentPassword" className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50" required />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500">New Password</label>
              <input type="password" name="newPassword" className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50" required />
            </div>
            <button type="submit" className="bg-slate-900 text-white font-bold px-6 py-2 rounded-lg hover:bg-slate-800 transition">Update Password</button>
          </form>
        </div>

      </div>
    </div>
  );
}