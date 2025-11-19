/**
 * @file Shared Framer Motion animation variants
 * @story US-001 - PII Anonymization Before Landlord Review
 *
 * Provides reusable animation variants for consistent micro-animations
 * across the application, particularly for PII reveal and profile interactions.
 */

import type { Variants } from 'framer-motion'

/**
 * Basic fade in/out animation
 */
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

/**
 * Slide up with fade in animation
 */
export const slideUpFadeIn: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

/**
 * Scale in animation (used for badges and buttons)
 */
export const scaleIn: Variants = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.9, opacity: 0 },
}

/**
 * Blur fade in animation (used for PII reveal)
 */
export const blurFadeIn: Variants = {
  initial: { opacity: 0, filter: 'blur(8px)' },
  animate: { opacity: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, filter: 'blur(8px)' },
}

/**
 * Stagger container for sequential reveals
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

/**
 * Stagger item for children of stagger container
 */
export const staggerItem: Variants = {
  hidden: { opacity: 0, filter: 'blur(8px)', y: 10 },
  visible: { opacity: 1, filter: 'blur(0px)', y: 0 },
}

/**
 * Dialog entrance/exit animations
 */
export const dialogVariants: Variants = {
  initial: { scale: 0.9, opacity: 0, y: 20 },
  animate: { scale: 1, opacity: 1, y: 0 },
  exit: { scale: 0.95, opacity: 0, y: 10 },
}

/**
 * Dialog overlay backdrop
 */
export const dialogOverlay: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

/**
 * Slide in from top animation (used for notifications)
 */
export const slideFromTop: Variants = {
  initial: { y: -100, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -100, opacity: 0 },
}

/**
 * Slide out to right animation (used for dismissing notifications)
 */
export const slideToRight: Variants = {
  initial: { x: 0, opacity: 1 },
  animate: { x: 0, opacity: 1 },
  exit: { opacity: 0, x: 300 },
}

/**
 * Spring transition config for smooth, natural motion
 */
export const springTransition = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 25,
}

/**
 * Spring transition for bouncy effects (badges, buttons)
 */
export const bouncySpring = {
  type: 'spring' as const,
  stiffness: 200,
  damping: 15,
}

/**
 * Smooth ease-out transition
 */
export const smoothTransition = {
  duration: 0.6,
  ease: 'easeOut' as const,
}

/**
 * Quick ease-in transition (for exits)
 */
export const quickEaseIn = {
  duration: 0.3,
  ease: 'easeIn' as const,
}
