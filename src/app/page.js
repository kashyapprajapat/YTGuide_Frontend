import Header from "@/components/Header";
import InfoComponent from "@/components/InfoComponent";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="min-h-screen grid grid-rows-[auto_1fr_auto] gap-4 md:gap-8 px-4 md:px-6 lg:px-8">
        <Header />
        
        <main className="flex items-center justify-center py-8 md:py-12">
          <InfoComponent />
        </main>
        
        <footer className="text-center text-gray-500 text-sm py-4 md:py-6 border-t border-white/20 bg-white/30 backdrop-blur-sm rounded-t-2xl">
          <p>© 2025 YTGuide. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}