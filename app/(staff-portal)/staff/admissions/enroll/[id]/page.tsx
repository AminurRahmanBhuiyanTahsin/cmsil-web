import { db } from "@/lib/db";
import { enrollStudent } from "../../actions";
import Link from "next/link";

export default async function EnrollStudentPage({ params }: { params: { id: string } }) {
  // Extract the application ID from the URL
  const { id } = await params;
  
  // Fetch the specific application to pre-fill the form
  const [rows] = await db.execute("SELECT * FROM admission_applications WHERE id = ?", [id]);
  const app = (rows as any[])[0];

  if (!app) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold text-slate-800">Application not found.</h2>
        <Link href="/staff/admissions" className="text-indigo-600 hover:underline">Go Back</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black text-slate-800">Enroll New Student</h1>
        <Link href="/staff/admissions" className="text-sm font-bold text-slate-500 hover:text-slate-800">
          &larr; Back to Admissions
        </Link>
      </div>

      <form action={enrollStudent} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <input type="hidden" name="applicationId" value={app.id} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pre-filled from the initial application */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Student Name</label>
            <input type="text" name="name" defaultValue={app.studentName} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg" required />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
            <input type="email" name="email" defaultValue={app.email} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg" required />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Department</label>
            {/* Must match the ENUM in your database ('CSE', 'EEE', 'CE', 'ME') */}
            <select name="department" defaultValue={app.department} className="w-full p-3 border border-slate-200 rounded-lg" required>
              <option value="CSE">Computer Science (CSE)</option>
              <option value="EEE">Electrical (EEE)</option>
              <option value="CE">Civil Engineering (CE)</option>
              <option value="ME">Mechanical (ME)</option>
            </select>
          </div>

          {/* New fields required for enrolledstudent table */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Institutional Roll</label>
            <input type="text" name="institutionalRoll" placeholder="e.g. CSE1212201" className="w-full p-3 border border-slate-200 rounded-lg" required />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Class Roll</label>
            <input type="number" name="classRoll" placeholder="e.g. 1" className="w-full p-3 border border-slate-200 rounded-lg" required />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
            <input type="tel" name="phone" placeholder="+880..." className="w-full p-3 border border-slate-200 rounded-lg" required />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Blood Group</label>
            <select name="bloodGroup" className="w-full p-3 border border-slate-200 rounded-lg" required>
              <option value="">Select...</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Batch ID</label>
            <input type="number" name="batchId" placeholder="e.g. 21" className="w-full p-3 border border-slate-200 rounded-lg" required />
          </div>

          {/* Address Fields */}
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-slate-700 mb-2">Present Address</label>
            <input type="text" name="presentAddress" placeholder="e.g. Dhanmondi, Dhaka" className="w-full p-3 border border-slate-200 rounded-lg" required />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-slate-700 mb-2">Permanent Address</label>
            <input type="text" name="permanentAddress" className="w-full p-3 border border-slate-200 rounded-lg" required />
          </div>

          {/* Password Assignment Module */}
          <div className="md:col-span-2 pt-4 border-t border-slate-200">
            <label className="block text-sm font-bold text-slate-700 mb-2">Initial Student Password</label>
            <input type="text" name="password" placeholder="Provide a secure initial password..." className="w-full p-3 border border-indigo-200 rounded-lg bg-indigo-50 text-indigo-900 font-mono" required />
            <p className="text-xs text-slate-500 mt-2">This password will be securely hashed in the database. Provide this to the student so they can log in and change it later.</p>
          </div>
        </div>

        <div className="pt-6 flex justify-end">
          <button type="submit" className="px-8 py-3 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">
            Complete Enrollment
          </button>
        </div>
      </form>
    </div>
  );
}