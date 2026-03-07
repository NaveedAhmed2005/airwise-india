import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Wind, Activity, Factory, MapPin, ArrowRight, Shield, Truck, Award, ChevronRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    { icon: Activity, title: "Real-time AQI", desc: "Track air quality across every Indian state with live data visualization", color: "text-aqi-good", bg: "bg-aqi-good/10" },
    { icon: Truck, title: "Toll Gate Monitor", desc: "Monitor vehicle emissions at highways — entering, exiting, risk levels", color: "text-aqi-moderate", bg: "bg-aqi-moderate/10" },
    { icon: Award, title: "Carbon Credits", desc: "Track industrial carbon certificates, compliance status, and fines", color: "text-primary", bg: "bg-primary/10" },
    { icon: MapPin, title: "Interactive Map", desc: "Visualize pollution hotspots across India with state-wise AQI mapping", color: "text-aqi-unhealthy", bg: "bg-aqi-unhealthy/10" },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Hero Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="Indian city skyline with pollution haze" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/80 via-foreground/60 to-foreground/95" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-5 md:px-12">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-glow-green">
              <Wind className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-display text-2xl font-bold text-primary-foreground">
              Monitor India
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground"
              onClick={() => navigate("/dashboard")}
            >
              Explore
            </Button>
            <Button
              size="sm"
              className="gap-1.5 bg-primary/90 hover:bg-primary"
              onClick={() => navigate("/login")}
            >
              <Shield className="h-4 w-4" /> Official Login
            </Button>
          </div>
        </header>

        {/* Hero */}
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <div className="animate-fade-in mb-6 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className="text-sm font-medium text-primary">Real-time Air Quality Monitoring</span>
          </div>

          <h1 className="animate-fade-in font-display text-5xl font-black leading-tight text-primary-foreground md:text-7xl lg:text-8xl" style={{ animationDelay: "0.15s" }}>
            Breathe <span className="text-gradient-green">Aware</span>
            <br />
            <span className="text-primary-foreground/60">Live Better</span>
          </h1>

          <p className="mt-6 max-w-2xl animate-fade-in text-lg text-primary-foreground/50 md:text-xl" style={{ animationDelay: "0.3s", opacity: 0 }}>
            India's comprehensive air quality monitoring platform. Track vehicle emissions at toll gates, monitor industrial carbon credits, and visualize AQI across every state.
          </p>

          <div className="mt-10 flex animate-fade-in flex-col items-center gap-4 sm:flex-row" style={{ animationDelay: "0.45s", opacity: 0 }}>
            <Button
              size="lg"
              className="h-14 gap-2 rounded-xl bg-primary px-8 text-lg font-semibold text-primary-foreground shadow-glow-green hover:bg-primary/90"
              onClick={() => navigate("/dashboard")}
            >
              Get Started <ArrowRight className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="h-14 rounded-xl px-8 text-lg text-primary-foreground/60 hover:bg-primary-foreground/10 hover:text-primary-foreground"
              onClick={() => navigate("/aqi-map")}
            >
              View AQI Map
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid animate-fade-in grid-cols-1 gap-4 sm:grid-cols-3" style={{ animationDelay: "0.6s", opacity: 0 }}>
            {[
              { icon: MapPin, label: "Toll Gates Monitored", value: "20+" },
              { icon: Factory, label: "Industries Tracked", value: "15+" },
              { icon: Activity, label: "States Covered", value: "25+" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-2 rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 px-8 py-5 backdrop-blur-md">
                <stat.icon className="h-5 w-5 text-primary" />
                <span className="font-display text-3xl font-bold text-primary-foreground">{stat.value}</span>
                <span className="text-sm text-primary-foreground/40">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="relative bg-background/95 backdrop-blur-xl border-t border-border">
          <div className="container mx-auto px-6 py-16">
            <h2 className="font-display text-2xl font-bold text-foreground text-center mb-2">Platform Features</h2>
            <p className="text-center text-muted-foreground mb-10">Everything you need to monitor India's air quality</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((f) => (
                <Card key={f.title} className="shadow-card p-6 group cursor-pointer transition-all hover:shadow-elevated hover:-translate-y-1">
                  <div className={`rounded-xl ${f.bg} p-3 w-fit mb-4`}>
                    <f.icon className={`h-6 w-6 ${f.color}`} />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-1">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore <ChevronRight className="h-4 w-4" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
