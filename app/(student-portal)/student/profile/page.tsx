"use client";

import { useEffect, useState } from "react";
import { getStudentProfile, updateProfileInfo, updatePassword } from "./actions";
import { User, Mail, Phone, MapPin, GraduationCap, Shield, Droplets, Save, CheckCircle, AlertCircle } from "lucide-react";

export default function StudentProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Form States
  const [infoForm, setInfoForm] = useState({ phone: "", presentAddress: "", bloodGroup: "" });
  const [passForm, setPassForm] = useState({ newPassword: "", confirmPassword: "" });
  
  // Status Messages
  const [infoStatus, setInfoStatus] = useState("");
  const [passStatus, setPassStatus] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      // 🚀 Completely dynamic: No ID passed! The server checks the secure cookie.
      const res = await getStudentProfile(); 
      
      if (res.success && res.data) {
        setProfile(res.data);
        setInfoForm({
          phone: res.data.phone || "",
          presentAddress: res.data.presentAddress || "",
          bloodGroup: res.data.bloodGroup || "",
        });
      } else {
        setError(res.message || "Failed to authenticate session.");
      }
      setLoading(false);
    }
    fetchProfile();
  }, []);

  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInfoStatus("Updating...");
    
    // 🚀 Dynamic update: No ID passed
    const res = await updateProfileInfo(infoForm);
    setInfoStatus(res.message);
    setTimeout(() => setInfoStatus(""), 3000); 
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) {
      setPassStatus("Passwords do not match!");
      return;
    }
    if (passForm.newPassword.length < 6) {
      setPassStatus("Password must be at least 6 characters.");
      return;
    }
    
    setPassStatus("Updating...");
    
    // 🚀 Dynamic update: No ID passed
    const res = await updatePassword(passForm.newPassword);
    setPassStatus(res.message);
    setPassForm({ newPassword: "", confirmPassword: "" }); 
    setTimeout(() => setPassStatus(""), 3000);
  };

  if (loading) {
    return <div className="p-8 text-slate-500 font-bold animate-pulse">Authenticating and Loading Profile...</div>;
  }

  if (error || !profile) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="bg-rose-50 border border-rose-200 p-8 rounded-2xl flex flex-col items-center justify-center text-center space-y-4">
          <AlertCircle size={48} className="text-rose-500" />
          <h2 className="text-2xl font-black text-rose-800">Session Error</h2>
          <p className="text-rose-600 font-medium">{error}</p>
          <p className="text-sm text-rose-500">Please log in again to establish a secure connection.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      
      {/* HEADER BANNER */}
      <section className="bg-slate-900 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden border border-slate-800 flex items-center gap-8">
        <div className="w-24 h-24 rounded-full bg-slate-800 border-4 border-blue-500 overflow-hidden shrink-0">
          <img 
            src={profile.imageUrl || `https://ui-avatars.com/api/?name=${profile.name}&background=0D8ABC&color=fff`} 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 space-y-1">
          <span className="inline-block bg-blue-500/20 text-blue-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            Student Profile
          </span>
          <h1 className="text-4xl font-black text-white">{profile.name}</h1>
          <p className="text-slate-400 font-medium text-lg flex items-center gap-2">
            <Mail size={18} /> {profile.email}
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Immutable Academic Data */}
        <div className="lg:col-span-1 space-y-8">
          <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-lg font-black text-slate-800 mb-6 uppercase tracking-tight flex items-center gap-2 border-b border-slate-100 pb-4">
              <GraduationCap className="text-blue-500" /> Academic Details
            </h2>
            <div className="space-y-5">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Department</p>
                <p className="font-bold text-slate-800">{profile.department}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Current Semester</p>
                <p className="font-bold text-slate-800">Semester {profile.currentSemester}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Institutional Roll</p>
                <p className="font-mono text-slate-700 bg-slate-50 p-2 rounded border border-slate-100 inline-block">{profile.institutionalRoll}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">CGPA</p>
                <p className="font-black text-3xl text-blue-600">{profile.cgpa}</p>
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Editable Forms */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* UPDATE PERSONAL INFO */}
          <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-lg font-black text-slate-800 mb-6 uppercase tracking-tight flex items-center gap-2 border-b border-slate-100 pb-4">
              <User className="text-blue-500" /> Personal Information
            </h2>
            
            <form onSubmit={handleInfoSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1"><Phone size={14}/> Phone Number</label>
                  <input 
                    type="text" 
                    value={infoForm.phone}
                    onChange={(e) => setInfoForm({...infoForm, phone: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1"><Droplets size={14}/> Blood Group</label>
                  <input 
                    type="text" 
                    value={infoForm.bloodGroup}
                    onChange={(e) => setInfoForm({...infoForm, bloodGroup: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1"><MapPin size={14}/> Present Address</label>
                  <textarea 
                    rows={2}
                    value={infoForm.presentAddress}
                    onChange={(e) => setInfoForm({...infoForm, presentAddress: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700 resize-none"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4">
                <span className={`text-sm font-bold ${infoStatus.includes('success') ? 'text-emerald-600' : 'text-blue-600'}`}>
                  {infoStatus}
                </span>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl transition-colors flex items-center gap-2">
                  <Save size={18} /> Save Changes
                </button>
              </div>
            </form>
          </section>

          {/* UPDATE PASSWORD */}
          <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-lg font-black text-slate-800 mb-6 uppercase tracking-tight flex items-center gap-2 border-b border-slate-100 pb-4">
              <Shield className="text-slate-500" /> Account Security
            </h2>
            
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">New Password</label>
                  <input 
                    type="password" 
                    placeholder="Enter new password"
                    value={passForm.newPassword}
                    onChange={(e) => setPassForm({...passForm, newPassword: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 font-medium text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Confirm Password</label>
                  <input 
                    type="password" 
                    placeholder="Confirm new password"
                    value={passForm.confirmPassword}
                    onChange={(e) => setPassForm({...passForm, confirmPassword: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 font-medium text-slate-700"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <span className={`text-sm font-bold ${passStatus.includes('success') ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {passStatus}
                </span>
                <button type="submit" className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-2.5 px-6 rounded-xl transition-colors flex items-center gap-2">
                  <Shield size={18} /> Update Password
                </button>
              </div>
            </form>
          </section>

        </div>
      </div>
    </div>
  );
}