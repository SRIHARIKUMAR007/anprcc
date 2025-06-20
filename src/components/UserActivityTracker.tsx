
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Users, 
  Activity, 
  Clock, 
  Eye, 
  Settings, 
  Search,
  Download,
  Shield,
  UserCheck,
  RefreshCw
} from "lucide-react";
import { useAuth } from '@/hooks/useAuth';

interface UserActivity {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  details: string;
  timestamp: Date;
  ipAddress: string;
  status: 'success' | 'warning' | 'error';
}

const UserActivityTracker = () => {
  const { userProfile } = useAuth();
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [activeUsers, setActiveUsers] = useState(3);
  const [totalSessions, setTotalSessions] = useState(24);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Generate mock activity data
  useEffect(() => {
    const mockActivities: UserActivity[] = [
      {
        id: '1',
        userId: 'user1',
        userName: 'Admin User',
        userRole: 'admin',
        action: 'System Configuration',
        details: 'Updated camera settings for Camera-01',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        ipAddress: '192.168.1.100',
        status: 'success'
      },
      {
        id: '2',
        userId: 'user2',
        userName: 'Security Operator',
        userRole: 'operator',
        action: 'Search Query',
        details: 'Advanced search for plate "ABC123"',
        timestamp: new Date(Date.now() - 12 * 60 * 1000),
        ipAddress: '192.168.1.101',
        status: 'success'
      },
      {
        id: '3',
        userId: 'user3',
        userName: 'Viewer User',
        userRole: 'viewer',
        action: 'Data Export',
        details: 'Exported detection data (CSV format)',
        timestamp: new Date(Date.now() - 18 * 60 * 1000),
        ipAddress: '192.168.1.102',
        status: 'success'
      },
      {
        id: '4',
        userId: 'user1',
        userName: 'Admin User',
        userRole: 'admin',
        action: 'Authentication',
        details: 'Failed login attempt detected',
        timestamp: new Date(Date.now() - 25 * 60 * 1000),
        ipAddress: '192.168.1.200',
        status: 'error'
      },
      {
        id: '5',
        userId: 'user2',
        userName: 'Security Operator',
        userRole: 'operator',
        action: 'Alert Management',
        details: 'Acknowledged security alert #A-2024-001',
        timestamp: new Date(Date.now() - 32 * 60 * 1000),
        ipAddress: '192.168.1.101',
        status: 'success'
      }
    ];

    setActivities(mockActivities);
  }, []);

  const refreshData = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setActiveUsers(Math.floor(Math.random() * 5) + 2);
    setTotalSessions(Math.floor(Math.random() * 10) + 20);
    setIsRefreshing(false);
  };

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'system configuration': return <Settings className="w-4 h-4" />;
      case 'search query': return <Search className="w-4 h-4" />;
      case 'data export': return <Download className="w-4 h-4" />;
      case 'authentication': return <Shield className="w-4 h-4" />;
      case 'alert management': return <Activity className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'operator': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'viewer': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'warning': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'error': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            User Activity Tracker
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={isRefreshing}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Activity Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-700/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Active Users</span>
              <UserCheck className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-xl font-bold text-white">{activeUsers}</div>
            <div className="text-xs text-slate-500">Currently online</div>
          </div>

          <div className="bg-slate-700/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Total Sessions</span>
              <Clock className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-xl font-bold text-white">{totalSessions}</div>
            <div className="text-xs text-slate-500">Today</div>
          </div>

          <div className="bg-slate-700/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Recent Actions</span>
              <Activity className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-xl font-bold text-white">{activities.length}</div>
            <div className="text-xs text-slate-500">Last hour</div>
          </div>

          <div className="bg-slate-700/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Success Rate</span>
              <Shield className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-xl font-bold text-white">
              {Math.round((activities.filter(a => a.status === 'success').length / activities.length) * 100)}%
            </div>
            <div className="text-xs text-slate-500">Security score</div>
          </div>
        </div>

        {/* Current User Status */}
        <div className="bg-slate-700/30 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-3">Your Current Session</h3>
          <div className="flex items-center space-x-4">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-blue-600 text-white">
                {userProfile?.full_name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="text-white font-medium">{userProfile?.full_name || 'User'}</span>
                <Badge className={getRoleColor(userProfile?.role || 'viewer')}>
                  {userProfile?.role?.toUpperCase() || 'VIEWER'}
                </Badge>
              </div>
              <div className="text-slate-400 text-sm">
                Last activity: {new Date().toLocaleTimeString()}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm">Active</span>
            </div>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
          
          <div className="max-h-64 overflow-y-auto space-y-2">
            {activities.map((activity) => (
              <div key={activity.id} className="bg-slate-700/30 rounded-lg p-3 border border-slate-600">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-slate-600 text-white text-xs">
                        {activity.userName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-medium text-sm">{activity.userName}</span>
                        <Badge className={getRoleColor(activity.userRole)}>
                          {activity.userRole.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        {getActionIcon(activity.action)}
                        <span className="text-slate-300 text-sm">{activity.action}</span>
                        <Badge className={getStatusColor(activity.status)}>
                          {activity.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-slate-400 text-xs">
                    {getTimeAgo(activity.timestamp)}
                  </div>
                </div>
                
                <div className="ml-11 space-y-1">
                  <p className="text-slate-400 text-sm">{activity.details}</p>
                  <div className="flex items-center space-x-3 text-xs text-slate-500">
                    <span>IP: {activity.ipAddress}</span>
                    <span>•</span>
                    <span>{activity.timestamp.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Summary */}
        <div className="bg-slate-700/30 rounded-lg p-4">
          <h4 className="text-white font-medium mb-3">Activity Summary (Last 24h)</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-xl font-bold text-green-400">
                {activities.filter(a => a.status === 'success').length}
              </div>
              <div className="text-xs text-slate-400">Successful</div>
            </div>
            <div>
              <div className="text-xl font-bold text-yellow-400">
                {activities.filter(a => a.status === 'warning').length}
              </div>
              <div className="text-xs text-slate-400">Warnings</div>
            </div>
            <div>
              <div className="text-xl font-bold text-red-400">
                {activities.filter(a => a.status === 'error').length}
              </div>
              <div className="text-xs text-slate-400">Errors</div>
            </div>
            <div>
              <div className="text-xl font-bold text-blue-400">
                {new Set(activities.map(a => a.userId)).size}
              </div>
              <div className="text-xs text-slate-400">Unique Users</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserActivityTracker;
