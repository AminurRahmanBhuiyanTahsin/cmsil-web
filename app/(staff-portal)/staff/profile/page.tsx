import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { updateStaffProfile } from "./actions";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const userEmail = cookieStore.get("userEmail")?.value;

  const [rows] = await (db as any).execute(
    "SELECT * FROM staff WHERE email = ?", 
    [userEmail || ""]
  );
  const staff = rows[0];

  return (
    <div className="max-w-4xl space-y-8">
      <h1 className="text-2xl font-black text-slate-800">My Profile</h1>
      
      {/* 1. Display Grid */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
         <img src={staff.imageUrl} className="w-48 h-48 rounded-2xl object-cover border-4 border-slate-100 shadow-lg" />
         <div className="space-y-4">
            <h2 className="text-3xl font-black text-slate-900">{staff.name}</h2>
            <p className="text-indigo-600 font-bold text-lg">{staff.designation}</p>
            <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50 p-4 rounded-xl">
               <div>
                 <p className="text-slate-400 font-bold uppercase text-[10px]">Phone</p>
                 <p className="font-semibold text-slate-800">{staff.phone}</p>
               </div>
               <div>
                 <p className="text-slate-400 font-bold uppercase text-[10px]">Salary</p>
                 <p className="font-semibold text-slate-800">${staff.salary}</p>
               </div>
               <div>
                 <p className="text-slate-400 font-bold uppercase text-[10px]">Joined</p>
                 <p className="font-semibold text-slate-800">
  {new Date(staff.joiningDate).toLocaleDateString()}
</p>
               </div>
               <div>
                 <p className="text-slate-400 font-bold uppercase text-[10px]">Status</p>
                 <p className="font-semibold text-emerald-600">{staff.status}</p>
               </div>
            </div>
         </div>
      </div>

      {/* 2. Edit Form */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-6 uppercase text-sm tracking-widest">Update Contact Information</h3>
        <form action={updateStaffProfile} className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <input type="hidden" name="id" value={staff.id} />
           <div>
             <label className="block text-xs font-bold text-slate-500 mb-1">Phone Number</label>
             <input name="phone" defaultValue={staff.phone} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
           </div>
           <div>
             <label className="block text-xs font-bold text-slate-500 mb-1">Profile Photo URL</label>
             <input name="imageUrl" defaultValue={staff.imageUrl} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
           </div>
           <button className="bg-slate-900 text-white font-bold py-3 px-6 rounded-lg hover:bg-slate-700 transition w-full md:w-auto">
             Save Changes
           </button>
        </form>
      </div>
    </div>
  );
}