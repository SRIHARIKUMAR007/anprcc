
interface WelcomeMessageProps {
  user: any;
  userProfile: any;
  isConnected: boolean;
  isBackendConnected: boolean;
}

const WelcomeMessage = ({ user, userProfile, isConnected, isBackendConnected }: WelcomeMessageProps) => {
  if (!user) return null;

  return (
    <div className="mb-8 p-6 enhanced-card animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-blue-300 mb-2">
            Welcome to Tamil Nadu Traffic Control, {userProfile?.full_name || user.email}!
          </h2>
          <p className="text-blue-200/80">
            Role: <span className="font-semibold">{userProfile?.role || 'Loading...'}</span> • 
            Coverage: <span className="font-semibold">All Major TN Highways & Cities</span> •
            Access Level: <span className="font-semibold">
              {userProfile?.role === 'admin' ? 'Full Control' : 
               userProfile?.role === 'operator' ? 'Operational' : 'View Only'}
            </span>
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-blue-400 animate-pulse"></div>
          <span className="text-sm font-medium px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-blue-300">
            {isConnected && isBackendConnected ? 'Full System' : 
             isConnected ? 'Database Only' : 'Demo Mode'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WelcomeMessage;
