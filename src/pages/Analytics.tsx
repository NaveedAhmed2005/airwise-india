import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, LineChart, Line, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { Activity, TrendingUp, TrendingDown, Factory, Truck, Wind, BarChart3, PieChart as PieChartIcon } from "lucide-react";
import { stateAQIData, companies, generateVehicleEntries, indianStates } from "@/data/mockData";

const vehicleEntries = generateVehicleEntries(200);

const monthlyTrend = [
  { month: "Jan", aqi: 280, vehicles: 4200, emissions: 890 },
  { month: "Feb", aqi: 250, vehicles: 3800, emissions: 820 },
  { month: "Mar", aqi: 200, vehicles: 4500, emissions: 750 },
  { month: "Apr", aqi: 160, vehicles: 4100, emissions: 600 },
  { month: "May", aqi: 130, vehicles: 3900, emissions: 520 },
  { month: "Jun", aqi: 100, vehicles: 3600, emissions: 450 },
  { month: "Jul", aqi: 85, vehicles: 3400, emissions: 380 },
  { month: "Aug", aqi: 90, vehicles: 3500, emissions: 400 },
  { month: "Sep", aqi: 120, vehicles: 3800, emissions: 500 },
  { month: "Oct", aqi: 180, vehicles: 4300, emissions: 700 },
  { month: "Nov", aqi: 260, vehicles: 4600, emissions: 850 },
  { month: "Dec", aqi: 300, vehicles: 4800, emissions: 920 },
];

const pollutantData = [
  { name: "PM2.5", value: 35, color: "hsl(0, 72%, 51%)" },
  { name: "PM10", value: 25, color: "hsl(16, 85%, 55%)" },
  { name: "NO₂", value: 15, color: "hsl(45, 93%, 47%)" },
  { name: "SO₂", value: 10, color: "hsl(152, 60%, 36%)" },
  { name: "CO", value: 8, color: "hsl(220, 25%, 50%)" },
  { name: "O₃", value: 7, color: "hsl(280, 60%, 40%)" },
];

const vehicleTypeEmissions = [
  { type: "Truck", emissions: 320, count: 45 },
  { type: "Bus", emissions: 240, count: 38 },
  { type: "Car", emissions: 150, count: 120 },
  { type: "Lorry", emissions: 280, count: 30 },
  { type: "Auto", emissions: 80, count: 55 },
  { type: "Bike", emissions: 40, count: 90 },
];

