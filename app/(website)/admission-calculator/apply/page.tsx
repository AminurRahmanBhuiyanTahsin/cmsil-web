import { submitApplication } from "./actions";

export default function AdmissionApplicationPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-6">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-slate-900 p-8 text-center">
          <h2 className="text-xl font-bold text-white">Fall 2026 Admissions</h2>
          <p className="text-slate-400 text-sm mt-2">You are eligible! Please complete your application below.</p>
        </div>

        {/* Form Section */}
        <div className="p-8">
          <form action={submitApplication} className="space-y-6">
            
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Full Legal Name</label>
              <input 
                name="studentName" 
                type="text" 
                placeholder="e.g., Ahsan Habib" 
                className="w-full p-3 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:border-indigo-500 transition" 
                required 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email Address</label>
              <input 
                name="email" 
                type="email" 
                placeholder="ahsan@example.com" 
                className="w-full p-3 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:border-indigo-500 transition" 
                required 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Average GPA</label>
                <input 
                  name="gpa" 
                  type="number" 
                  step="0.01" 
                  min="4.50" 
                  max="5.00"
                  placeholder="e.g., 4.85" 
                  className="w-full p-3 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:border-indigo-500 transition" 
                  required 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Desired Department</label>
                <select 
                  name="department" 
                  className="w-full p-3 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:border-indigo-500 transition" 
                  required
                >
                  <option value="Computer Science">Computer Science (CSE)</option>
                  <option value="Civil Engineering">Civil Engineering (CE)</option>
                  <option value="Electrical Engineering">Electrical & Electronics (EEE)</option>
                  <option value="Mechanical Engineering">Mechanical Engineering (ME)</option>
                </select>
              </div>
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                className="w-full bg-indigo-600 text-white font-black p-4 rounded-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
              >
                Submit Application
              </button>
            </div>
            <p className="text-center text-xs text-slate-400 mt-4">
              By submitting this form, you agree to CMSIL's academic integrity policies.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}