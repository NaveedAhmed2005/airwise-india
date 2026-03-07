import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Wind, Activity, Factory, MapPin, ArrowRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Hero Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="Indian city skyline with pollution haze" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/60 to-foreground/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-5 md:px-12">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-glow-green">
              <Wind className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-display text-2xl font-bold text-primary-foreground">
              Monitor India
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground"
            onClick={() => navigate("/login")}
          >
            Official Login
          </Button>
        </header>

        {/* Hero */}
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <div className="animate-fade-in mb-6 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 backdrop-blur-sm">
            <Activity className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Real-time Air Quality Monitoring</span>
          </div>

          <h1 className="animate-fade-in font-display text-5xl font-black leading-tight text-primary-foreground md:text-7xl lg:text-8xl" style={{ animationDelay: "0.15s" }}>
            Breathe <span className="text-gradient-green">Aware</span>
            <br />
            <span className="text-primary-foreground/70">Live Better</span>
          </h1>

          <p className="mt-6 max-w-2xl animate-fade-in text-lg text-primary-foreground/60 md:text-xl" style={{ animationDelay: "0.3s", opacity: 0 }}>
            India's comprehensive air quality monitoring platform. Track vehicle emissions at toll gates, monitor industrial carbon credits, and visualize AQI across every state and city.
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
              className="h-14 rounded-xl px-8 text-lg text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground"
              onClick={() => navigate("/aqi-map")}
            >
              View AQI Map
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-20 grid animate-fade-in grid-cols-1 gap-6 sm:grid-cols-3" style={{ animationDelay: "0.6s", opacity: 0 }}>
            {[
              { icon: MapPin, label: "Toll Gates Monitored", value: "12+" },
              { icon: Factory, label: "Industries Tracked", value: "15+" },
              { icon: Activity, label: "States Covered", value: "25+" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-2 rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 px-8 py-5 backdrop-blur-sm">
                <stat.icon className="h-5 w-5 text-primary" />
                <span className="font-display text-3xl font-bold text-primary-foreground">{stat.value}</span>
                <span className="text-sm text-primary-foreground/50">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
