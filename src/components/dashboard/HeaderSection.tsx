
import { Camera } from "lucide-react";
import UserMenu from "@/components/UserMenu";

interface HeaderSectionProps {
  isConnected: boolean;
  isBackendConnected: boolean;
}

const HeaderSection = ({ isConnected, isBackendConnected }: HeaderSectionProps) => {
  return (
    <header className="border-b border-slate-700/50 bg-slate-900/90 backdrop-blur-xl -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 mb-8 shadow-lg">
      <div className="py-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 animate-pulse-glow">
              <Camera className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold gradient-text text-shadow">
                Tamil Nadu ANPR Control Center
              </h1>
              <p className="text-slate-400 font-medium">
                Smart Traffic Management • Real-time Intelligence • Tamil Nadu Highways
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-yellow-400'} animate-pulse`}></div>
              <span className={`text-xs font-medium px-3 py-1.5 rounded-full border ${isConnected ? 'status-online' : 'status-warning'}`}>
                {isConnected ? 'DB Connected' : 'Mock Data'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isBackendConnected ? 'bg-green-400' : 'bg-orange-400'} animate-pulse`}></div>
              <span className={`text-xs font-medium px-3 py-1.5 rounded-full border ${isBackendConnected ? 'status-online' : 'status-warning'}`}>
                {isBackendConnected ? 'AI Online' : 'AI Mock'}
              </span>
            </div>
            <span className="text-xs font-medium px-3 py-1.5 rounded-full border status-info">
              TN Highways
            </span>
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderSection;
