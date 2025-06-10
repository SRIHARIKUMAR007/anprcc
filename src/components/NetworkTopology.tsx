
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Network, Server, Database, Shield, Zap, Activity } from "lucide-react";

const NetworkTopology = () => {
  const networkNodes = [
    { id: "controller", type: "SDN Controller", status: "active", connections: 8, load: 45 },
    { id: "switch1", type: "OpenFlow Switch", status: "active", connections: 4, load: 78 },
    { id: "switch2", type: "OpenFlow Switch", status: "active", connections: 6, load: 62 },
    { id: "switch3", type: "OpenFlow Switch", status: "maintenance", connections: 0, load: 0 },
    { id: "server1", type: "ANPR Server", status: "active", connections: 2, load: 89 },
    { id: "server2", type: "Database Server", status: "active", connections: 3, load: 34 },
    { id: "server3", type: "Backup Server", status: "standby", connections: 1, load: 12 },
  ];

  const trafficFlows = [
    { id: 1, source: "Camera Network", dest: "ANPR Processing", bandwidth: "450 Mbps", priority: "high" },
    { id: 2, source: "ANPR Processing", dest: "Central Database", bandwidth: "125 Mbps", priority: "medium" },
    { id: 3, source: "Alert System", dest: "Control Center", bandwidth: "25 Mbps", priority: "critical" },
    { id: 4, source: "Backup System", dest: "Cloud Storage", bandwidth: "200 Mbps", priority: "low" },
  ];

  return (
    <div className="space-y-6">
      {/* Network Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Network Health</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">98.2%</div>
            <p className="text-xs text-slate-400">All systems operational</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Total Bandwidth</CardTitle>
            <Zap className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">2.4 Gbps</div>
            <p className="text-xs text-slate-400">67% utilization</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Active Flows</CardTitle>
            <Network className="h-4 w-4 text-cyan-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">247</div>
            <p className="text-xs text-slate-400">12 high priority</p>
          </CardContent>
        </Card>
      </div>

      {/* Network Topology Visualization */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">SDN Network Topology</CardTitle>
            <Button variant="outline" size="sm">
              <Network className="w-4 h-4 mr-2" />
              Refresh Topology
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative h-96 bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-lg p-6 overflow-hidden">
            {/* SDN Controller */}
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
                <Server className="w-8 h-8 text-white" />
              </div>
              <div className="text-center mt-2">
                <div className="text-white text-sm font-semibold">SDN Controller</div>
                <div className="text-green-400 text-xs">Active</div>
              </div>
            </div>

            {/* OpenFlow Switches */}
            <div className="absolute top-32 left-16">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Network className="w-6 h-6 text-white" />
              </div>
              <div className="text-center mt-1">
                <div className="text-white text-xs">Switch-01</div>
                <div className="text-green-400 text-xs">78% Load</div>
              </div>
            </div>

            <div className="absolute top-32 right-16">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Network className="w-6 h-6 text-white" />
              </div>
              <div className="text-center mt-1">
                <div className="text-white text-xs">Switch-02</div>
                <div className="text-green-400 text-xs">62% Load</div>
              </div>
            </div>

            <div className="absolute top-32 left-1/2 transform -translate-x-1/2">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Network className="w-6 h-6 text-white" />
              </div>
              <div className="text-center mt-1">
                <div className="text-white text-xs">Switch-03</div>
                <div className="text-red-400 text-xs">Maintenance</div>
              </div>
            </div>

            {/* Servers */}
            <div className="absolute bottom-16 left-8">
              <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-white" />
              </div>
              <div className="text-center mt-1">
                <div className="text-white text-xs">ANPR Server</div>
                <div className="text-purple-400 text-xs">89% Load</div>
              </div>
            </div>

            <div className="absolute bottom-16 right-8">
              <div className="w-14 h-14 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-white" />
              </div>
              <div className="text-center mt-1">
                <div className="text-white text-xs">DB Server</div>
                <div className="text-yellow-400 text-xs">34% Load</div>
              </div>
            </div>

            {/* Connection Lines */}
            <svg className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
              <defs>
                <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8"/>
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8"/>
                </linearGradient>
              </defs>
              <line x1="50%" y1="15%" x2="20%" y2="40%" stroke="url(#connectionGradient)" strokeWidth="2" strokeDasharray="5,5">
                <animate attributeName="stroke-dashoffset" values="0;10" dur="2s" repeatCount="indefinite"/>
              </line>
              <line x1="50%" y1="15%" x2="80%" y2="40%" stroke="url(#connectionGradient)" strokeWidth="2" strokeDasharray="5,5">
                <animate attributeName="stroke-dashoffset" values="0;10" dur="2s" repeatCount="indefinite"/>
              </line>
              <line x1="50%" y1="15%" x2="50%" y2="40%" stroke="url(#connectionGradient)" strokeWidth="2" strokeDasharray="5,5">
                <animate attributeName="stroke-dashoffset" values="0;10" dur="2s" repeatCount="indefinite"/>
              </line>
            </svg>
          </div>
        </CardContent>
      </Card>

      {/* Network Nodes Status */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Network Nodes Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {networkNodes.map((node) => (
              <div key={node.id} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-white font-semibold">{node.type}</div>
                  <Badge 
                    variant={node.status === "active" ? "default" : node.status === "maintenance" ? "destructive" : "secondary"}
                    className={
                      node.status === "active" ? "bg-green-500/20 text-green-400 border-green-500/30" :
                      node.status === "maintenance" ? "bg-red-500/20 text-red-400 border-red-500/30" :
                      "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                    }
                  >
                    {node.status}
                  </Badge>
                </div>
                <div className="space-y-1 text-sm text-slate-400">
                  <div>Connections: {node.connections}</div>
                  <div>Load: {node.load}%</div>
                  <div className="w-full bg-slate-600 rounded-full h-2 mt-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        node.load > 80 ? "bg-red-500" : 
                        node.load > 60 ? "bg-yellow-500" : "bg-green-500"
                      }`}
                      style={{ width: `${node.load}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Traffic Flows */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Active Traffic Flows</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trafficFlows.map((flow) => (
              <div key={flow.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                <div>
                  <div className="text-white font-semibold">{flow.source} → {flow.dest}</div>
                  <div className="text-slate-400 text-sm">{flow.bandwidth}</div>
                </div>
                <Badge 
                  variant={flow.priority === "critical" ? "destructive" : flow.priority === "high" ? "default" : "secondary"}
                  className={
                    flow.priority === "critical" ? "bg-red-500/20 text-red-400 border-red-500/30" :
                    flow.priority === "high" ? "bg-blue-500/20 text-blue-400 border-blue-500/30" :
                    "bg-slate-500/20 text-slate-400 border-slate-500/30"
                  }
                >
                  {flow.priority}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NetworkTopology;
