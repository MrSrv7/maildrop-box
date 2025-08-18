"use client";

import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  /**
   * Icon to display in the feature card
   */
  icon: LucideIcon;

  /**
   * Icon background color class
   */
  iconBgClass: string;

  /**
   * Icon color class
   */
  iconColorClass: string;

  /**
   * Feature title
   */
  title: string;

  /**
   * Feature description
   */
  description: string;
}

/**
 * A reusable feature card component for landing page
 */
export const FeatureCard = ({
  icon: Icon,
  iconBgClass,
  iconColorClass,
  title,
  description,
}: FeatureCardProps) => {
  return (
    <section className="text-center lg:text-left lg:flex lg:items-start lg:gap-4">
      <div className="flex items-center justify-center gap-3 mb-3 lg:mb-0">
        <div
          className={`flex-shrink-0 w-12 h-12 ${iconBgClass} rounded-lg flex items-center justify-center`}
        >
          <Icon className={`w-6 h-6 ${iconColorClass}`} />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 lg:hidden">
          {title}
        </h3>
      </div>
      <div className="lg:flex-1">
        <h3 className="hidden lg:block text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
      </div>
    </section>
  );
};

export default FeatureCard;
