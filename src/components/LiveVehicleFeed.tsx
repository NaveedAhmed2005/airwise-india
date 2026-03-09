import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDownLeft, ArrowUpRight, Truck, Zap } from "lucide-react";
import { generateVehicleEntries } from "@/data/mockData";

export default function LiveVehicleFeed() {
  const [entries, setEntries] = useState(() => generateVehicleEntries(8));
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const newEntry = generateVehicleEntries(1)[0];
      newEntry.timestamp = new Date().toISOString();
      newEntry.id = `VE-LIVE-${Date.now()}`;
      setEntries(prev => [newEntry, ...prev.slice(0, 19)]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const riskColor = (r: string) =>
    r === "high" ? "bg-aqi-hazardous border-0 text-primary-foreground" :
    r === "moderate" ? "bg-aqi-moderate border-0 text-primary-foreground" :
    "bg-aqi-good border-0 text-primary-foreground";

  return (
    <Card className="shadow-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-border p-4">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          <h3 className="font-display text-base font-semibold text-foreground">Live Vehicle Feed</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-aqi-good opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-aqi-good" />
          </span>
          <span className="text-xs font-medium text-aqi-good">Recording</span>
        </div>
      </div>
      <div ref={containerRef} className="max-h-[400px] overflow-y-auto divide-y divide-border">
        {entries.map((v, i) => (
          <div
            key={v.id}
            className="flex items-center gap-3 px-4 py-3 transition-all hover:bg-muted/30"
            style={{
              animation: i === 0 ? "slideIn 0.5s ease-out" : undefined,
            }}
          >
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${v.direction === "entering" ? "bg-aqi-unhealthy/10" : "bg-aqi-good/10"}`}>
              {v.direction === "entering" ?
                <ArrowDownLeft className="h-4 w-4 text-aqi-unhealthy" /> :
                <ArrowUpRight className="h-4 w-4 text-aqi-good" />
              }
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-foreground">{v.vehicleNumber}</span>
                <Badge className={riskColor(v.riskLevel)} variant="secondary">{v.riskLevel}</Badge>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <Truck className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground truncate">{v.vehicleType} • {v.tollGateName}</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="font-display text-sm font-bold text-foreground">+{v.aqiImpact}</p>
              <p className="text-xs text-muted-foreground">{new Date(v.timestamp).toLocaleTimeString()}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
