import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Building2, TreePine, Heart, Shield, Leaf, Factory, Car, Droplets, Sun, Wind, Bike, Recycle, AlertTriangle } from "lucide-react";

const peoplePrecautions = [
  { icon: Heart, title: "Wear N95 Masks", desc: "Use N95 or KN95 masks when AQI exceeds 150. Regular cloth masks don't filter fine particulate matter (PM2.5).", severity: "high" },
  { icon: TreePine, title: "Plant Trees Around Homes", desc: "Trees like Neem, Peepal, and Aloe Vera are natural air purifiers. Plant at least 2-3 trees per household.", severity: "medium" },
  { icon: Car, title: "Use Public Transport / EV", desc: "Switch to public transport, carpooling, or electric vehicles to reduce personal carbon footprint by up to 60%.", severity: "high" },
  { icon: Recycle, title: "Stop Burning Waste", desc: "Never burn garbage, crop residue, or leaves. Open burning contributes to 25% of winter air pollution in North India.", severity: "high" },
  { icon: Droplets, title: "Stay Hydrated & Indoor", desc: "Drink warm water, use air purifiers indoors, and keep windows closed during high AQI days. Use wet mopping.", severity: "medium" },
  { icon: Bike, title: "Walk/Cycle Short Distances", desc: "For trips under 3 km, walk or cycle. This reduces vehicular emissions and improves personal health simultaneously.", severity: "low" },
  { icon: Sun, title: "Use Solar Energy", desc: "Install rooftop solar panels to reduce dependence on coal-based electricity. Government subsidies cover up to 40%.", severity: "medium" },
  { icon: Leaf, title: "Reduce Firecrackers", desc: "Avoid bursting firecrackers during festivals. Diwali firecrackers spike PM2.5 levels by 500-1000% in major cities.", severity: "high" },
];

const governmentSuggestions = [
  { icon: Factory, title: "Enforce Industrial Emission Norms", desc: "Strictly implement CPCB emission standards with real-time monitoring sensors on all industrial chimneys. Fine violators immediately.", severity: "high" },
  { icon: Car, title: "Expand EV Infrastructure", desc: "Set up 10,000+ EV charging stations across national highways. Provide 50% subsidy on commercial EVs for fleet operators.", severity: "high" },
  { icon: TreePine, title: "Urban Green Corridors", desc: "Create 500-meter green buffer zones around industrial areas. Mandate 33% green cover in all new urban development projects.", severity: "medium" },
  { icon: Wind, title: "Smog Towers & Air Purification", desc: "Deploy large-scale smog towers in top 20 polluted cities. Delhi's pilot reduced PM2.5 by 80% in a 1-km radius.", severity: "medium" },
  { icon: Shield, title: "Strict Vehicle Age Policy", desc: "Enforce scrapping of vehicles older than 15 years (petrol) and 10 years (diesel). Offer 15% rebate on new vehicle purchase.", severity: "high" },
  { icon: Droplets, title: "Anti Crop Burning Measures", desc: "Provide free Happy Seeder machines to farmers. Give ₹6,000/acre incentive for not burning stubble. Establish biomass power plants.", severity: "high" },
  { icon: Building2, title: "Smart City Air Monitoring", desc: "Install low-cost air quality sensors every 2 km in cities with population > 10 lakh. Real-time data should be publicly accessible.", severity: "medium" },
  { icon: Recycle, title: "Waste-to-Energy Plants", desc: "Convert all major dumping grounds to waste-to-energy plants. Target: zero open dumping in cities by 2028.", severity: "medium" },
];

const healthTips = [
  { range: "0-50 (Good)", color: "bg-aqi-good", tips: ["All activities safe outdoors", "Good day for jogging & exercise", "Keep windows open for ventilation"] },
  { range: "51-100 (Moderate)", color: "bg-aqi-moderate", tips: ["Sensitive groups should limit outdoor time", "Use air purifiers if asthmatic", "Stay hydrated"] },
  { range: "101-200 (Unhealthy)", color: "bg-aqi-unhealthy", tips: ["Avoid prolonged outdoor activities", "Wear N95 mask outside", "Use HEPA air purifiers indoors", "Keep children & elderly indoors"] },
  { range: "201-300 (Very Unhealthy)", color: "bg-aqi-hazardous", tips: ["Stay indoors with air purifiers", "Seal windows and doors", "Avoid all outdoor exercise", "Seek medical help if breathing issues"] },
  { range: "300+ (Hazardous)", color: "bg-aqi-hazardous", tips: ["Emergency level — stay indoors", "Schools should declare holiday", "Use oxygen concentrators if needed", "Govt should issue health advisory"] },
];

export default function Suggestions() {
  const severityColor = (s: string) => s === "high" ? "bg-aqi-hazardous" : s === "medium" ? "bg-aqi-moderate" : "bg-aqi-good";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">AQI Precautions & Suggestions</h1>
          <p className="mt-1 text-muted-foreground">Guidelines for citizens and government to maintain low AQI levels</p>
        </div>

        <Tabs defaultValue="people" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="people" className="gap-1.5"><Users className="h-4 w-4" /> For People</TabsTrigger>
            <TabsTrigger value="government" className="gap-1.5"><Building2 className="h-4 w-4" /> For Government</TabsTrigger>
            <TabsTrigger value="health" className="gap-1.5"><Heart className="h-4 w-4" /> Health Guide</TabsTrigger>
          </TabsList>

          <TabsContent value="people" className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {peoplePrecautions.map((item) => (
                <Card key={item.title} className="shadow-card p-5 transition-all hover:shadow-elevated hover:-translate-y-0.5">
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-primary/10 p-3 shrink-0">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-display text-base font-semibold text-foreground">{item.title}</h3>
                        <Badge className={`${severityColor(item.severity)} border-0 text-primary-foreground text-[10px]`}>{item.severity}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="government" className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {governmentSuggestions.map((item) => (
                <Card key={item.title} className="shadow-card p-5 transition-all hover:shadow-elevated hover:-translate-y-0.5">
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-accent p-3 shrink-0">
                      <item.icon className="h-6 w-6 text-accent-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-display text-base font-semibold text-foreground">{item.title}</h3>
                        <Badge className={`${severityColor(item.severity)} border-0 text-primary-foreground text-[10px]`}>{item.severity}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="health" className="space-y-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-1">
              {healthTips.map((tier) => (
                <Card key={tier.range} className="shadow-card overflow-hidden">
                  <div className={`${tier.color} px-5 py-3`}>
                    <h3 className="font-display text-lg font-bold text-primary-foreground">AQI {tier.range}</h3>
                  </div>
                  <div className="p-5">
                    <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {tier.tips.map((tip) => (
                        <li key={tip} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-foreground" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
