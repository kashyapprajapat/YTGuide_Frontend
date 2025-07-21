import { Button } from "@/components/ui/button"
import Header from "@/components/Header";

export default function Home() {
  return (
<div className="min-h-screen grid grid-rows-[auto_1fr_auto] gap-8">
 <Header></Header>

  <main className="w-full px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
    <Button>Comming Soon</Button>
  </main>

  <footer className="text-center text-gray-500 text-sm py-4">
    © 2025 YTGuide. All rights reserved.
  </footer>
</div>

  );
}
