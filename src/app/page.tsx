import Image from "next/image";
import { ThemeToggle } from "@/components/app/theme-toggle";

export default function Home() {
  return (
    <div className="font-sans min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Header with theme toggle */}
      <header className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Maildrop Box
        </h1>
        <ThemeToggle />
      </header>
      
      <main className="max-w-4xl mx-auto py-12 px-6">
        <div className="text-center mb-12">
          <Image
            className="mx-auto mb-8 dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            🎨 Theme Toggle Demo
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            The theme toggle component is now active in the header. Click it to switch between:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
              <div className="text-2xl mb-2">☀️</div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Light Mode</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Bright and clean interface</p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
              <div className="text-2xl mb-2">🌙</div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Dark Mode</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Easy on the eyes</p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
              <div className="text-2xl mb-2">💻</div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">System</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Follows your OS preference</p>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
            Features
          </h3>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <li>✅ Smooth transitions and animations</li>
            <li>✅ Keyboard navigation support</li>
            <li>✅ Screen reader accessibility</li>
            <li>✅ SSR-safe hydration</li>
            <li>✅ Mobile-friendly design</li>
            <li>✅ Click outside to close</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
