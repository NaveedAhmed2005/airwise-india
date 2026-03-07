import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Globe, TrendingUp, TrendingDown, Wind } from "lucide-react";
import { stateAQIData, indianStates } from "@/data/mockData";
import IndiaMap from "@/components/IndiaMap";

export default function AQIMap() {
  const [stateFilter, setStateFilter] = useState("all");

  const filtered = useMemo(() => {
    if (stateFilter === "all") return stateAQIData;
    return stateAQIData.filter((s) => s.state === stateFilter);
  }, [stateFilter]);

  const getColor = (aqi: number) => {
    if (aqi <= 50) return { bg: "bg-aqi-good", text: "text-primary-foreground", label: "Good", textColor: "text-aqi-good" };
    if (aqi <= 100) return { bg: "bg-aqi-moderate", text: "text-primary-foreground", label: "Moderate", textColor: "text-aqi-moderate" };
    if (aqi <= 200) return { bg: "bg-aqi-unhealthy", text: "text-primary-foreground", label: "Unhealthy", textColor: "text-aqi-unhealthy" };
    if (aqi <= 300) return { bg: "bg-aqi-hazardous", text: "text-primary-foreground", label: "Hazardous", textColor: "text-aqi-hazardous" };
    return { bg: "bg-aqi-severe", text: "text-primary-foreground", label: "Severe", textColor: "text-aqi-severe" };
  };

  const sorted = [...filtered].sort((a, b) => b.aqi - a.aqi);
  const avgAQI = Math.round(filtered.reduce((a, b) => a + b.aqi, 0) / filtered.length);
  const worst = sorted[0];
  const best = sorted[sorted.length - 1];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">AQI Map of India</h1>
          <p className="mt-1 text-muted-foreground">Visualize air quality across states and cities</p>
        </div>

        {/* Stats row */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="shadow-card overflow-hidden">
            <div className="h-1 w-full bg-primary" />
            <div className="flex items-center gap-4 p-5">
              <div className="rounded-xl bg-primary/10 p-3"><Wind className="h-6 w-6 text-primary" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Average AQI</p>
                <p className={`font-display text-2xl font-bold ${getColor(avgAQI).textColor}`}>{avgAQI}</p>
              </div>
            </div>
          </Card>
          <Card className="shadow-card overflow-hidden">
            <div className="h-1 w-full bg-aqi-hazardous" />
            <div className="flex items-center gap-4 p-5">
              <div className="rounded-xl bg-aqi-hazardous/10 p-3"><TrendingUp className="h-6 w-6 text-aqi-hazardous" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Most Polluted</p>
                <p className="font-display text-lg font-bold text-foreground">{worst?.state} <span className="text-aqi-hazardous">({worst?.aqi})</span></p>
              </div>
            </div>
          </Card>
          <Card className="shadow-card overflow-hidden">
            <div className="h-1 w-full bg-aqi-good" />
            <div className="flex items-center gap-4 p-5">
              <div className="rounded-xl bg-aqi-good/10 p-3"><TrendingDown className="h-6 w-6 text-aqi-good" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Cleanest State</p>
                <p className="font-display text-lg font-bold text-foreground">{best?.state} <span className="text-aqi-good">({best?.aqi})</span></p>
              </div>
            </div>
          </Card>
        </div>

        {/* Legend */}
        <Card className="mb-6 shadow-card p-5">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground">AQI Legend:</span>
            {[
              { label: "Good (0-50)", cls: "bg-aqi-good" },
              { label: "Moderate (51-100)", cls: "bg-aqi-moderate" },
              { label: "Unhealthy (101-200)", cls: "bg-aqi-unhealthy" },
              { label: "Hazardous (201-300)", cls: "bg-aqi-hazardous" },
              { label: "Severe (300+)", cls: "bg-aqi-severe" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-2">
                <div className={`h-4 w-4 rounded-full ${l.cls}`} />
                <span className="text-xs text-muted-foreground">{l.label}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Filter */}
        <div className="mb-6">
          <Select value={stateFilter} onValueChange={setStateFilter}>
            <SelectTrigger className="w-full sm:w-[250px]"><SelectValue placeholder="Filter by state" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All States</SelectItem>
              {indianStates.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Map + List layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* India Map */}
          <Card className="shadow-card p-6">
            <div className="mb-4 flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              <h2 className="font-display text-lg font-semibold text-foreground">India AQI Map</h2>
            </div>
            <IndiaMap filterState={stateFilter} />
          </Card>

          {/* Ranked List */}
          <Card className="shadow-card overflow-hidden">
            <div className="border-b border-border p-5">
              <h2 className="font-display text-lg font-semibold text-foreground">States Ranked by Pollution</h2>
              <p className="mt-1 text-xs text-muted-foreground">Highest to lowest AQI</p>
            </div>
            <div className="divide-y divide-border max-h-[550px] overflow-y-auto">
              {sorted.map((s, i) => {
                const color = getColor(s.aqi);
                const barWidth = Math.min(100, (s.aqi / 400) * 100);
                return (
                  <div key={s.state} className="flex items-center gap-4 px-5 py-3 transition-colors hover:bg-muted/30">
                    <span className="w-8 font-display text-lg font-bold text-muted-foreground">#{i + 1}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground">{s.state}</p>
                        <span className={`text-xs font-medium ${color.textColor}`}>{color.label}</span>
                      </div>
                      <div className="mt-1 h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div className={`h-2 rounded-full ${color.bg} transition-all duration-500`} style={{ width: `${barWidth}%` }} />
                      </div>
                    </div>
                    <span className={`font-display text-lg font-bold ${color.textColor}`}>{s.aqi}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Grid visualization */}
        <Card className="shadow-card p-6 mt-6">
          <h2 className="mb-6 font-display text-lg font-semibold text-foreground">State AQI at a Glance</h2>
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
      </div>
    </div>
  );
}
