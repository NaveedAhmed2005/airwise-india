import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Wind, Activity, Truck, Factory, MapPin, BarChart3, Shield, Users, Target, Award, Lightbulb, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";

const modules = [
  { icon: Activity, title: "Dashboard", desc: "Central command showing national AQI, vehicle count, industry status, and red-listed companies at a glance.", path: "/dashboard", color: "text-primary" },
  { icon: Truck, title: "Toll Gate Monitoring", desc: "Real-time tracking of vehicles entering/exiting toll gates with emission risk assessment and live feed simulation.", path: "/toll-gates", color: "text-aqi-moderate" },
  { icon: Factory, title: "Carbon Credits", desc: "Monitor industrial carbon credit allocation, usage, compliance status, and government-issued fines for violations.", path: "/carbon-credits", color: "text-aqi-unhealthy" },
  { icon: MapPin, title: "AQI Map", desc: "Interactive India map with state-wise AQI visualization, color-coded from green (good) to red (hazardous).", path: "/aqi-map", color: "text-aqi-hazardous" },
  { icon: BarChart3, title: "AQI Prediction", desc: "AI-powered forecasting engine predicting future AQI trends for 1 month and 1 year based on historical patterns.", path: "/aqi-prediction", color: "text-primary" },
  { icon: BarChart3, title: "Analytics", desc: "Comprehensive charts including heatmaps, pollutant breakdowns, vehicle emissions, and environmental performance radar.", path: "/analytics", color: "text-aqi-moderate" },
];

const team = [
  { role: "Platform Vision", desc: "Built to empower citizens, governments, and industries with real-time environmental intelligence." },
  { role: "Data Sources", desc: "Aggregates data from CPCB, SPCB, toll gate sensors, industrial emission monitors, and satellite imagery." },
  { role: "Technology", desc: "React-based SPA with real-time data simulation, interactive visualizations, and predictive analytics." },
];

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Hero */}
        <div className="mb-12 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary shadow-glow-green">
            <Wind className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground">About Monitor India</h1>
          <p className="mt-3 mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
            India's comprehensive air quality monitoring and environmental intelligence platform. 
            We track, analyze, and predict air pollution across the nation to drive informed decisions 
            for a cleaner, healthier India.
          </p>
        </div>

        {/* Mission */}
        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            { icon: Target, title: "Our Mission", desc: "To provide transparent, real-time air quality data to every Indian citizen and empower governments with actionable insights for policy-making." },
            { icon: Lightbulb, title: "Our Vision", desc: "An India where every citizen breathes clean air, industries operate sustainably, and data-driven policies create lasting environmental impact." },
            { icon: Globe, title: "Our Impact", desc: "Monitoring 25+ states, 20+ toll gates, 15+ industries, and generating predictive models to forecast pollution trends months ahead." },
          ].map((item) => (
            <Card key={item.title} className="shadow-card p-6 text-center transition-all hover:shadow-elevated">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                <item.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </Card>
          ))}
        </div>

        {/* Modules */}
        <div className="mb-12">
          <h2 className="font-display text-2xl font-bold text-foreground text-center mb-2">Platform Modules</h2>
          <p className="text-center text-muted-foreground mb-8">Explore every feature of Monitor India</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((mod) => (
              <Card
                key={mod.title}
                className="shadow-card p-5 cursor-pointer transition-all hover:shadow-elevated hover:-translate-y-1 group"
                onClick={() => navigate(mod.path)}
              >
                <div className="flex items-start gap-3">
                  <mod.icon className={`h-6 w-6 ${mod.color} shrink-0 mt-0.5`} />
                  <div>
                    <h3 className="font-display text-base font-semibold text-foreground mb-1">{mod.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{mod.desc}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Data & Tech */}
        <div className="mb-12">
          <h2 className="font-display text-2xl font-bold text-foreground text-center mb-8">How It Works</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {team.map((item) => (
              <Card key={item.role} className="shadow-card p-5">
                <h3 className="font-display text-base font-semibold text-foreground mb-2">{item.role}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Key Stakeholders */}
        <Card className="shadow-card p-8 text-center">
          <h2 className="font-display text-2xl font-bold text-foreground mb-4">Who Is This For?</h2>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 mt-6">
            {[
              { icon: Users, label: "Citizens", desc: "Check real-time AQI before stepping out" },
              { icon: Shield, label: "Government", desc: "Data-driven policy enforcement" },
              { icon: Factory, label: "Industries", desc: "Carbon credit compliance tracking" },
              { icon: Award, label: "Researchers", desc: "Historical data & prediction models" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
                  <s.icon className="h-6 w-6 text-accent-foreground" />
                </div>
                <p className="font-display text-sm font-semibold text-foreground">{s.label}</p>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
