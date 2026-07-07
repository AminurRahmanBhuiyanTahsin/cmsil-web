import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. TOP NAVIGATION BAR */}
      <Navbar />

      {/* 2. MAIN PAGE CONTENT */}
      <main className="flex-grow">
        {children}
      </main>

      {/* 3. BOTTOM FOOTER */}
      <Footer />
    </div>
  );
}