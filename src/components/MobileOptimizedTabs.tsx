
import { ReactNode } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from '@/lib/utils';

interface MobileOptimizedTabsProps {
  children: ReactNode;
  defaultValue: string;
  className?: string;
}

export const MobileOptimizedTabs = ({ children, defaultValue, className }: MobileOptimizedTabsProps) => {
  return (
    <Tabs defaultValue={defaultValue} className={cn("space-y-4 sm:space-y-6", className)}>
      <ScrollArea className="w-full">
        <TabsList className={cn(
          "inline-flex h-auto p-1 bg-slate-800/50 border-slate-700",
          "grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12",
          "gap-1 sm:gap-2",
          "w-full min-w-max"
        )}>
          <TabsTrigger 
            value="dashboard" 
            className="data-[state=active]:bg-blue-600 text-xs sm:text-sm px-2 py-2"
          >
            Dashboard
          </TabsTrigger>
          <TabsTrigger 
            value="live" 
            className="data-[state=active]:bg-blue-600 text-xs sm:text-sm px-2 py-2"
          >
            Live Feed
          </TabsTrigger>
          <TabsTrigger 
            value="image-processing" 
            className="data-[state=active]:bg-blue-600 text-xs sm:text-sm px-2 py-2"
          >
            Image AI
          </TabsTrigger>
          <TabsTrigger 
            value="vehicle-updates" 
            className="data-[state=active]:bg-blue-600 text-xs sm:text-sm px-2 py-2"
          >
            Updates
          </TabsTrigger>
          <TabsTrigger 
            value="vehicle-details" 
            className="data-[state=active]:bg-blue-600 text-xs sm:text-sm px-2 py-2"
          >
            Lookup
          </TabsTrigger>
          <TabsTrigger 
            value="network" 
            className="data-[state=active]:bg-blue-600 text-xs sm:text-sm px-2 py-2"
          >
            Network
          </TabsTrigger>
          <TabsTrigger 
            value="sdn-manager" 
            className="data-[state=active]:bg-blue-600 text-xs sm:text-sm px-2 py-2"
          >
            SDN
          </TabsTrigger>
          <TabsTrigger 
            value="parking" 
            className="data-[state=active]:bg-blue-600 text-xs sm:text-sm px-2 py-2"
          >
            Parking
          </TabsTrigger>
          <TabsTrigger 
            value="database" 
            className="data-[state=active]:bg-blue-600 text-xs sm:text-sm px-2 py-2"
          >
            Database
          </TabsTrigger>
          <TabsTrigger 
            value="alerts" 
            className="data-[state=active]:bg-blue-600 text-xs sm:text-sm px-2 py-2"
          >
            Alerts
          </TabsTrigger>
          <TabsTrigger 
            value="analytics" 
            className="data-[state=active]:bg-blue-600 text-xs sm:text-sm px-2 py-2"
          >
            Analytics
          </TabsTrigger>
          <TabsTrigger 
            value="controls" 
            className="data-[state=active]:bg-blue-600 text-xs sm:text-sm px-2 py-2"
          >
            Controls
          </TabsTrigger>
        </TabsList>
      </ScrollArea>
      {children}
    </Tabs>
  );
};
