import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** The one easing curve, for framer-motion (mirrors --ease-standard in globals.css). */
export const easeStandard = [0.2, 0, 0, 1] as const;
