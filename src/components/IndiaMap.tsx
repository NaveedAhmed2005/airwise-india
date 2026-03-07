import { useState } from "react";
import { stateAQIData } from "@/data/mockData";
import type { StateAQI } from "@/types/monitor";

// Simplified India map - state positions mapped to a coordinate grid
// Each state is positioned roughly on an India outline
const statePositions: Record<string, { x: number; y: number; w: number; h: number }> = {
  "Jammu & Kashmir": { x: 140, y: 20, w: 60, h: 45 },
  "Himachal Pradesh": { x: 170, y: 68, w: 40, h: 30 },
  "Punjab": { x: 140, y: 85, w: 35, h: 30 },
  "Chandigarh": { x: 163, y: 95, w: 15, h: 12 },
  "Uttarakhand": { x: 205, y: 70, w: 45, h: 30 },
  "Haryana": { x: 155, y: 110, w: 35, h: 30 },
  "Delhi": { x: 178, y: 118, w: 18, h: 16 },
  "Uttar Pradesh": { x: 200, y: 110, w: 80, h: 55 },
  "Rajasthan": { x: 100, y: 115, w: 70, h: 70 },
  "Gujarat": { x: 70, y: 180, w: 55, h: 65 },
  "Madhya Pradesh": { x: 160, y: 170, w: 80, h: 50 },
  "Bihar": { x: 285, y: 130, w: 45, h: 35 },
  "Jharkhand": { x: 280, y: 165, w: 45, h: 35 },
  "West Bengal": { x: 300, y: 170, w: 35, h: 65 },
  "Sikkim": { x: 310, y: 130, w: 18, h: 15 },
  "Assam": { x: 340, y: 128, w: 50, h: 25 },
  "Meghalaya": { x: 345, y: 155, w: 35, h: 18 },
  "Chhattisgarh": { x: 230, y: 200, w: 50, h: 55 },
  "Odisha": { x: 260, y: 225, w: 50, h: 45 },
  "Maharashtra": { x: 120, y: 240, w: 80, h: 50 },
  "Telangana": { x: 185, y: 270, w: 50, h: 35 },
  "Goa": { x: 115, y: 300, w: 18, h: 18 },
  "Karnataka": { x: 120, y: 305, w: 60, h: 55 },
  "Andhra Pradesh": { x: 185, y: 295, w: 55, h: 55 },
  "Tamil Nadu": { x: 170, y: 345, w: 50, h: 55 },
  "Kerala": { x: 135, y: 365, w: 28, h: 45 },
};

function getAQIColor(aqi: number) {
  if (aqi <= 50) return { fill: "hsl(152, 60%, 36%)", label: "Good" };
  if (aqi <= 100) return { fill: "hsl(45, 93%, 47%)", label: "Moderate" };
  if (aqi <= 200) return { fill: "hsl(16, 85%, 55%)", label: "Unhealthy" };
  if (aqi <= 300) return { fill: "hsl(0, 72%, 51%)", label: "Hazardous" };
  return { fill: "hsl(280, 60%, 40%)", label: "Severe" };
}

interface Props {
  filterState?: string;
}

export default function IndiaMap({ filterState }: Props) {
  const [hoveredState, setHoveredState] = useState<StateAQI | null>(null);

  const displayData = filterState && filterState !== "all"
    ? stateAQIData.filter((s) => s.state === filterState)
    : stateAQIData;

  return (
    <div className="relative">
      <svg viewBox="40 0 380 430" className="w-full h-auto" style={{ maxHeight: "600px" }}>
        {/* India outline hint */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="mapBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(220, 20%, 95%)" />
            <stop offset="100%" stopColor="hsl(220, 20%, 90%)" />
          </linearGradient>
        </defs>

        {/* State blocks */}
        {displayData.map((stateData) => {
          const pos = statePositions[stateData.state];
          if (!pos) return null;
          const color = getAQIColor(stateData.aqi);
          const isHovered = hoveredState?.state === stateData.state;

          return (
            <g
              key={stateData.state}
              onMouseEnter={() => setHoveredState(stateData)}
              onMouseLeave={() => setHoveredState(null)}
              className="cursor-pointer transition-all"
            >
              <rect
                x={pos.x}
                y={pos.y}
                width={pos.w}
                height={pos.h}
                rx={6}
                fill={color.fill}
                opacity={isHovered ? 1 : 0.85}
                stroke={isHovered ? "hsl(220, 25%, 10%)" : "hsl(0, 0%, 100%)"}
                strokeWidth={isHovered ? 2.5 : 1}
                filter={isHovered ? "url(#glow)" : undefined}
                className="transition-all duration-200"
              />
              {pos.w > 25 && (
                <>
                  <text
                    x={pos.x + pos.w / 2}
                    y={pos.y + pos.h / 2 - 4}
                    textAnchor="middle"
                    fill="white"
                    fontSize={pos.w > 50 ? "8" : "6"}
                    fontWeight="600"
                    fontFamily="'Space Grotesk', sans-serif"
                    className="pointer-events-none select-none"
                  >
                    {stateData.state.length > 12 ? stateData.state.substring(0, 10) + ".." : stateData.state}
                  </text>
                  <text
                    x={pos.x + pos.w / 2}
                    y={pos.y + pos.h / 2 + 10}
                    textAnchor="middle"
                    fill="white"
                    fontSize={pos.w > 50 ? "11" : "9"}
                    fontWeight="800"
                    fontFamily="'Space Grotesk', sans-serif"
                    className="pointer-events-none select-none"
                  >
                    {stateData.aqi}
                  </text>
                </>
              )}
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      {hoveredState && (
        <div className="absolute top-4 right-4 rounded-xl border border-border bg-card p-4 shadow-elevated animate-fade-in z-10">
          <p className="font-display text-sm font-bold text-foreground">{hoveredState.state}</p>
          <div className="mt-2 flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: getAQIColor(hoveredState.aqi).fill }}
            />
            <span className="text-xs text-muted-foreground">{getAQIColor(hoveredState.aqi).label}</span>
          </div>
          <p className="mt-1 font-display text-3xl font-black text-foreground">{hoveredState.aqi}</p>
          <p className="text-xs text-muted-foreground">Air Quality Index</p>
        </div>
      )}
    </div>
  );
}
