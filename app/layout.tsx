// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CMSIL Institute | Engineering & Technology",
  description: "Official Portal - Bridging Academics with Practical Innovation",
  icons: { icon: "/college_logo_no_background.webp" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      {/* Added suppressHydrationWarning here to stop the Grammarly error! */}
      <body 
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
        suppressHydrationWarning
      >
        {children} 
      </body>
    </html>
  );
}