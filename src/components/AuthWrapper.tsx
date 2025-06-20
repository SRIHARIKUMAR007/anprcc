
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      console.log('User not authenticated, redirecting to auth page');
      // Use setTimeout to prevent navigation during render
      setTimeout(() => {
        window.location.href = '/auth';
      }, 100);
    }
  }, [user, loading]);

  // Show loading skeleton while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-4 sm:p-6">
        <div className="container mx-auto space-y-6">
          <Skeleton className="h-16 w-full bg-slate-800" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24 bg-slate-800" />
            ))}
          </div>
          <Skeleton className="h-96 w-full bg-slate-800" />
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (prevents flash)
  if (!user) {
    return null;
  }

  return <>{children}</>;
};

export default AuthWrapper;
