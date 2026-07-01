import { cn } from "@/lib/utils";
import { initial } from "@/lib/format";

type LogoSize = "sm" | "md" | "lg" | "xl";

const SIZES: Record<LogoSize, string> = {
  sm: "h-8 w-8 rounded-[8px] text-xs",
  md: "h-10 w-10 rounded-[10px] text-sm",
  lg: "h-12 w-12 rounded-[10px] text-base",
  xl: "h-16 w-16 rounded-[12px] text-xl sm:h-20 sm:w-20",
};

interface CompanyLogoProps {
  name: string;
  size?: LogoSize;
  className?: string;
}

/**
 * Company logo placeholder — neutral monogram.
 *
 * White background, zinc border, dark initial character.
 * Intentionally plain: this is what a company looks like
 * before they upload a real logo. Consistent and premium.
 *
 * The companyColor palette in format.ts is preserved for
 * any other components that may use it.
 */
export default function CompanyLogo({
  name,
  size = "md",
  className,
}: CompanyLogoProps) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center font-semibold",
        "bg-white border border-[#E4E4E7] text-[#09090B]",
        SIZES[size],
        className
      )}
      style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.06)" }}
      aria-hidden
    >
      {initial(name)}
    </div>
  );
}
