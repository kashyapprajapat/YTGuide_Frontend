import Header from "@/components/Header";
import InfoComponent from "@/components/InfoComponent";
import YouTubeUrlComponent from "@/components/YouTubeUrlComponent";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="min-h-screen grid grid-rows-[auto_1fr_auto] gap-4 md:gap-8 px-4 md:px-6 lg:px-8">
        <Header />

        <main className="py-12 md:py-16 space-y-16 md:space-y-20">
          <div className="flex items-center justify-center">
            <InfoComponent />
          </div>

          <div className="flex items-center justify-center px-4">
            <div className="w-full max-w-5xl">
              <img
                src="https://res.cloudinary.com/dpf5bkafv/image/upload/v1753274907/ytguide_dzomxo.png"
                alt="YTGuide Platform Preview"
                className="w-full max-w-md h-auto mx-auto rounded-2xl shadow-2xl border border-white/30"
              />
            </div>
          </div>

          <div className="flex items-center justify-center">
            <YouTubeUrlComponent />
          </div>
        </main>

        <footer className="text-center text-gray-500 text-sm py-4 md:py-6 border-t border-white/20 bg-white/30 backdrop-blur-sm rounded-t-2xl">
          <p>© 2025 YTGuide. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
