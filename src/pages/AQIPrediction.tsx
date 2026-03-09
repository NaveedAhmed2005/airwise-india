import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Brain, Calendar, AlertTriangle, BarChart3, ArrowRight } from "lucide-react";
import { stateAQIData, indianStates } from "@/data/mockData";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, Legend, BarChart, Bar } from "recharts";

// Generate historical + predicted data
function generateAQITimeline(currentAQI: number) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonth = new Date().getMonth();
  const data: { month: string; actual?: number; predicted?: number; type: string }[] = [];

  // Past 6 months (actual)
  for (let i = 5; i >= 0; i--) {
    const idx = (currentMonth - i + 12) % 12;
    const seasonFactor = [1.3, 1.2, 1.0, 0.8, 0.7, 0.6, 0.5, 0.6, 0.7, 0.9, 1.2, 1.4][idx];
    const noise = 0.85 + Math.random() * 0.3;
    data.push({
      month: months[idx],
      actual: Math.round(currentAQI * seasonFactor * noise),
      type: "actual",
    });
  }

  // Current month
  data.push({ month: months[currentMonth], actual: currentAQI, predicted: currentAQI, type: "current" });

  // Next 12 months (predicted) — with slight upward trend
  for (let i = 1; i <= 12; i++) {
    const idx = (currentMonth + i) % 12;
    const seasonFactor = [1.3, 1.2, 1.0, 0.8, 0.7, 0.6, 0.5, 0.6, 0.7, 0.9, 1.2, 1.4][idx];
    const trendFactor = 1 + i * 0.008; // slight upward trend
    const noise = 0.9 + Math.random() * 0.2;
    data.push({
      month: `${months[idx]}'${(new Date().getFullYear() + (currentMonth + i > 11 ? 1 : 0)).toString().slice(-2)}`,
      predicted: Math.round(currentAQI * seasonFactor * trendFactor * noise),
      type: "predicted",
    });
  }

  return data;
}

function get1MonthPrediction(currentAQI: number) {
  const nextMonthIdx = (new Date().getMonth() + 1) % 12;
  const seasonFactor = [1.3, 1.2, 1.0, 0.8, 0.7, 0.6, 0.5, 0.6, 0.7, 0.9, 1.2, 1.4][nextMonthIdx];
  return Math.round(currentAQI * seasonFactor * (0.95 + Math.random() * 0.1));
}

function get1YearPrediction(currentAQI: number) {
  return Math.round(currentAQI * (1.05 + Math.random() * 0.1));
}

const getColor = (aqi: number) => {
  if (aqi <= 50) return { label: "Good", cls: "text-aqi-good", bg: "bg-aqi-good", bgLight: "bg-aqi-good/10" };
  if (aqi <= 100) return { label: "Moderate", cls: "text-aqi-moderate", bg: "bg-aqi-moderate", bgLight: "bg-aqi-moderate/10" };
  if (aqi <= 200) return { label: "Unhealthy", cls: "text-aqi-unhealthy", bg: "bg-aqi-unhealthy", bgLight: "bg-aqi-unhealthy/10" };
  if (aqi <= 300) return { label: "Hazardous", cls: "text-aqi-hazardous", bg: "bg-aqi-hazardous", bgLight: "bg-aqi-hazardous/10" };
  return { label: "Severe", cls: "text-aqi-severe", bg: "bg-aqi-severe", bgLight: "bg-aqi-severe/10" };
};

