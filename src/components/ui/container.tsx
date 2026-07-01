import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * Shared layout container for all pages.
 * max-width: 1280px (max-w-7xl)
 * Padding: 24px mobile → 32px tablet → 40px desktop
 *
 * Every section in every page should use this to guarantee
 * consistent content width across the entire application.
 */
export function Container({ children, className }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-7xl px-6 md:px-8 lg:px-10",
        className
      )}
    >
      {children}
    </div>
  );
}
