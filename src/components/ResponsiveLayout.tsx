
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveLayoutProps {
  children: ReactNode;
  className?: string;
}

export const ResponsiveLayout = ({ children, className }: ResponsiveLayoutProps) => {
  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800",
      "px-2 sm:px-4 md:px-6 lg:px-8",
      "py-2 sm:py-4 md:py-6 lg:py-8",
      className
    )}>
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  );
};

export const ResponsiveGrid = ({ children, className }: ResponsiveLayoutProps) => {
  return (
    <div className={cn(
      "grid gap-3 sm:gap-4 md:gap-6",
      "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
      className
    )}>
      {children}
    </div>
  );
};

export const ResponsiveCard = ({ children, className }: ResponsiveLayoutProps) => {
  return (
    <div className={cn(
      "bg-slate-800/50 border-slate-700 rounded-lg border",
      "p-3 sm:p-4 md:p-6",
      "min-h-[120px] sm:min-h-[140px] md:min-h-[160px]",
      className
    )}>
      {children}
    </div>
  );
};