export default function AQIPrediction() {
  const [selectedState, setSelectedState] = useState("all");

  const statesData = useMemo(() => {
    const base = selectedState === "all" ? stateAQIData : stateAQIData.filter(s => s.state === selectedState);
    return base.map(s => ({
      ...s,
      timeline: generateAQITimeline(s.aqi),
      oneMonth: get1MonthPrediction(s.aqi),
      oneYear: get1YearPrediction(s.aqi),
    }));
  }, [selectedState]);

  const nationalAvg = Math.round(stateAQIData.reduce((a, b) => a + b.aqi, 0) / stateAQIData.length);
  const nationalTimeline = useMemo(() => generateAQITimeline(nationalAvg), []);
  const national1M = get1MonthPrediction(nationalAvg);
  const national1Y = get1YearPrediction(nationalAvg);

  // Comparison bar chart data
  const comparisonData = useMemo(() => {
    return stateAQIData
      .map(s => ({
        state: s.state.length > 12 ? s.state.substring(0, 10) + "…" : s.state,
        current: s.aqi,
        predicted: get1YearPrediction(s.aqi),
      }))
      .sort((a, b) => b.predicted - a.predicted)
      .slice(0, 10);
  }, []);

  const displayTimeline = selectedState === "all" ? nationalTimeline : statesData[0]?.timeline || [];
  const displayCurrent = selectedState === "all" ? nationalAvg : (statesData[0]?.aqi || 0);
  const display1M = selectedState === "all" ? national1M : (statesData[0]?.oneMonth || 0);
  const display1Y = selectedState === "all" ? national1Y : (statesData[0]?.oneYear || 0);
  const change1M = display1M - displayCurrent;
  const change1Y = display1Y - displayCurrent;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Brain className="h-8 w-8 text-primary" />
              <h1 className="font-display text-3xl font-bold text-foreground">AQI Prediction</h1>
            </div>
            <p className="text-muted-foreground">AI-powered air quality forecasting based on historical trends & seasonal patterns</p>
          </div>
          <Select value={selectedState} onValueChange={setSelectedState}>
            <SelectTrigger className="w-full sm:w-[250px]"><SelectValue placeholder="Select state" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">National Average</SelectItem>
              {indianStates.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Prediction Summary Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="shadow-card overflow-hidden">
            <div className={`h-1.5 w-full ${getColor(displayCurrent).bg}`} />
            <div className="p-5">
              <p className="text-sm text-muted-foreground mb-1">Current AQI</p>
              <div className="flex items-end gap-3">
                <span className={`font-display text-4xl font-black ${getColor(displayCurrent).cls}`}>{displayCurrent}</span>
                <Badge className={`${getColor(displayCurrent).bg} border-0 text-primary-foreground mb-1`}>{getColor(displayCurrent).label}</Badge>
              </div>
            </div>
          </Card>

          <Card className="shadow-card overflow-hidden">
            <div className={`h-1.5 w-full ${getColor(display1M).bg}`} />
            <div className="p-5">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">1 Month Prediction</p>
              </div>
              <div className="flex items-end gap-3">
                <span className={`font-display text-4xl font-black ${getColor(display1M).cls}`}>{display1M}</span>
                <span className={`flex items-center gap-1 text-sm font-semibold mb-1 ${change1M > 0 ? "text-aqi-hazardous" : "text-aqi-good"}`}>
                  {change1M > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  {change1M > 0 ? "+" : ""}{change1M}
                </span>
              </div>
            </div>
          </Card>

          <Card className="shadow-card overflow-hidden">
            <div className={`h-1.5 w-full ${getColor(display1Y).bg}`} />
            <div className="p-5">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">1 Year Prediction</p>
              </div>
              <div className="flex items-end gap-3">
                <span className={`font-display text-4xl font-black ${getColor(display1Y).cls}`}>{display1Y}</span>
                <span className={`flex items-center gap-1 text-sm font-semibold mb-1 ${change1Y > 0 ? "text-aqi-hazardous" : "text-aqi-good"}`}>
                  {change1Y > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  {change1Y > 0 ? "+" : ""}{change1Y}
                </span>
              </div>
              {change1Y > 30 && (
                <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-aqi-hazardous/10 px-3 py-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-aqi-hazardous" />
                  <span className="text-xs font-medium text-aqi-hazardous">Warning: Significant AQI increase projected</span>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Timeline Chart */}
        <Card className="shadow-card p-6 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h2 className="font-display text-lg font-semibold text-foreground">
              AQI Trend & Forecast — {selectedState === "all" ? "National Average" : selectedState}
            </h2>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={displayTimeline} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="predictGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--aqi-hazardous))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--aqi-hazardous))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Legend />
                <Area type="monotone" dataKey="actual" name="Actual AQI" stroke="hsl(var(--primary))" fill="url(#actualGrad)" strokeWidth={2.5} dot={{ r: 3 }} connectNulls={false} />
                <Area type="monotone" dataKey="predicted" name="Predicted AQI" stroke="hsl(var(--aqi-hazardous))" fill="url(#predictGrad)" strokeWidth={2.5} strokeDasharray="8 4" dot={{ r: 3 }} connectNulls={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* State Comparison */}
        <Card className="shadow-card p-6 mb-6">
          <h2 className="font-display text-lg font-semibold text-foreground mb-6">Top 10 Most Polluted — 1 Year Projection</h2>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="state" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} angle={-25} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                <Legend />
                <Bar dataKey="current" name="Current AQI" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="predicted" name="Predicted (1yr)" fill="hsl(var(--aqi-hazardous))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* State cards with predictions */}
        <Card className="shadow-card p-6">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">State-wise Predictions</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(selectedState === "all" ? stateAQIData : stateAQIData.filter(s => s.state === selectedState))
              .sort((a, b) => b.aqi - a.aqi)
              .map(s => {
                const pred1M = get1MonthPrediction(s.aqi);
                const pred1Y = get1YearPrediction(s.aqi);
                const color = getColor(s.aqi);
                const predColor = getColor(pred1Y);
                return (
                  <div key={s.state} className="flex items-center gap-4 rounded-xl border border-border p-4 transition-all hover:shadow-card">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color.bgLight}`}>
                      <span className={`font-display text-lg font-black ${color.cls}`}>{s.aqi}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{s.state}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-muted-foreground">1M: <span className={`font-bold ${getColor(pred1M).cls}`}>{pred1M}</span></span>
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">1Y: <span className={`font-bold ${predColor.cls}`}>{pred1Y}</span></span>
                      </div>
                    </div>
                    <Badge className={`${predColor.bg} border-0 text-primary-foreground text-xs`}>{predColor.label}</Badge>
                  </div>
                );
              })}
          </div>
        </Card>
      </div>
    </div>
  );
}
