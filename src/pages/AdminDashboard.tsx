import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, UserCheck, UserX, Users, CheckCircle, Camera, FileText, Eye } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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
                <div key={c.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    {/* Show photo if available */}
                    {(c as any).photo ? (
                      <img
                        src={(c as any).photo}
                        alt={c.name}
                        className="h-12 w-12 rounded-full object-cover border-2 border-primary"
                        style={{ transform: "scaleX(-1)" }}
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                        <UserCheck className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-foreground">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.email}</p>
                      <div className="mt-1 flex items-center gap-2">
                        {(c as any).photo && (
                          <Badge variant="outline" className="text-xs gap-1">
                            <Camera className="h-3 w-3" /> Photo
                          </Badge>
                        )}
                        {(c as any).idProof && (
                          <Badge variant="outline" className="text-xs gap-1">
                            <FileText className="h-3 w-3" /> ID Proof
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {/* View Documents Dialog */}
                    {((c as any).photo || (c as any).idProof) && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="gap-1">
                            <Eye className="h-4 w-4" /> View Documents
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                          <DialogHeader>
                            <DialogTitle>Documents — {c.name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            {(c as any).photo && (
                              <div>
                                <p className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                                  <Camera className="h-4 w-4 text-primary" /> Live Photo
                                </p>
                                <img
                                  src={(c as any).photo}
                                  alt="Live Photo"
                                  className="w-full max-h-64 object-contain rounded-xl border border-border"
                                  style={{ transform: "scaleX(-1)" }}
                                />
                              </div>
                            )}
                            {(c as any).idProof && (
                              <div>
                                <p className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-primary" /> IAS ID Proof
                                </p>
                                <img
                                  src={(c as any).idProof}
                                  alt="ID Proof"
                                  className="w-full max-h-64 object-contain rounded-xl border border-border bg-muted"
                                />
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
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
