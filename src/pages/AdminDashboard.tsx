import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, UserCheck, UserX, Users, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";

export default function AdminDashboard() {
  const { user, pendingCollectors, approveCollector, rejectCollector } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "admin") navigate("/login");
  }, [user, navigate]);

  if (!user || user.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary p-3"><Shield className="h-6 w-6 text-primary-foreground" /></div>
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage collectors, approvals, and platform settings</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="shadow-card flex items-center gap-4 p-5">
            <div className="rounded-xl bg-aqi-moderate-soft p-3"><Users className="h-6 w-6 text-aqi-moderate" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Approvals</p>
              <p className="font-display text-2xl font-bold text-aqi-moderate">{pendingCollectors.length}</p>
            </div>
          </Card>
          <Card className="shadow-card flex items-center gap-4 p-5">
            <div className="rounded-xl bg-aqi-good-soft p-3"><CheckCircle className="h-6 w-6 text-aqi-good" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Platform Status</p>
              <p className="font-display text-lg font-bold text-aqi-good">Active</p>
            </div>
          </Card>
          <Card className="shadow-card flex items-center gap-4 p-5">
            <div className="rounded-xl bg-accent p-3"><Shield className="h-6 w-6 text-accent-foreground" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Logged in as</p>
              <p className="text-sm font-semibold text-foreground">{user.email}</p>
            </div>
          </Card>
        </div>

        {/* Pending Collectors */}
        <Card className="shadow-card overflow-hidden">
          <div className="flex items-center gap-2 border-b border-border p-5">
            <UserCheck className="h-5 w-5 text-primary" />
            <h2 className="font-display text-lg font-semibold text-foreground">Pending Collector Approvals</h2>
            <Badge variant="secondary" className="ml-auto">{pendingCollectors.length} pending</Badge>
          </div>

          {pendingCollectors.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground">No pending approvals</div>
          ) : (
            <div className="divide-y divide-border">
              {pendingCollectors.map((c) => (
                <div key={c.id} className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      <UserCheck className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => { approveCollector(c.id); toast.success(`${c.name} approved`); }}>
                      <CheckCircle className="mr-1 h-4 w-4" /> Approve
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => { rejectCollector(c.id); toast.info(`${c.name} rejected`); }}>
                      <UserX className="mr-1 h-4 w-4" /> Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Quick Links */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="shadow-card cursor-pointer p-5 transition-all hover:shadow-elevated" onClick={() => navigate("/toll-gates")}>
            <h3 className="font-display font-semibold text-foreground">Toll Gate Monitor</h3>
            <p className="mt-1 text-sm text-muted-foreground">View live vehicle tracking</p>
          </Card>
          <Card className="shadow-card cursor-pointer p-5 transition-all hover:shadow-elevated" onClick={() => navigate("/carbon-credits")}>
            <h3 className="font-display font-semibold text-foreground">Carbon Credits</h3>
            <p className="mt-1 text-sm text-muted-foreground">Manage companies & certificates</p>
          </Card>
          <Card className="shadow-card cursor-pointer p-5 transition-all hover:shadow-elevated" onClick={() => navigate("/aqi-map")}>
            <h3 className="font-display font-semibold text-foreground">AQI Map</h3>
            <p className="mt-1 text-sm text-muted-foreground">View state-wise air quality</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
