/**
 * This utility function is needed for the shadcn components
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ")
}
