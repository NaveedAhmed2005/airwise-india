import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Activity, TrendingUp, TrendingDown, Factory, Truck, Wind, MapPin, ArrowRight } from "lucide-react";
import { generateVehicleEntries, companies, stateAQIData, indianStates } from "@/data/mockData";
import { useNavigate } from "react-router-dom";

const vehicleEntries = generateVehicleEntries(50);

export default function Dashboard() {
  const [stateFilter, setStateFilter] = useState<string>("all");
  const navigate = useNavigate();

  const filteredAQI = useMemo(() =>
    stateFilter === "all" ? stateAQIData : stateAQIData.filter((s) => s.state === stateFilter)
  , [stateFilter]);

  const totalEntries = vehicleEntries.length;
  const entering = vehicleEntries.filter((v) => v.direction === "entering").length;
  const redCompanies = companies.filter((c) => c.status === "red").length;
  const avgAQI = Math.round(stateAQIData.reduce((a, b) => a + b.aqi, 0) / stateAQIData.length);

  const aqiColor = (aqi: number) =>
    aqi <= 50 ? "text-aqi-good" : aqi <= 100 ? "text-aqi-moderate" : aqi <= 200 ? "text-aqi-unhealthy" : "text-aqi-hazardous";

  const aqiBg = (aqi: number) =>
    aqi <= 50 ? "bg-aqi-good/10" : aqi <= 100 ? "bg-aqi-moderate/10" : aqi <= 200 ? "bg-aqi-unhealthy/10" : "bg-aqi-hazardous/10";

  const aqiBarColor = (aqi: number) =>
    aqi <= 50 ? "bg-aqi-good" : aqi <= 100 ? "bg-aqi-moderate" : aqi <= 200 ? "bg-aqi-unhealthy" : "bg-aqi-hazardous";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Air Quality Dashboard</h1>
            <p className="mt-1 text-muted-foreground">Real-time monitoring of India's air quality indicators</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
            </span>
            Live Data
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-card overflow-hidden group cursor-pointer transition-all hover:shadow-elevated" onClick={() => navigate("/aqi-map")}>
            <div className={`h-1 w-full ${aqiBarColor(avgAQI)}`} />
            <div className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm font-medium text-muted-foreground">National Avg AQI</p>
                <p className={`font-display text-3xl font-bold ${aqiColor(avgAQI)}`}>{avgAQI}</p>
              </div>
              <div className={`rounded-xl p-3 ${aqiBg(avgAQI)}`}>
                <Wind className={`h-6 w-6 ${aqiColor(avgAQI)}`} />
              </div>
            </div>
          </Card>
          <Card className="shadow-card overflow-hidden group cursor-pointer transition-all hover:shadow-elevated" onClick={() => navigate("/toll-gates")}>
            <div className="h-1 w-full bg-primary" />
            <div className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Vehicles Tracked</p>
                <p className="font-display text-3xl font-bold text-foreground">{totalEntries}</p>
                <div className="mt-1 flex items-center gap-2 text-xs">
                  <span className="flex items-center gap-1 text-aqi-good"><TrendingUp className="h-3 w-3" /> {entering} in</span>
                  <span className="flex items-center gap-1 text-aqi-unhealthy"><TrendingDown className="h-3 w-3" /> {totalEntries - entering} out</span>
                </div>
              </div>
              <div className="rounded-xl bg-primary/10 p-3"><Truck className="h-6 w-6 text-primary" /></div>
            </div>
          </Card>
          <Card className="shadow-card overflow-hidden group cursor-pointer transition-all hover:shadow-elevated" onClick={() => navigate("/carbon-credits")}>
            <div className="h-1 w-full bg-accent" />
            <div className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Industries Monitored</p>
                <p className="font-display text-3xl font-bold text-foreground">{companies.length}</p>
              </div>
              <div className="rounded-xl bg-accent p-3"><Factory className="h-6 w-6 text-accent-foreground" /></div>
            </div>
          </Card>
          <Card className="shadow-card overflow-hidden group cursor-pointer transition-all hover:shadow-elevated" onClick={() => navigate("/carbon-credits")}>
            <div className="h-1 w-full bg-aqi-hazardous" />
            <div className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Red-Listed Companies</p>
                <p className="font-display text-3xl font-bold text-aqi-hazardous">{redCompanies}</p>
              </div>
              <div className="rounded-xl bg-aqi-hazardous/10 p-3"><Activity className="h-6 w-6 text-aqi-hazardous" /></div>
            </div>
          </Card>
        </div>

        {/* Quick Navigation */}
        <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { label: "Toll Gates", desc: "Live vehicle tracking", icon: Truck, path: "/toll-gates", color: "text-primary" },
            { label: "Carbon Credits", desc: "Company compliance", icon: Factory, path: "/carbon-credits", color: "text-aqi-moderate" },
            { label: "AQI Map", desc: "India pollution map", icon: MapPin, path: "/aqi-map", color: "text-aqi-unhealthy" },
          ].map((item) => (
            <Card key={item.label} className="shadow-card flex items-center justify-between p-4 cursor-pointer transition-all hover:shadow-elevated hover:-translate-y-0.5 group" onClick={() => navigate(item.path)}>
              <div className="flex items-center gap-3">
                <item.icon className={`h-5 w-5 ${item.color}`} />
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </Card>
          ))}
        </div>

        {/* State AQI Table */}
        <Card className="shadow-card overflow-hidden">
          <div className="flex flex-col items-start justify-between gap-4 border-b border-border p-5 sm:flex-row sm:items-center">
            <h2 className="font-display text-lg font-semibold text-foreground">State-wise AQI Overview</h2>
            <Select value={stateFilter} onValueChange={setStateFilter}>
              <SelectTrigger className="w-[200px]"><SelectValue placeholder="Filter by state" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                {indianStates.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">State</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">AQI</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Level</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredAQI.map((s) => (
                  <tr key={s.state} className="border-b border-border transition-colors hover:bg-muted/30">
                    <td className="px-5 py-3 text-sm font-medium text-foreground">{s.state}</td>
                    <td className={`px-5 py-3 font-display text-sm font-bold ${aqiColor(s.aqi)}`}>{s.aqi}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                          <div className={`h-full rounded-full ${aqiBarColor(s.aqi)}`} style={{ width: `${Math.min(100, (s.aqi / 400) * 100)}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground capitalize">{s.category}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <Badge className={`${s.aqi <= 50 ? "bg-aqi-good" : s.aqi <= 100 ? "bg-aqi-moderate" : s.aqi <= 200 ? "bg-aqi-unhealthy" : "bg-aqi-hazardous"} border-0 text-primary-foreground`}>
                        {s.aqi <= 50 ? "Good" : s.aqi <= 100 ? "Moderate" : s.aqi <= 200 ? "Unhealthy" : "Hazardous"}
                      </Badge>
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
