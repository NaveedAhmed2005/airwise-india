import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Activity, TrendingUp, TrendingDown, Factory, Truck, Wind } from "lucide-react";
import { generateVehicleEntries, companies, stateAQIData, indianStates } from "@/data/mockData";

const vehicleEntries = generateVehicleEntries(50);

export default function Dashboard() {
  const [stateFilter, setStateFilter] = useState<string>("all");

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
    aqi <= 50 ? "bg-aqi-good-soft" : aqi <= 100 ? "bg-aqi-moderate-soft" : aqi <= 200 ? "bg-aqi-unhealthy-soft" : "bg-aqi-hazardous-soft";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">Air Quality Dashboard</h1>
          <p className="mt-1 text-muted-foreground">Real-time monitoring of India's air quality indicators</p>
        </div>

        {/* Summary Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-card gradient-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">National Avg AQI</p>
                <p className={`font-display text-3xl font-bold ${aqiColor(avgAQI)}`}>{avgAQI}</p>
              </div>
              <div className={`rounded-xl p-3 ${aqiBg(avgAQI)}`}>
                <Wind className={`h-6 w-6 ${aqiColor(avgAQI)}`} />
              </div>
            </div>
          </Card>
          <Card className="shadow-card gradient-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Vehicles Tracked</p>
                <p className="font-display text-3xl font-bold text-foreground">{totalEntries}</p>
                <div className="mt-1 flex items-center gap-2 text-xs">
                  <span className="flex items-center gap-1 text-aqi-good"><TrendingUp className="h-3 w-3" /> {entering} entering</span>
                  <span className="flex items-center gap-1 text-aqi-unhealthy"><TrendingDown className="h-3 w-3" /> {totalEntries - entering} exiting</span>
                </div>
              </div>
              <div className="rounded-xl bg-accent p-3"><Truck className="h-6 w-6 text-accent-foreground" /></div>
            </div>
          </Card>
          <Card className="shadow-card gradient-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Industries Monitored</p>
                <p className="font-display text-3xl font-bold text-foreground">{companies.length}</p>
              </div>
              <div className="rounded-xl bg-accent p-3"><Factory className="h-6 w-6 text-accent-foreground" /></div>
            </div>
          </Card>
          <Card className="shadow-card gradient-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Red-Listed Companies</p>
                <p className="font-display text-3xl font-bold text-aqi-hazardous">{redCompanies}</p>
              </div>
              <div className="rounded-xl bg-aqi-hazardous-soft p-3"><Activity className="h-6 w-6 text-aqi-hazardous" /></div>
            </div>
          </Card>
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
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Category</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredAQI.map((s) => (
                  <tr key={s.state} className="border-b border-border transition-colors hover:bg-muted/30">
                    <td className="px-5 py-3 text-sm font-medium text-foreground">{s.state}</td>
                    <td className={`px-5 py-3 font-display text-sm font-bold ${aqiColor(s.aqi)}`}>{s.aqi}</td>
                    <td className="px-5 py-3 text-sm capitalize text-muted-foreground">{s.category}</td>
                    <td className="px-5 py-3">
                      <Badge className={`${s.aqi <= 50 ? "aqi-good" : s.aqi <= 100 ? "aqi-moderate" : s.aqi <= 200 ? "aqi-unhealthy" : "aqi-hazardous"} border-0 text-primary-foreground`}>
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
