'use client'

import { useRouter } from "next/navigation";
import { Header } from "@/components/layout";
import { TypewriterSection } from "@/components/app/typewriter-section";
import { HeroSection, AboutSection } from "@/components/app/landing";

export default function Home() {
  const router = useRouter();

  /**
   * Handle successful email form submission by navigating to inbox
   * 
   * @param username - Username for the mailbox
   */
  const handleMailboxSubmit = (username: string) => {
    router.push(`/inbox/${username}`);
  };

  return (
    <div className="font-sans min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <Header variant="default" />
      
      {/* Hero Section with Email Form */}
      <HeroSection onSubmit={handleMailboxSubmit} />

      {/* Typewriter Section */}
      <TypewriterSection />

      {/* About and Features Section */}
      <AboutSection />
    </div>
  );
}
