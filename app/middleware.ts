import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const role = request.cookies.get("staffRole")?.value;
  const path = request.nextUrl.pathname;

  // Protect staff routes
  if (path.startsWith('/staff')) {
    if (!role) return NextResponse.redirect(new URL('/login', request.url));

    // Admin can see everything
    // Both Business Admin and Technical Admin get full access
if (role === 'ADMINISTRATION' || role === 'IT_SUPPORT') return NextResponse.next();

    // Specific restrictions
    if (path.includes('/finance') && role !== 'ACCOUNTS') return NextResponse.redirect(new URL('/staff', request.url));
    if (path.includes('/library') && role !== 'LIBRARY') return NextResponse.redirect(new URL('/staff', request.url));
    if (path.includes('/it-desk') && role !== 'IT_SUPPORT') return NextResponse.redirect(new URL('/staff', request.url));
  }
  
  return NextResponse.next();
}