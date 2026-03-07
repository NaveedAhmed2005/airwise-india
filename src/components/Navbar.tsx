import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Wind, LogIn, LogOut, Shield, UserCheck } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Wind className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">
            Monitor <span className="text-gradient-green">India</span>
          </span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Link to="/dashboard" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Dashboard
          </Link>
          <Link to="/toll-gates" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Toll Gates
          </Link>
          <Link to="/carbon-credits" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Carbon Credits
          </Link>
          <Link to="/aqi-map" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            AQI Map
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-full bg-accent px-3 py-1.5 sm:flex">
                {user.role === "admin" ? <Shield className="h-4 w-4 text-accent-foreground" /> : <UserCheck className="h-4 w-4 text-accent-foreground" />}
                <span className="text-xs font-semibold text-accent-foreground uppercase">{user.role}</span>
              </div>
              <span className="hidden text-sm font-medium text-foreground lg:block">{user.name}</span>
              <Button variant="outline" size="sm" onClick={() => { logout(); navigate("/dashboard"); }}>
                <LogOut className="mr-1 h-4 w-4" /> Logout
              </Button>
            </div>
          ) : (
            <Button variant="default" size="sm" onClick={() => navigate("/login")}>
              <LogIn className="mr-1 h-4 w-4" /> Login
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
