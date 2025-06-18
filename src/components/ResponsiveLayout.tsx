
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveLayoutProps {
  children: ReactNode;
  className?: string;
}

export const ResponsiveLayout = ({ children, className }: ResponsiveLayoutProps) => {
  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900",
      "px-2 sm:px-4 md:px-6 lg:px-8",
      "py-2 sm:py-4 md:py-6 lg:py-8",
      "relative overflow-x-hidden",
      "w-full max-w-full",
      className
    )}>
      {/* Background effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDEwMCwxMTYsMTM5LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
      
      <div className="relative z-10 max-w-full mx-auto w-full">
        <div className="w-full overflow-x-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export const ResponsiveGrid = ({ children, className }: ResponsiveLayoutProps) => {
  return (
    <div className={cn(
      "grid gap-2 sm:gap-4 md:gap-6",
      "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
      "auto-rows-fr w-full",
      "overflow-x-auto",
      className
    )}>
      {children}
    </div>
  );
};

export const ResponsiveCard = ({ children, className }: ResponsiveLayoutProps) => {
  return (
    <div className={cn(
      "bg-slate-800/60 backdrop-blur-sm border border-slate-700/50",
      "rounded-lg md:rounded-xl shadow-xl shadow-black/10",
      "p-3 sm:p-4 md:p-6",
      "min-h-[120px] sm:min-h-[140px] md:min-h-[160px]",
      "transition-all duration-300 hover:bg-slate-800/80 hover:border-slate-600/50",
      "hover:shadow-2xl hover:shadow-blue-500/5",
      "flex flex-col justify-between",
      "w-full overflow-hidden",
      className
    )}>
      {children}
    </div>
  );
};