const radarData = [
  { metric: "Air Quality", current: 65, target: 90 },
  { metric: "Vehicle Compliance", current: 78, target: 95 },
  { metric: "Industry Compliance", current: 72, target: 85 },
  { metric: "Green Cover", current: 55, target: 80 },
  { metric: "Renewable Energy", current: 42, target: 75 },
  { metric: "Waste Management", current: 60, target: 85 },
];

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("yearly");

  const topPolluted = [...stateAQIData].sort((a, b) => b.aqi - a.aqi).slice(0, 10);
  const greenStates = stateAQIData.filter(s => s.aqi <= 50).length;
  const redCompanies = companies.filter(c => c.status === "red").length;
  const totalFines = companies.reduce((sum, c) => sum + c.fines.reduce((s, f) => s + f.amount, 0), 0);
  const avgAQI = Math.round(stateAQIData.reduce((a, b) => a + b.aqi, 0) / stateAQIData.length);

  const highRiskVehicles = vehicleEntries.filter(v => v.riskLevel === "high").length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Analytics Dashboard</h1>
            <p className="mt-1 text-muted-foreground">Comprehensive environmental insights & trends</p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* KPI Cards */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: "Avg National AQI", value: avgAQI, icon: Wind, change: "-8%", positive: true, color: "text-primary" },
            { label: "Green States", value: greenStates, icon: Activity, change: "+2", positive: true, color: "text-aqi-good" },
            { label: "High Risk Vehicles", value: highRiskVehicles, icon: Truck, change: "+12%", positive: false, color: "text-aqi-unhealthy" },
            { label: "Total Fines (₹)", value: `${(totalFines / 100000).toFixed(1)}L`, icon: Factory, change: `${redCompanies} red`, positive: false, color: "text-aqi-hazardous" },
          ].map((kpi) => (
            <Card key={kpi.label} className="shadow-card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{kpi.label}</p>
                  <p className={`font-display text-2xl font-bold ${kpi.color} mt-1`}>{kpi.value}</p>
                </div>
                <kpi.icon className={`h-5 w-5 ${kpi.color} opacity-40`} />
              </div>
              <div className="mt-2 flex items-center gap-1 text-xs">
                {kpi.positive ? <TrendingUp className="h-3 w-3 text-aqi-good" /> : <TrendingDown className="h-3 w-3 text-aqi-hazardous" />}
                <span className={kpi.positive ? "text-aqi-good" : "text-aqi-hazardous"}>{kpi.change}</span>
                <span className="text-muted-foreground">vs last period</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="shadow-card p-5 lg:col-span-2">
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">AQI & Emissions Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyTrend}>
                <defs>
                  <linearGradient id="aqiGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="emissionGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(152, 60%, 36%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(152, 60%, 36%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 89%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid hsl(220, 14%, 89%)" }} />
                <Legend />
                <Area type="monotone" dataKey="aqi" name="AQI" stroke="hsl(0, 72%, 51%)" fill="url(#aqiGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="emissions" name="Emissions (tons)" stroke="hsl(152, 60%, 36%)" fill="url(#emissionGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <Card className="shadow-card p-5">
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">Pollutant Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pollutantData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {pollutantData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="shadow-card p-5">
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">Top 10 Polluted States</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topPolluted} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 89%)" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="state" type="category" tick={{ fontSize: 11 }} width={120} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid hsl(220, 14%, 89%)" }} />
                <Bar dataKey="aqi" name="AQI" radius={[0, 6, 6, 0]}>
                  {topPolluted.map((entry) => (
                    <Cell key={entry.state} fill={entry.aqi > 200 ? "hsl(0, 72%, 51%)" : entry.aqi > 100 ? "hsl(16, 85%, 55%)" : "hsl(45, 93%, 47%)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="shadow-card p-5">
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">Vehicle Emissions by Type</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={vehicleTypeEmissions}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 89%)" />
                <XAxis dataKey="type" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid hsl(220, 14%, 89%)" }} />
                <Legend />
                <Bar dataKey="emissions" name="Emissions (kg CO₂)" fill="hsl(16, 85%, 55%)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="count" name="Vehicle Count" fill="hsl(152, 60%, 36%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Charts Row 3 */}
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="shadow-card p-5">
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">Environmental Performance Radar</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(220, 14%, 89%)" />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar name="Current" dataKey="current" stroke="hsl(16, 85%, 55%)" fill="hsl(16, 85%, 55%)" fillOpacity={0.3} />
                <Radar name="Target" dataKey="target" stroke="hsl(152, 60%, 36%)" fill="hsl(152, 60%, 36%)" fillOpacity={0.15} />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </Card>

          {/* Heatmap */}
          <Card className="shadow-card p-5">
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">AQI Heatmap — Monthly by State</h3>
            <div className="overflow-x-auto">
              <HeatmapGrid />
            </div>
          </Card>
        </div>

        {/* Industry Compliance Summary */}
        <Card className="shadow-card p-5">
          <h3 className="font-display text-lg font-semibold text-foreground mb-4">Industry Compliance Overview</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {["green", "yellow", "red"].map((status) => {
              const count = companies.filter(c => c.status === status).length;
              const color = status === "green" ? "bg-aqi-good" : status === "yellow" ? "bg-aqi-moderate" : "bg-aqi-hazardous";
              const label = status === "green" ? "Compliant" : status === "yellow" ? "Warning" : "Non-Compliant";
              return (
                <div key={status} className="flex items-center gap-4 rounded-xl border border-border p-4">
                  <div className={`h-12 w-12 rounded-xl ${color}/20 flex items-center justify-center`}>
                    <span className={`font-display text-xl font-bold text-foreground`}>{count}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{label}</p>
                    <div className="mt-1 flex items-center gap-1">
                      <Badge className={`${color} border-0 text-primary-foreground text-xs`}>{status}</Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

function HeatmapGrid() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const states = stateAQIData.slice(0, 10);
  const seasonalFactor = [1.3, 1.2, 1.0, 0.8, 0.65, 0.5, 0.45, 0.5, 0.6, 0.9, 1.2, 1.4];

  const getColor = (aqi: number) => {
    if (aqi <= 50) return "bg-aqi-good";
    if (aqi <= 100) return "bg-aqi-moderate";
    if (aqi <= 200) return "bg-aqi-unhealthy";
    return "bg-aqi-hazardous";
  };

  const getOpacity = (aqi: number) => {
    const norm = Math.min(aqi / 400, 1);
    return 0.3 + norm * 0.7;
  };

  return (
    <table className="w-full text-xs">
      <thead>
        <tr>
          <th className="text-left py-1.5 px-2 text-muted-foreground font-medium">State</th>
          {months.map(m => <th key={m} className="py-1.5 px-1 text-center text-muted-foreground font-medium">{m}</th>)}
        </tr>
      </thead>
      <tbody>
        {states.map((state) => (
          <tr key={state.state}>
            <td className="py-1 px-2 font-medium text-foreground truncate max-w-[100px]">{state.state}</td>
            {seasonalFactor.map((factor, i) => {
              const val = Math.round(state.aqi * factor * (0.85 + Math.random() * 0.3));
              return (
                <td key={i} className="py-1 px-0.5">
                  <div
                    className={`${getColor(val)} rounded-sm h-7 w-full flex items-center justify-center text-primary-foreground font-bold`}
                    style={{ opacity: getOpacity(val) }}
                    title={`${state.state} - ${months[i]}: AQI ${val}`}
                  >
                    {val}
                  </div>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
