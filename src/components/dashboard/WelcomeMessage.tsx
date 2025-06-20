
interface WelcomeMessageProps {
  user: any;
  userProfile: any;
  isConnected: boolean;
  isBackendConnected: boolean;
}

const WelcomeMessage = ({ user, userProfile, isConnected, isBackendConnected }: WelcomeMessageProps) => {
  if (!user) return null;

  const getConnectionStatus = () => {
    if (isConnected && isBackendConnected) return 'Full System Active';
    if (isConnected) return 'Database Connected';
    return 'Demo Mode';
  };

  const getConnectionColor = () => {
    if (isConnected && isBackendConnected) return 'from-green-400 to-blue-400';
    if (isConnected) return 'from-blue-400 to-cyan-400';
    return 'from-yellow-400 to-orange-400';
  };

  return (
    <div className="mb-8 p-6 enhanced-card animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-blue-300 mb-2">
            Welcome to Tamil Nadu Traffic Control System
          </h2>
          <div className="text-blue-200/80 space-y-1">
            <p>
              <span className="font-semibold text-white">{userProfile?.full_name || user.email?.split('@')[0] || 'User'}</span>
              {' • '}
              <span className="font-semibold">
                {userProfile?.role === 'admin' ? 'Administrator' : 
                 userProfile?.role === 'operator' ? 'Operator' : 'Viewer'}
              </span>
            </p>
            <p>
              Coverage: <span className="font-semibold">All Major TN Highways & Cities</span> •
              Access: <span className="font-semibold">
                {userProfile?.role === 'admin' ? 'Full Control' : 
                 userProfile?.role === 'operator' ? 'Operational' : 'View Only'}
              </span>
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getConnectionColor()} animate-pulse`}></div>
          <span className="text-sm font-medium px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-blue-300">
            {getConnectionStatus()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WelcomeMessage;
