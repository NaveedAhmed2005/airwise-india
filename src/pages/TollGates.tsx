import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Truck, ArrowDownLeft, ArrowUpRight, Search, AlertTriangle, Clock } from "lucide-react";
import { generateVehicleEntries, indianStates, tollGates } from "@/data/mockData";

const vehicleEntries = generateVehicleEntries(100);

export default function TollGates() {
  const [stateFilter, setStateFilter] = useState("all");
  const [districtFilter, setDistrictFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const [search, setSearch] = useState("");

  const districts = useMemo(() => {
    const d = stateFilter === "all" ? tollGates : tollGates.filter((t) => t.state === stateFilter);
    return [...new Set(d.map((t) => t.district))];
  }, [stateFilter]);

  const filtered = useMemo(() => {
    return vehicleEntries.filter((v) => {
      if (stateFilter !== "all" && v.state !== stateFilter) return false;
      if (districtFilter !== "all" && v.district !== districtFilter) return false;
      if (riskFilter !== "all" && v.riskLevel !== riskFilter) return false;
      if (search && !v.vehicleNumber.toLowerCase().includes(search.toLowerCase()) && !v.tollGateName.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [stateFilter, districtFilter, riskFilter, search]);

  const riskBadge = (risk: string) => {
    if (risk === "high") return "aqi-hazardous border-0 text-primary-foreground";
    if (risk === "moderate") return "aqi-moderate border-0 text-primary-foreground";
    return "aqi-good border-0 text-primary-foreground";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">Toll Gate Vehicle Monitor</h1>
          <p className="mt-1 text-muted-foreground">Live tracking of vehicles entering and exiting through highways</p>
        </div>

        {/* Summary */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="shadow-card flex items-center gap-4 p-5">
            <div className="rounded-xl bg-aqi-good-soft p-3"><ArrowDownLeft className="h-6 w-6 text-aqi-good" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Vehicles Entering</p>
              <p className="font-display text-2xl font-bold text-foreground">{filtered.filter((v) => v.direction === "entering").length}</p>
            </div>
          </Card>
          <Card className="shadow-card flex items-center gap-4 p-5">
            <div className="rounded-xl bg-aqi-unhealthy-soft p-3"><ArrowUpRight className="h-6 w-6 text-aqi-unhealthy" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Vehicles Exiting</p>
              <p className="font-display text-2xl font-bold text-foreground">{filtered.filter((v) => v.direction === "exiting").length}</p>
            </div>
          </Card>
          <Card className="shadow-card flex items-center gap-4 p-5">
            <div className="rounded-xl bg-aqi-hazardous-soft p-3"><AlertTriangle className="h-6 w-6 text-aqi-hazardous" /></div>
            <div>
              <p className="text-sm text-muted-foreground">High Risk Vehicles</p>
              <p className="font-display text-2xl font-bold text-aqi-hazardous">{filtered.filter((v) => v.riskLevel === "high").length}</p>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6 shadow-card p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search vehicle or toll gate..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>
            <Select value={stateFilter} onValueChange={(v) => { setStateFilter(v); setDistrictFilter("all"); }}>
              <SelectTrigger><SelectValue placeholder="State" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                {indianStates.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={districtFilter} onValueChange={setDistrictFilter}>
              <SelectTrigger><SelectValue placeholder="District" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Districts</SelectItem>
                {districts.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger><SelectValue placeholder="Risk Level" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk Levels</SelectItem>
                <SelectItem value="high">High Risk</SelectItem>
                <SelectItem value="moderate">Moderate Risk</SelectItem>
                <SelectItem value="low">Low Risk</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Table */}
        <Card className="shadow-card overflow-hidden">
          <div className="flex items-center gap-2 border-b border-border p-5">
            <Truck className="h-5 w-5 text-primary" />
            <h2 className="font-display text-lg font-semibold text-foreground">Live Vehicle Tracking</h2>
            <Badge variant="secondary" className="ml-auto">{filtered.length} vehicles</Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  {["Vehicle No.", "Type", "Toll Gate", "Direction", "AQI Impact", "Risk", "Age (yrs)", "Time"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 50).map((v) => (
                  <tr key={v.id} className="border-b border-border transition-colors hover:bg-muted/30">
                    <td className="px-4 py-3 font-mono text-sm font-medium text-foreground">{v.vehicleNumber}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{v.vehicleType}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{v.tollGateName}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-sm font-medium ${v.direction === "entering" ? "text-aqi-unhealthy" : "text-aqi-good"}`}>
                        {v.direction === "entering" ? <ArrowDownLeft className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />}
                        {v.direction}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-display text-sm font-bold text-foreground">+{v.aqiImpact}</td>
                    <td className="px-4 py-3"><Badge className={riskBadge(v.riskLevel)}>{v.riskLevel}</Badge></td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{v.vehicleAge}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(v.timestamp).toLocaleTimeString()}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
