'use client'

import { ThemeToggle } from "@/components/app/theme-toggle";
import { Footer } from "@/components/app/footer";
import { Mail, Home, MailX, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center px-4 sm:px-6 py-4">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <span className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
            Maildrop Box
          </span>
        </Link>
        <ThemeToggle />
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-2xl mx-auto text-center">
          {/* Email icon, 404, and title in same row */}
          <div className="flex items-center justify-center gap-8 mb-8">
            {/* Email icon with error state */}
            <div className="relative">
              <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <MailX className="w-12 h-12 text-red-500 dark:text-red-400" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">!</span>
              </div>
            </div>

            {/* 404 Title */}
            <h1 className="text-6xl lg:text-8xl font-bold text-gray-900 dark:text-gray-100">
              404
            </h1>

            {/* Mail Unavailable */}
            <h2 className="text-2xl lg:text-3xl font-semibold text-gray-800 dark:text-gray-200">
              Mail Unavailable
            </h2>
          </div>

          {/* Witty email-themed message */}
          <div className="space-y-4 mb-8">
            <div className="backdrop-blur-md bg-white/10 dark:bg-white/5 rounded-lg border border-white/20 dark:border-white/10 p-8 text-left max-w-2xl mx-auto shadow-xl min-h-[302px]">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                  mailer-daemon@maildrop.cc
                </span>
              </div>
              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <p><strong>Subject:</strong> Delivery Status Notification (Failure)</p>
                <p><strong>To:</strong> lost-visitor@maildrop.cc</p>
                <hr className="border-gray-200 dark:border-gray-600" />
                <p className="mt-3">
                  The page you requested could not be delivered to its destination. 
                  It seems like this URL has wandered off into the digital void, 
                  much like emails in a spam folder.
                </p>
                <p className="text-red-600 dark:text-red-400 font-mono text-xs mt-2">
                  ERROR 404: Page not found in mailbox
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
