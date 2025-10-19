import { Moon, Sun, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState("John Doe");

  const isDashboardRoute = location.pathname === "/dashboard" || location.pathname === "/recruiter-dashboard";

  useEffect(() => {
    // Get user name from localStorage (demo data)
    const storedName = localStorage.getItem("name");
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        
        <Link to="/" className="flex items-center space-x-2">
        
          <div className="h-8 w-8 rounded-lg gradient-primary text-center" >
            <span className="text-xl font-bold white items-center">A</span>
          </div>
          
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Algohire
          </span>

         
        </Link>


        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="transition-smooth"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <div className="hidden md:flex items-center space-x-2">
            {isDashboardRoute ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <User className="mr-2 h-4 w-4" />
                    {userName}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/edit-profile" className="cursor-pointer">
                      Edit Profile
                    </Link>
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer">
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/recruiter-dashboard" className="cursor-pointer">
                      Recruiter Dashboard
                    </Link>
                  </DropdownMenuItem> */}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link to="/signup">
                  <Button className="gradient-primary text-white hover:opacity-90 transition-smooth">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur animate-slide-up">
          <div className="container py-4 space-y-3">
            {isDashboardRoute && (
              <>
                <div className="py-2 text-sm font-semibold border-b border-border/40">
                  {userName}
                </div>
                <Link to="/edit-profile" className="block py-2 text-sm font-medium text-foreground/80 hover:text-foreground">
                  Edit Profile
                </Link>
                <Link to="/dashboard" className="block py-2 text-sm font-medium text-foreground/80 hover:text-foreground">
                  Dashboard
                </Link>
                <Link to="/recruiter-dashboard" className="block py-2 text-sm font-medium text-foreground/80 hover:text-foreground">
                  Recruiter Dashboard
                </Link>
              </>
            )}
            {!isDashboardRoute && (
              <div className="pt-2 space-y-2">
                <Link to="/login" className="block">
                  <Button variant="outline" className="w-full">Sign In</Button>
                </Link>
                <Link to="/signup" className="block">
                  <Button className="w-full gradient-primary text-white">Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
