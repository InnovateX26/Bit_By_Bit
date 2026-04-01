import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Merge Tailwind + conditional classes safely
export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs))
}
