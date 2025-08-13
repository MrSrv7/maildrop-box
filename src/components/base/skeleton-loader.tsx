'use client'

import React from 'react'

/**
 * Skeleton variant types
 */
export type SkeletonVariant = 'default' | 'rounded' | 'circular'

/**
 * Skeleton animation types
 */
export type SkeletonAnimation = 'pulse' | 'wave' | 'none'

/**
 * Skeleton props interface
 */
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Width of the skeleton
   * Can be a string (e.g., '100px', '50%') or number (treated as pixels)
   */
  width?: string | number
  
  /**
   * Height of the skeleton
   * Can be a string (e.g., '20px', '2rem') or number (treated as pixels)
   */
  height?: string | number
  
  /**
   * Skeleton visual variant
   * @default 'default'
   */
  variant?: SkeletonVariant
  
  /**
   * Animation type
   * @default 'pulse'
   */
  animation?: SkeletonAnimation
  
  /**
   * Additional CSS classes
   */
  className?: string
  
  /**
   * Number of skeleton lines to render
   * @default 1
   */
  lines?: number
  
  /**
   * Spacing between lines when lines > 1
   * @default 'md'
   */
  spacing?: 'sm' | 'md' | 'lg'
  
  /**
   * Whether to randomize line widths for more natural look
   * @default false
   */
  randomize?: boolean
}

/**
 * Get variant-specific styles
 */
const getVariantStyles = (variant: SkeletonVariant): string => {
  const variants = {
    default: 'rounded',
    rounded: 'rounded-md',
    circular: 'rounded-full'
  }
  
  return variants[variant]
}

/**
 * Get animation-specific styles
 */
const getAnimationStyles = (animation: SkeletonAnimation): string => {
  const animations = {
    pulse: 'animate-pulse',
    wave: 'animate-pulse', // Could be enhanced with custom wave animation
    none: ''
  }
  
  return animations[animation]
}

/**
 * Get spacing styles between lines
 */
const getSpacingStyles = (spacing: 'sm' | 'md' | 'lg'): string => {
  const spacings = {
    sm: 'space-y-1',
    md: 'space-y-2',
    lg: 'space-y-3'
  }
  
  return spacings[spacing]
}

/**
 * Convert width/height to CSS value
 */
const toCSSValue = (value: string | number | undefined): string | undefined => {
  if (value === undefined) return undefined
  if (typeof value === 'number') return `${value}px`
  return value
}

/**
 * Generate random width for natural skeleton look
 */
const getRandomWidth = (index: number, total: number): string => {
  const baseWidths = ['75%', '60%', '90%', '45%', '85%', '70%', '55%', '80%']
  
  // For last line, often shorter
  if (index === total - 1) {
    const shortWidths = ['60%', '45%', '70%', '55%']
    return shortWidths[Math.floor(Math.random() * shortWidths.length)]
  }
  
  return baseWidths[index % baseWidths.length]
}

/**
 * Single skeleton line component
 */
const SkeletonLine: React.FC<{
  width?: string | number
  height?: string | number
  variant: SkeletonVariant
  animation: SkeletonAnimation
  className?: string
  style?: React.CSSProperties
}> = ({ width, height, variant, animation, className = '', style }) => {
  const lineClasses = [
    'bg-gray-200 dark:bg-gray-700',
    getVariantStyles(variant),
    getAnimationStyles(animation),
    className
  ].filter(Boolean).join(' ')

  const lineStyle: React.CSSProperties = {
    width: toCSSValue(width),
    height: toCSSValue(height),
    ...style
  }

  return <div className={lineClasses} style={lineStyle} />
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height = '1rem',
  variant = 'default',
  animation = 'pulse',
  className = '',
  lines = 1,
  spacing = 'md',
  randomize = false,
  style,
  ...props
}) => {
  // For single line, render directly
  if (lines === 1) {
    return (
      <SkeletonLine
        width={width}
        height={height}
        variant={variant}
        animation={animation}
        className={className}
        style={style}
      />
    )
  }

  // For multiple lines, render container with lines
  const containerClasses = [
    getSpacingStyles(spacing),
    className
  ].filter(Boolean).join(' ')

  return (
    <div className={containerClasses} style={style} {...props}>
      {Array.from({ length: lines }, (_, index) => (
        <SkeletonLine
          key={index}
          width={randomize ? getRandomWidth(index, lines) : width}
          height={height}
          variant={variant}
          animation={animation}
        />
      ))}
    </div>
  )
}

/**
 * Predefined skeleton components for common use cases
 */

/**
 * Text skeleton - for text content
 */
export const SkeletonText: React.FC<Omit<SkeletonProps, 'variant' | 'height'> & {
  size?: 'sm' | 'md' | 'lg'
}> = ({ size = 'md', ...props }) => {
  const heights = {
    sm: '0.75rem',
    md: '1rem',
    lg: '1.25rem'
  }
  
  return (
    <Skeleton
      variant="default"
      height={heights[size]}
      {...props}
    />
  )
}

/**
 * Avatar skeleton - for profile pictures
 */
export const SkeletonAvatar: React.FC<Omit<SkeletonProps, 'variant' | 'width' | 'height'> & {
  size?: 'sm' | 'md' | 'lg' | 'xl'
}> = ({ size = 'md', ...props }) => {
  const sizes = {
    sm: { width: '2rem', height: '2rem' },
    md: { width: '2.5rem', height: '2.5rem' },
    lg: { width: '3rem', height: '3rem' },
    xl: { width: '4rem', height: '4rem' }
  }
  
  const { width, height } = sizes[size]
  
  return (
    <Skeleton
      variant="circular"
      width={width}
      height={height}
      {...props}
    />
  )
}

/**
 * Card skeleton - for card-like content
 */
export const SkeletonCard: React.FC<Omit<SkeletonProps, 'lines' | 'randomize'> & {
  showAvatar?: boolean
  titleLines?: number
  contentLines?: number
}> = ({ 
  showAvatar = false, 
  titleLines = 1, 
  contentLines = 3,
  className = '',
  ...props 
}) => {
  return (
    <div className={`p-4 ${className}`} {...props}>
      <div className="flex items-start space-x-3">
        {showAvatar && <SkeletonAvatar size="md" />}
        <div className="flex-1 space-y-2">
          <SkeletonText 
            lines={titleLines}
            spacing="sm"
            size="lg"
            width="75%"
          />
          <SkeletonText 
            lines={contentLines}
            spacing="sm"
            size="sm"
            randomize
          />
        </div>
      </div>
    </div>
  )
}

/**
 * Export default for easier imports
 */
export default Skeleton