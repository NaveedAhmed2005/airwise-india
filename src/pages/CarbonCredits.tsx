import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Factory, AlertTriangle, Award, Ban, FileText, Plus, Trash2 } from "lucide-react";
import { companies as initialCompanies, indianStates } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";
import type { Company } from "@/types/monitor";
import CarbonCertificate from "@/components/CarbonCertificate";
import { toast } from "sonner";

export default function CarbonCredits() {
  const { user } = useAuth();
  const isCollectorOrAdmin = user?.role === "collector" || user?.role === "admin";

  const [companiesData, setCompaniesData] = useState<Company[]>(initialCompanies);
  const [stateFilter, setStateFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showAddCompany, setShowAddCompany] = useState(false);
  const [newCompany, setNewCompany] = useState({ name: "", type: "Industry" as Company["type"], state: "Delhi", district: "", credits: 0 });

  const filtered = useMemo(() => {
    return companiesData.filter((c) => {
      if (stateFilter !== "all" && c.state !== stateFilter) return false;
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [companiesData, stateFilter, statusFilter, search]);

  const statusBadge = (status: string) => {
    if (status === "red") return "aqi-hazardous border-0 text-primary-foreground";
    if (status === "yellow") return "aqi-moderate border-0 text-primary-foreground";
    return "aqi-good border-0 text-primary-foreground";
  };

  const imposeFine = (companyId: string) => {
    setCompaniesData((prev) =>
      prev.map((c) => {
        if (c.id !== companyId) return c;
        const excess = c.usedCredits - c.carbonCredits;
        if (excess <= 0) { toast.error("Company is within limits"); return c; }
        const fineAmount = excess * 15000;
        toast.success(`Fine of ₹${fineAmount.toLocaleString()} imposed on ${c.name}`);
        return { ...c, fines: [...c.fines, { amount: fineAmount, date: new Date().toISOString().split("T")[0], reason: `Exceeded limit by ${excess} metric tons` }] };
      })
    );
  };

  const cancelCertificate = (companyId: string) => {
    setCompaniesData((prev) =>
      prev.map((c) => c.id === companyId ? { ...c, carbonCredits: 0, status: "red" as const } : c)
    );
    toast.success("Carbon credit certificate cancelled");
  };

  const addCompany = () => {
    if (!newCompany.name || !newCompany.district) { toast.error("Fill all fields"); return; }
    const id = `C${Date.now()}`;
    setCompaniesData((prev) => [...prev, {
      id, name: newCompany.name, type: newCompany.type, state: newCompany.state, district: newCompany.district,
      carbonCredits: newCompany.credits, usedCredits: 0, fines: [], status: "green" as const, registrationDate: new Date().toISOString().split("T")[0],
    }]);
    setShowAddCompany(false);
    setNewCompany({ name: "", type: "Industry", state: "Delhi", district: "", credits: 0 });
    toast.success("Company added and certificate issued");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Carbon Credits Monitor</h1>
            <p className="mt-1 text-muted-foreground">Track industrial emissions and carbon credit compliance</p>
          </div>
          {isCollectorOrAdmin && (
            <Dialog open={showAddCompany} onOpenChange={setShowAddCompany}>
              <DialogTrigger asChild>
                <Button className="gap-2"><Plus className="h-4 w-4" /> Add Company</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Register New Company</DialogTitle></DialogHeader>
                <div className="space-y-4 pt-4">
                  <Input placeholder="Company Name" value={newCompany.name} onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })} />
                  <Select value={newCompany.type} onValueChange={(v) => setNewCompany({ ...newCompany, type: v as Company["type"] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Industry">Industry</SelectItem>
                      <SelectItem value="Factory">Factory</SelectItem>
                      <SelectItem value="Mine">Mine</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={newCompany.state} onValueChange={(v) => setNewCompany({ ...newCompany, state: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{indianStates.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                  <Input placeholder="District" value={newCompany.district} onChange={(e) => setNewCompany({ ...newCompany, district: e.target.value })} />
                  <Input type="number" placeholder="Carbon Credits to Issue" value={newCompany.credits || ""} onChange={(e) => setNewCompany({ ...newCompany, credits: Number(e.target.value) })} />
                  <Button className="w-full" onClick={addCompany}>Register & Issue Certificate</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Summary */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="shadow-card flex items-center gap-4 p-5">
            <div className="rounded-xl bg-aqi-good-soft p-3"><Award className="h-6 w-6 text-aqi-good" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Green Listed</p>
              <p className="font-display text-2xl font-bold text-aqi-good">{companiesData.filter((c) => c.status === "green").length}</p>
            </div>
          </Card>
          <Card className="shadow-card flex items-center gap-4 p-5">
            <div className="rounded-xl bg-aqi-moderate-soft p-3"><AlertTriangle className="h-6 w-6 text-aqi-moderate" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Yellow Listed (Border)</p>
              <p className="font-display text-2xl font-bold text-aqi-moderate">{companiesData.filter((c) => c.status === "yellow").length}</p>
            </div>
          </Card>
          <Card className="shadow-card flex items-center gap-4 p-5">
            <div className="rounded-xl bg-aqi-hazardous-soft p-3"><Ban className="h-6 w-6 text-aqi-hazardous" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Red Listed (Exceeded)</p>
              <p className="font-display text-2xl font-bold text-aqi-hazardous">{companiesData.filter((c) => c.status === "red").length}</p>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6 shadow-card p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search company..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>
            <Select value={stateFilter} onValueChange={setStateFilter}>
              <SelectTrigger><SelectValue placeholder="State" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                {indianStates.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="green">Green</SelectItem>
                <SelectItem value="yellow">Yellow</SelectItem>
                <SelectItem value="red">Red</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Companies Table */}
        <Card className="shadow-card overflow-hidden">
          <div className="flex items-center gap-2 border-b border-border p-5">
            <Factory className="h-5 w-5 text-primary" />
            <h2 className="font-display text-lg font-semibold text-foreground">Companies & Carbon Credits</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  {["Company", "Type", "State", "Credits", "Used", "Excess", "Status", "Fines", "Certificate", ...(isCollectorOrAdmin ? ["Actions"] : [])].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => {
                  const excess = Math.max(0, c.usedCredits - c.carbonCredits);
                  const fineAmount = excess * 15000;
                  const totalFines = c.fines.reduce((a, f) => a + f.amount, 0);
                  return (
                    <tr key={c.id} className="border-b border-border transition-colors hover:bg-muted/30">
                      <td className="px-4 py-3 text-sm font-medium text-foreground">{c.name}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{c.type}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{c.state}</td>
                      <td className="px-4 py-3 font-display text-sm font-bold text-foreground">{c.carbonCredits}</td>
                      <td className="px-4 py-3 font-display text-sm font-bold text-foreground">{c.usedCredits}</td>
                      <td className="px-4 py-3 font-display text-sm font-bold text-aqi-hazardous">{excess > 0 ? `+${excess}` : "—"}</td>
                      <td className="px-4 py-3"><Badge className={statusBadge(c.status)}>{c.status}</Badge></td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {totalFines > 0 ? <span className="font-semibold text-aqi-hazardous">₹{totalFines.toLocaleString()}</span> : excess > 0 ? <span className="text-aqi-moderate">₹{fineAmount.toLocaleString()} due</span> : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedCompany(c)}><FileText className="h-4 w-4" /></Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-lg">
                            <DialogHeader><DialogTitle>Carbon Credit Certificate</DialogTitle></DialogHeader>
                            {selectedCompany && <CarbonCertificate company={selectedCompany} />}
                          </DialogContent>
                        </Dialog>
                      </td>
                      {isCollectorOrAdmin && (
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            {excess > 0 && <Button variant="destructive" size="sm" onClick={() => imposeFine(c.id)}>Fine</Button>}
                            <Button variant="ghost" size="sm" className="text-aqi-hazardous hover:text-aqi-hazardous" onClick={() => cancelCertificate(c.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
