'use server';

import { cookies } from 'next/headers';

export async function logout() {
  const cookieStore = await cookies();
  
  // Delete whatever session cookie name you are using (e.g., 'session', 'token', etc.)
  cookieStore.delete('session'); 
  cookieStore.delete('token');
  
  return { success: true };
}