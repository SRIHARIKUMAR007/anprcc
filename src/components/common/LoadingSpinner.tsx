
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

const LoadingSpinner = ({ size = "md", text, className = "" }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-400`} />
      {text && <span className="text-slate-400 text-sm">{text}</span>}
    </div>
  );
};

export default LoadingSpinner;
