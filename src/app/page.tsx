'use client'

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/app/footer";
import { TypewriterSection } from "@/components/app/typewriter-section";
import { Button } from "@/components/base/button";
import { Input } from "@/components/base/input";
import { Clipboard, ArrowRight, Zap, Shield, Eye, Monitor } from "lucide-react";
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
    
    if (email) {
      // Extract username from email or use as-is if it's just a username
      const username = email.includes('@') ? email.split('@')[0] : email;
      window.location.href = `/inbox/${username}`;
    }
  };

  return (
    <div className="font-sans min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <Header variant="default" />
      
      {/* Hero Section */}
      <main className="flex items-center justify-center px-4 sm:px-6 py-8 pb-2">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6 leading-tight px-2">
            Temporary Email,{" "}
            <span className="block">Permanently Simple.</span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed px-2">
            Get free, disposable email addresses instantly. Maildrop Box offers a clean,
            modern interface for managing temporary inboxes without the hassle.
          </p>
          
          {/* Email Input Form */}
          <div className="max-w-lg mx-auto px-4">
            {/* Desktop Layout */}
            <div className="hidden sm:block">
              <div className="flex gap-3">
                <Input
                  type="text"
                  placeholder="Enter or paste email address..."
                  value={email}
                  onChange={handleInputChange}
                  variant={error ? 'error' : 'default'}
                  error={error}
                  fullWidth
                  className="flex-1"
                />
                <Button 
                  onClick={handlePaste}
                  variant="ghost"
                  icon={Clipboard}
                  size="icon"
                  title="Paste from clipboard"
                />
                <Button 
                  onClick={handleSubmit}
                  variant="primary"
                  icon={ArrowRight}
                  size="icon"
                />
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="sm:hidden space-y-3">
              <Input
                type="text"
                placeholder="Enter or paste email address..."
                value={email}
                onChange={handleInputChange}
                variant={error ? 'error' : 'default'}
                error={error}
                fullWidth
              />
              <div className="flex gap-2 justify-center">
                <Button 
                  onClick={handlePaste}
                  variant="outline"
                  icon={Clipboard}
                  size="icon"
                  title="Paste from clipboard"
                />
                <Button 
                  onClick={handleSubmit}
                  variant="primary"
                  icon={ArrowRight}
                  size="icon"
                />
              </div>
            </div>
            
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 px-2">
              Enter a username (e.g. &quot;example&quot;) or a full email address ending in @maildrop.cc
            </p>
          </div>
        </div>
      </main>

      {/* Typewriter Section */}
      <TypewriterSection />

      {/* About This Project Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            {/* Left Column - About */}
            <div className="text-center lg:text-left">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4 uppercase tracking-wide">
                About This Project
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                Built for the Modern Web
              </h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Maildrop Box is an unofficial, open-source alternative interface for Maildrop.cc, 
                built with Next.js, TypeScript, and Tailwind CSS. The goal is to provide a modern, 
                accessible, and user-friendly experience for temporary email management.
              </p>
            </div>

            {/* Right Column - Features */}
            <div className="space-y-6 sm:space-y-8">
              <div className="text-center lg:text-left lg:flex lg:items-start lg:gap-4">
                <div className="flex items-center justify-center gap-3 mb-3 lg:mb-0">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 lg:hidden">
                    Fast & Responsive
                  </h3>
                </div>
                <div className="lg:flex-1">
                  <h3 className="hidden lg:block text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Fast & Responsive
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Instant loading times and smooth interactions, even on slow networks.
                  </p>
                </div>
              </div>

              <div className="text-center lg:text-left lg:flex lg:items-start lg:gap-4">
                <div className="flex items-center justify-center gap-3 mb-3 lg:mb-0">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 lg:hidden">
                    Reliable & Stable
                  </h3>
                </div>
                <div className="lg:flex-1">
                  <h3 className="hidden lg:block text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Reliable & Stable
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Built with TypeScript for a robust and error-free experience.
                  </p>
                </div>
              </div>

              <div className="text-center lg:text-left lg:flex lg:items-start lg:gap-4">
                <div className="flex items-center justify-center gap-3 mb-3 lg:mb-0">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <Eye className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 lg:hidden">
                    Accessible Design
                  </h3>
                </div>
                <div className="lg:flex-1">
                  <h3 className="hidden lg:block text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Accessible Design
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Keyboard navigation and screen reader support for everyone.
                  </p>
                </div>
              </div>

              <div className="text-center lg:text-left lg:flex lg:items-start lg:gap-4">
                <div className="flex items-center justify-center gap-3 mb-3 lg:mb-0">
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                    <Monitor className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 lg:hidden">
                    Clean Interface
                  </h3>
                </div>
                <div className="lg:flex-1">
                  <h3 className="hidden lg:block text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
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
