import { useState, useCallback } from "react";
import { stateAQIData } from "@/data/mockData";
import type { StateAQI } from "@/types/monitor";

// @ts-ignore
import ReactDatamaps from "react-india-states-map";

function getAQIColor(aqi: number) {
  if (aqi <= 50) return { fill: "#22c55e", label: "Good" };
  if (aqi <= 100) return { fill: "#eab308", label: "Moderate" };
  if (aqi <= 200) return { fill: "#f97316", label: "Unhealthy" };
  if (aqi <= 300) return { fill: "#ef4444", label: "Hazardous" };
  return { fill: "#7c3aed", label: "Severe" };
}

// Map our state names to react-india-states-map state names
const stateNameMap: Record<string, string> = {
  "Jammu & Kashmir": "Jammu & Kashmir",
  "Himachal Pradesh": "Himachal Pradesh",
  "Punjab": "Punjab",
  "Chandigarh": "Chandigarh",
  "Uttarakhand": "Uttarakhand",
  "Haryana": "Haryana",
  "Delhi": "Delhi",
  "Uttar Pradesh": "Uttar Pradesh",
  "Rajasthan": "Rajasthan",
  "Gujarat": "Gujarat",
  "Madhya Pradesh": "Madhya Pradesh",
  "Bihar": "Bihar",
  "Jharkhand": "Jharkhand",
  "West Bengal": "West Bengal",
  "Sikkim": "Sikkim",
  "Assam": "Assam",
  "Meghalaya": "Meghalaya",
  "Chhattisgarh": "Chhattisgarh",
  "Odisha": "Odisha",
  "Maharashtra": "Maharashtra",
  "Telangana": "Telangana",
  "Goa": "Goa",
  "Karnataka": "Karnataka",
  "Andhra Pradesh": "Andhra Pradesh",
  "Tamil Nadu": "Tamil Nadu",
  "Kerala": "Kerala",
};

interface Props {
  filterState?: string;
}

export default function IndiaMap({ filterState }: Props) {
  const [activeState, setActiveState] = useState<{ name: string; aqi: number; label: string } | null>(null);

  // Build regionData for the library
  const regionData: Record<string, { value: number }> = {};
  stateAQIData.forEach((s) => {
    const mapped = stateNameMap[s.state];
    if (mapped) {
      regionData[mapped] = { value: s.aqi };
    }
  });

  const handleStateHover = useCallback((value: any) => {
    if (value && value.name) {
      const found = stateAQIData.find(
        (s) => stateNameMap[s.state] === value.name || s.state === value.name
      );
      if (found) {
        const color = getAQIColor(found.aqi);
        setActiveState({ name: found.state, aqi: found.aqi, label: color.label });
      }
    }
  }, []);

  // Determine color for highlighted state
  const getStateColor = () => {
    if (filterState && filterState !== "all") {
      const found = stateAQIData.find((s) => s.state === filterState);
      if (found) return getAQIColor(found.aqi).fill;
    }
    if (activeState) return getAQIColor(activeState.aqi).fill;
    return "#22c55e";
  };

  // Build active state object for the library
  const getActiveStateData = () => {
    if (filterState && filterState !== "all") {
      const mapped = stateNameMap[filterState];
      if (mapped) return { data: regionData[mapped], name: mapped };
    }
    return undefined;
  };

  return (
    <div className="relative">
      <div className="india-map-wrapper">
        <ReactDatamaps
          regionData={regionData}
          mapLayout={{
            hoverTitle: "AQI",
            noDataColor: "#e2e8f0",
            borderColor: "#ffffff",
            hoverColor: getStateColor(),
            hoverBorderColor: "#1e293b",
          }}
          hoverComponent={({ value }: any) => {
            if (!value || !value.name) return null;
            const found = stateAQIData.find(
              (s) => stateNameMap[s.state] === value.name || s.state === value.name
            );
            if (!found) return null;
            const color = getAQIColor(found.aqi);
            return (
              <div className="rounded-lg border border-border bg-card p-3 shadow-elevated">
                <p className="font-display text-sm font-bold text-foreground">{found.state}</p>
                <div className="mt-1 flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: color.fill }} />
                  <span className="text-xs text-muted-foreground">{color.label}</span>
                </div>
                <p className="mt-1 font-display text-2xl font-black" style={{ color: color.fill }}>
                  {found.aqi}
                </p>
              </div>
            );
          }}
          activeState={getActiveStateData()}
          onClick={(value: any) => handleStateHover(value)}
        />
      </div>

      {/* Active state info panel */}
      {activeState && (
        <div className="absolute bottom-4 left-4 rounded-xl border border-border bg-card/95 backdrop-blur-sm p-4 shadow-elevated animate-fade-in z-10">
          <p className="font-display text-sm font-bold text-foreground">{activeState.name}</p>
          <div className="mt-1 flex items-center gap-2">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: getAQIColor(activeState.aqi).fill }} />
            <span className="text-xs text-muted-foreground">{activeState.label}</span>
          </div>
          <p className="mt-1 font-display text-3xl font-black" style={{ color: getAQIColor(activeState.aqi).fill }}>
            {activeState.aqi}
          </p>
        </div>
      )}
    </div>
  );
}
