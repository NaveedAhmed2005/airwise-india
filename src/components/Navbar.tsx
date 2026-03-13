import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Wind, LogIn, LogOut, Shield, UserCheck, Menu, X, ChevronDown, BarChart3, FileText, Info, ShieldAlert, Users } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const mainLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/toll-gates", label: "Toll Gates" },
    { to: "/carbon-credits", label: "Carbon Credits" },
    { to: "/aqi-map", label: "AQI Map" },
    { to: "/aqi-prediction", label: "Prediction" },
  ];

  const resourceLinks = [
    { to: "/analytics", label: "Analytics", icon: BarChart3 },
    { to: "/policies", label: "Policies", icon: FileText },
    { to: "/suggestions", label: "Precautions", icon: ShieldAlert },
    { to: "/about", label: "About", icon: Info },
  ];

  const isActive = (path: string) => location.pathname === path;
  const isResourceActive = resourceLinks.some((l) => isActive(l.to));

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setResourcesOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-glow-green">
            <Wind className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">
            Monitor <span className="text-gradient-green">India</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-0.5 lg:flex">
          {mainLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${
                isActive(link.to)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Collector Hub - only for logged in collectors/admin */}
          {user && (user.role === "collector" || user.role === "admin") && (
            <Link
              to="/collector-hub"
              className={`rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${
                isActive("/collector-hub")
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> Hub</span>
            </Link>
          )}

          {/* Resources Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setResourcesOpen(!resourcesOpen)}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${
                isResourceActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              Resources <ChevronDown className={`h-3.5 w-3.5 transition-transform ${resourcesOpen ? "rotate-180" : ""}`} />
            </button>
            {resourcesOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 rounded-lg border border-border bg-card p-1.5 shadow-elevated animate-fade-in z-50">
                {resourceLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setResourcesOpen(false)}
                      className={`flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                        isActive(link.to)
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <div className="flex items-center gap-2">
              <div className="hidden items-center gap-2 rounded-full bg-accent px-3 py-1.5 sm:flex">
                {user.role === "admin" ? <Shield className="h-3.5 w-3.5 text-accent-foreground" /> : <UserCheck className="h-3.5 w-3.5 text-accent-foreground" />}
                <span className="text-xs font-semibold text-accent-foreground uppercase">{user.role}</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => { logout(); navigate("/dashboard"); }}>
                <LogOut className="mr-1 h-4 w-4" /> Logout
              </Button>
            </div>
          ) : (
            <Button size="sm" className="gap-1.5" onClick={() => navigate("/login")}>
              <LogIn className="h-4 w-4" /> Login
            </Button>
          )}

          <button className="lg:hidden rounded-lg p-2 text-muted-foreground hover:bg-muted" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-card p-4 lg:hidden animate-fade-in">
          <div className="flex flex-col gap-1">
            {mainLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {user && (user.role === "collector" || user.role === "admin") && (
              <Link
                to="/collector-hub"
                onClick={() => setMobileOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors flex items-center gap-2 ${
                  isActive("/collector-hub")
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Users className="h-4 w-4" /> Collector Hub
              </Link>
            )}

            {/* Mobile Resources */}
            <button
              onClick={() => setMobileResourcesOpen(!mobileResourcesOpen)}
              className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isResourceActive ? "bg-primary/10 text-primary" : "text-muted-foreground"
              }`}
            >
              Resources
              <ChevronDown className={`h-4 w-4 transition-transform ${mobileResourcesOpen ? "rotate-180" : ""}`} />
            </button>
            {mobileResourcesOpen && (
              <div className="ml-3 flex flex-col gap-0.5 border-l-2 border-primary/20 pl-3">
                {resourceLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => { setMobileOpen(false); setMobileResourcesOpen(false); }}
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        isActive(link.to)
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
