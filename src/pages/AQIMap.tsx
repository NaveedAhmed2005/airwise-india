import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin } from "lucide-react";
import { stateAQIData, indianStates } from "@/data/mockData";

export default function AQIMap() {
  const [stateFilter, setStateFilter] = useState("all");
  const [cityType, setCityType] = useState("all");

  const filtered = useMemo(() => {
    if (stateFilter === "all") return stateAQIData;
    return stateAQIData.filter((s) => s.state === stateFilter);
  }, [stateFilter]);

  const getColor = (aqi: number) => {
    if (aqi <= 50) return { bg: "bg-aqi-good", text: "text-primary-foreground", label: "Good" };
    if (aqi <= 100) return { bg: "bg-aqi-moderate", text: "text-primary-foreground", label: "Moderate" };
    if (aqi <= 200) return { bg: "bg-aqi-unhealthy", text: "text-primary-foreground", label: "Unhealthy" };
    if (aqi <= 300) return { bg: "bg-aqi-hazardous", text: "text-primary-foreground", label: "Hazardous" };
    return { bg: "bg-aqi-severe", text: "text-primary-foreground", label: "Severe" };
  };

  const sorted = [...filtered].sort((a, b) => b.aqi - a.aqi);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">AQI Map of India</h1>
          <p className="mt-1 text-muted-foreground">Visualize air quality across states and cities</p>
        </div>

        {/* Legend */}
        <Card className="mb-6 shadow-card p-5">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground">AQI Legend:</span>
            {[
              { label: "Good (0-50)", cls: "aqi-good" },
              { label: "Moderate (51-100)", cls: "aqi-moderate" },
              { label: "Unhealthy (101-200)", cls: "aqi-unhealthy" },
              { label: "Hazardous (201-300)", cls: "aqi-hazardous" },
              { label: "Severe (300+)", cls: "aqi-severe" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-2">
                <div className={`h-4 w-4 rounded-full ${l.cls}`} />
                <span className="text-xs text-muted-foreground">{l.label}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select value={stateFilter} onValueChange={setStateFilter}>
            <SelectTrigger><SelectValue placeholder="Filter by state" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All States</SelectItem>
              {indianStates.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={cityType} onValueChange={setCityType}>
            <SelectTrigger><SelectValue placeholder="City type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              <SelectItem value="major">Major Cities</SelectItem>
              <SelectItem value="minor">Minor Cities</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Visual Map Grid */}
        <Card className="shadow-card p-6">
          <h2 className="mb-6 font-display text-lg font-semibold text-foreground">State AQI Visualization</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {sorted.map((s) => {
              const color = getColor(s.aqi);
              return (
                <div key={s.state} className={`group relative flex flex-col items-center justify-center rounded-2xl ${color.bg} p-4 transition-all hover:scale-105 hover:shadow-elevated`}>
                  <MapPin className={`mb-1 h-5 w-5 ${color.text}`} />
                  <span className={`text-center text-xs font-semibold ${color.text}`}>{s.state}</span>
                  <span className={`font-display text-2xl font-black ${color.text}`}>{s.aqi}</span>
                  <span className={`text-xs ${color.text} opacity-80`}>{color.label}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Sorted List */}
        <Card className="mt-6 shadow-card overflow-hidden">
          <div className="border-b border-border p-5">
            <h2 className="font-display text-lg font-semibold text-foreground">Most Polluted States (Ranked)</h2>
          </div>
          <div className="divide-y divide-border">
            {sorted.map((s, i) => {
              const color = getColor(s.aqi);
              const barWidth = Math.min(100, (s.aqi / 400) * 100);
              return (
                <div key={s.state} className="flex items-center gap-4 px-5 py-3">
                  <span className="w-8 font-display text-lg font-bold text-muted-foreground">#{i + 1}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{s.state}</p>
                    <div className="mt-1 h-2 w-full rounded-full bg-muted">
                      <div className={`h-2 rounded-full ${color.bg} transition-all`} style={{ width: `${barWidth}%` }} />
                    </div>
                  </div>
                  <span className={`font-display text-lg font-bold ${s.aqi <= 50 ? "text-aqi-good" : s.aqi <= 100 ? "text-aqi-moderate" : s.aqi <= 200 ? "text-aqi-unhealthy" : "text-aqi-hazardous"}`}>{s.aqi}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
