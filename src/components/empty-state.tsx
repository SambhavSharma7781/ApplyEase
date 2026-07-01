import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionText,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-[#E4E4E7] bg-white/60 px-6 py-16 text-center sm:py-20">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100/80 text-[#4F46E5] shadow-sm">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-[#09090B]">{title}</h3>
      <p className="mb-6 max-w-sm text-sm leading-relaxed text-[#71717A]">
        {description}
      </p>
      {actionText && actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-2 rounded-[8px] bg-[#4F46E5] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-150 hover:bg-[#4338CA] active:scale-[0.97]"
        >
          {actionText}
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
