"use client";

import { Zap, Shield, Eye, Monitor } from "lucide-react";
import { FeatureCard } from "./feature-card";

/**
 * Feature data for the landing page
 */
const FEATURES = [
  {
    icon: Zap,
    iconBgClass: "bg-blue-100 dark:bg-blue-900/30",
    iconColorClass: "text-blue-600 dark:text-blue-400",
    title: "Fast & Responsive",
    description:
      "Instant loading times and smooth interactions, even on slow networks.",
  },
  {
    icon: Shield,
    iconBgClass: "bg-green-100 dark:bg-green-900/30",
    iconColorClass: "text-green-600 dark:text-green-400",
    title: "Reliable & Stable",
    description:
      "Built with TypeScript for a robust and error-free experience.",
  },
  {
    icon: Eye,
    iconBgClass: "bg-purple-100 dark:bg-purple-900/30",
    iconColorClass: "text-purple-600 dark:text-purple-400",
    title: "Accessible Design",
    description: "Keyboard navigation and screen reader support for everyone.",
  },
  {
    icon: Monitor,
    iconBgClass: "bg-orange-100 dark:bg-orange-900/30",
    iconColorClass: "text-orange-600 dark:text-orange-400",
    title: "Clean Interface",
    description: "A simple, intuitive, and distraction-free design.",
  },
];

/**
 * Features grid component for the landing page
 */
export const FeaturesGrid = () => {
  return (
    <section className="space-y-6 sm:space-y-8">
      {FEATURES.map((feature, index) => (
        <FeatureCard
          key={`feature-${index}`}
          icon={feature.icon}
          iconBgClass={feature.iconBgClass}
          iconColorClass={feature.iconColorClass}
          title={feature.title}
          description={feature.description}
        />
      ))}
    </section>
  );
};

export default FeaturesGrid;
