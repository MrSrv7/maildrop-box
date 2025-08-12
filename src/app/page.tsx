'use client'

import { ThemeToggle } from "@/components/app/theme-toggle";
import { Footer } from "@/components/app/footer";
import { TypewriterSection } from "@/components/app/typewriter-section";
import { Mail, Clipboard, ArrowRight, Zap, Shield, Eye, Monitor } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (value: string) => {
    if (value && value.includes('@') && !value.endsWith("@maildrop.cc")) {
      setError("Please use a maildrop.cc address");
    } else {
      setError("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setEmail(text);
      validateEmail(text);
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  };

  const handleSubmit = () => {
    if (email && email.includes('@') && !email.endsWith("@maildrop.cc")) {
      setError("Please use a maildrop.cc address");
      return;
    }
    // Handle submit logic here
  };

  return (
    <div className="font-sans min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-2">
          <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <span className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Maildrop Box
          </span>
        </div>
        <ThemeToggle />
      </header>
      
      {/* Hero Section */}
      <main className="flex items-center justify-center px-6 py-8 pb-2">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-tight">
            Temporary Email,{" "}
            <span className="block">Permanently Simple.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Get free, disposable email addresses instantly. Maildrop Box offers a clean,
            modern interface for managing temporary inboxes without the hassle.
          </p>
          
          {/* Email Input Form */}
          <div className="max-w-lg mx-auto">
            <div className={`flex flex-col sm:flex-row gap-3 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg border transition-colors ${
              error 
                ? 'border-red-500 dark:border-red-400' 
                : 'border-gray-200 dark:border-gray-700'
            }`}>
              <input
                type="text"
                placeholder="Enter or paste email address..."
                value={email}
                onChange={handleInputChange}
                className="flex-1 px-4 py-3 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
              />
              <div className="flex gap-2">
                <button 
                  onClick={handlePaste}
                  className="p-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
                  title="Paste from clipboard"
                >
                  <Clipboard className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleSubmit}
                  className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
              Enter a username (e.g. &quot;example&quot;) or a full email address ending in @maildrop.cc
            </p>
            
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-2 font-medium">
                {error}
              </p>
            )}
          </div>
        </div>
      </main>

      {/* Typewriter Section */}
      <TypewriterSection />

      {/* About This Project Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - About */}
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4 uppercase tracking-wide">
                About This Project
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                Built for the Modern Web
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Maildrop Box is an unofficial, open-source alternative interface for Maildrop.cc, 
                built with Next.js, TypeScript, and Tailwind CSS. The goal is to provide a modern, 
                accessible, and user-friendly experience for temporary email management.
              </p>
            </div>

            {/* Right Column - Features */}
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Fast & Responsive
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Instant loading times and smooth interactions, even on slow networks.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Reliable & Stable
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Built with TypeScript for a robust and error-free experience.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <Eye className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Accessible Design
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Keyboard navigation and screen reader support for everyone.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                  <Monitor className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Clean Interface
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    A simple, intuitive, and distraction-free design.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
