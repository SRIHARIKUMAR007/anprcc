
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div className="text-center space-y-6 p-8">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-white">404</h1>
          <h2 className="text-2xl font-semibold text-slate-300">Page Not Found</h2>
          <p className="text-slate-400 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link to="/">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
            <Link to="/auth">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Sign In
            </Link>
          </Button>
        </div>
        
        <p className="text-xs text-slate-500">
          Route: {location.pathname}
        </p>
      </div>
    </div>
  );
};

export default NotFound;
