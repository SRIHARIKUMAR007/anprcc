import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme) {
      setIsDark(theme === "dark");
      document.documentElement.classList.toggle("dark", theme === "dark");
    } else {
      // Default to dark theme
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark", !isDark);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="cyber-border bg-cyber-bg/50 hover:bg-cyber-primary/10 border-cyber-accent/30 text-cyber-text transition-all duration-300"
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-cyber-accent" />
      ) : (
        <Moon className="w-4 h-4 text-cyber-accent" />
      )}
    </Button>
  );
};

export default ThemeToggle;