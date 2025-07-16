
interface NetworkNode {
  id: string;
  name: string;
  type: 'controller' | 'switch' | 'server' | 'camera';
  status: 'online' | 'offline' | 'maintenance';
  load: number;
  position: { x: number; y: number };
  connections: string[];
  throughput?: number;
  latency?: number;
}

interface NetworkConnectionsProps {
  networkNodes: NetworkNode[];
}

const NetworkConnections = ({ networkNodes }: NetworkConnectionsProps) => {
  const getConnectionColor = (node: NetworkNode, connectedNode: NetworkNode) => {
    if (node.status === 'maintenance' || connectedNode.status === 'maintenance') {
      return "stroke-orange-400/80 stroke-[1.5]";
    }
    if (node.status === 'offline' || connectedNode.status === 'offline') {
      return "stroke-red-400/80 stroke-[1.5]";
    }
    
    const avgThroughput = ((node.throughput || 0) + (connectedNode.throughput || 0)) / 2;
    if (avgThroughput > 1000) return "stroke-cyan-400/90 stroke-[2]";
    if (avgThroughput > 500) return "stroke-green-400/80 stroke-[1.5]";
    return "stroke-blue-400/70 stroke-[1.5]";
  };

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
      <defs>
        <marker id="arrowhead" markerWidth="8" markerHeight="6" 
          refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="rgba(0, 255, 255, 0.8)" />
        </marker>
        <filter id="connection-glow">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      {networkNodes.map(node => 
        node.connections.map(connectionId => {
          const connectedNode = networkNodes.find(n => n.id === connectionId);
          if (!connectedNode) return null;
          
          const nodeX = node.position.x;
          const nodeY = node.position.y;
          const connectedX = connectedNode.position.x;
          const connectedY = connectedNode.position.y;
          
          return (
            <line
              key={`${node.id}-${connectionId}`}
              x1={`${nodeX}%`}
              y1={`${nodeY}%`}
              x2={`${connectedX}%`}
              y2={`${connectedY}%`}
              className={getConnectionColor(node, connectedNode)}
              strokeDasharray={node.status === 'maintenance' || connectedNode.status === 'maintenance' ? "4,2" : "none"}
              markerEnd="url(#arrowhead)"
              filter="url(#connection-glow)"
            />
          );
        })
      )}
    </svg>
  );
};

export default NetworkConnections;
