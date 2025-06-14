
import React from "react";
import { Button } from "@/components/ui/button";

interface AuthToggleProps {
  isLogin: boolean;
  onToggle: () => void;
}

const AuthToggle = ({ isLogin, onToggle }: AuthToggleProps) => {
  return (
    <div className="mt-6 text-center">
      <p className="text-slate-400">
        {isLogin ? "Don't have an account?" : "Already have an account?"}
      </p>
      <Button
        variant="link"
        onClick={onToggle}
        className="text-blue-400 hover:text-blue-300"
      >
        {isLogin ? "Create one here" : "Sign in here"}
      </Button>
    </div>
  );
};

export default AuthToggle;
