"use client";

import { useState } from "react";
import { verifyLogin } from "./action"; 
import { useRouter } from "next/navigation"; 
import Navbar from "../components/Navbar";

type Role = "student" | "teacher" | "staff";

export default function LoginPage() {
  const router = useRouter();
  const [activeRole, setActiveRole] = useState<Role>("student");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const themeConfig = {
    student: { tab: "text-blue-600 border-blue-600", button: "bg-blue-600 hover:bg-blue-700", idLabel: "Student ID (Roll)", idPlaceholder: "e.g., CSE1212201" },
    teacher: { 
      tab: "text-orange-600 border-orange-600", 
      button: "bg-orange-600 hover:bg-orange-700", 
      idLabel: "Faculty ID", 
      idPlaceholder: "e.g., CMSIL-FC-101" 
    },
    staff: { tab: "text-slate-800 border-slate-800", button: "bg-slate-800 hover:bg-slate-900", idLabel: "Staff ID", idPlaceholder: "e.g., CMSIL-ST-101" },
  };

  const currentTheme = themeConfig[activeRole];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    const result = await verifyLogin(userId, password, activeRole);

    if (result.success && result.redirectUrl) {
      router.push(result.redirectUrl); 
    } else if (result.success) {
      router.push(`/${activeRole}`);
    } else {
      setErrorMsg(result.message);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar is now part of the page layout */}
      <Navbar />
      
      <div className="flex-grow flex flex-col items-center justify-center p-4">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">CMSIL<span className="text-blue-600">.EDU</span></h1>
        </div>

        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
          {/* Role Switcher Tabs */}
          <div className="flex border-b border-slate-200">
            {(["student", "teacher", "staff"] as Role[]).map((role) => (
              <button
                key={role}
                onClick={() => { setActiveRole(role); setErrorMsg(""); }}
                className={`flex-1 py-4 text-sm font-bold uppercase transition-all duration-300 border-b-2 ${
                  activeRole === role ? currentTheme.tab : "text-slate-400 border-transparent"
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          {/* Dynamic Form Area */}
          <div className="p-8 bg-white">
            <form className="space-y-6" onSubmit={handleLogin}>
              
              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-600 text-sm font-bold rounded-lg border border-red-100 text-center">
                  {errorMsg}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">{currentTheme.idLabel}</label>
                <input 
                  type="text" 
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder={currentTheme.idPlaceholder}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className={`w-full py-4 rounded-xl text-white font-bold uppercase transition-all shadow-lg ${currentTheme.button} ${isLoading ? "opacity-70" : ""}`}
              >
                {isLoading ? "Verifying..." : "Secure Login"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}