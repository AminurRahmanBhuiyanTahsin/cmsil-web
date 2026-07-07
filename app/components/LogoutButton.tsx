'use client';

import { useRouter } from 'next/navigation';
import { logout } from '@/app/actions/auth'; 

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();        // Runs the server action to clear cookies
    router.refresh();      // Tells Next.js to re-run middleware checks
    router.push('/login'); // Redirects to login
  };

  return (
    <button 
      onClick={handleLogout}
      className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-sm font-semibold hover:bg-slate-50 transition text-sm"
    >
      Logout
    </button>
  );
}