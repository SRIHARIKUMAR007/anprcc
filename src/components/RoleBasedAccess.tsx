
import { useAuth } from "@/hooks/useAuth";
import { ReactNode } from "react";

interface RoleBasedAccessProps {
  children: ReactNode;
  allowedRoles: ('admin' | 'operator' | 'viewer')[];
  fallback?: ReactNode;
}

const RoleBasedAccess = ({ children, allowedRoles, fallback = null }: RoleBasedAccessProps) => {
  const { userProfile } = useAuth();
  
  const userRole = userProfile?.role || 'viewer';
  
  if (allowedRoles.includes(userRole as 'admin' | 'operator' | 'viewer')) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
};

export default RoleBasedAccess;
