import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Scale, Clock, ArrowRight, CheckCircle2, Calendar, FileText, Target, Zap } from "lucide-react";

const existingPolicies = [
  {
    title: "National Clean Air Programme (NCAP)",
    year: "2019",
    status: "active",
    desc: "Targets 40% reduction in PM2.5 and PM10 by 2025-26 in 131 non-attainment cities. Budget of ₹10,566 crore allocated.",
    impact: "PM2.5 reduced by 25% in 95 cities since implementation.",
  },
  {
    title: "Bharat Stage VI Emission Standards",
    year: "2020",
    status: "active",
    desc: "World-class vehicle emission norms equivalent to Euro 6. Mandatory for all new vehicles sold in India.",
    impact: "Reduced NOx emissions from vehicles by 70% and PM by 80%.",
  },
  {
    title: "FAME II — EV Subsidy Scheme",
    year: "2019",
    status: "active",
    desc: "₹10,000 crore scheme for faster adoption of electric vehicles. Subsidies up to ₹1.5 lakh for electric 2-wheelers and ₹3 lakh for 4-wheelers.",
    impact: "Over 8 lakh EVs registered under the scheme.",
  },
  {
    title: "Commission for Air Quality Management (CAQM)",
    year: "2021",
    status: "active",
    desc: "Statutory body for NCR air quality management. Can ban activities, impose fines up to ₹1 crore, and close polluting industries.",
    impact: "GRAP stages activated 12 times in 2024-25 Delhi NCR.",
  },
  {
    title: "National Action Plan on Climate Change (NAPCC)",
    year: "2008",
    status: "active",
    desc: "Eight national missions including Solar, Enhanced Energy Efficiency, Sustainable Habitat, and Green India.",
    impact: "Solar capacity grew from 10 MW (2010) to 73 GW (2024).",
  },
  {
    title: "Perform, Achieve and Trade (PAT) Scheme",
    year: "2012",
    status: "active",
    desc: "Market-based mechanism for energy efficiency in industries. Covers 13 sectors including thermal power, cement, and steel.",
    impact: "26.7 million TOE energy savings achieved across 6 cycles.",
  },
];

const upcomingPolicies = [
  {
    title: "Carbon Credit Trading Scheme (CCTS)",
    expectedYear: "2026",
    status: "upcoming",
    desc: "India's first domestic carbon market. Mandatory for large emitters to buy/sell carbon credits. Expected to reduce emissions by 33-35% by 2030.",
    stage: "Draft notification issued",
  },
  {
    title: "Zero Emission Zone Policy",
    expectedYear: "2027",
    status: "upcoming",
    desc: "Major city centers will be declared zero-emission zones. Only electric vehicles allowed. Phase 1: Delhi, Mumbai, Bengaluru, Chennai.",
    stage: "Under consultation",
  },
  {
    title: "National EV Policy 2.0",
    expectedYear: "2026",
    status: "upcoming",
    desc: "Target: 30% EV sales by 2030. Mandatory EV charging in all new buildings. Battery swapping infrastructure in 100 cities.",
    stage: "Cabinet approval pending",
  },
  {
    title: "Clean Air Act India",
    expectedYear: "2027",
    status: "upcoming",
    desc: "Comprehensive legislation modeled on the US Clean Air Act. Legally binding air quality standards with citizen right to clean air.",
    stage: "Parliamentary standing committee review",
  },
  {
    title: "Green Hydrogen Mission Phase II",
    expectedYear: "2026",
    status: "upcoming",
    desc: "Scale green hydrogen production to 10 MMT by 2030. Mandatory hydrogen blending in industrial processes. ₹19,744 crore outlay.",
    stage: "DPR preparation",
  },
  {
    title: "Stubble Burning Elimination Act",
    expectedYear: "2026",
    status: "upcoming",
    desc: "Complete ban on crop residue burning with legal penalties. Government to provide 100% subsidized Happy Seeder machines and biomass collection.",
    stage: "Draft bill prepared",
  },
];

export default function Policies() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">Government Policies</h1>
          <p className="mt-1 text-muted-foreground">Current and upcoming environmental policies shaping India's air quality future</p>
        </div>

        <Tabs defaultValue="current" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-sm">
            <TabsTrigger value="current" className="gap-1.5"><Scale className="h-4 w-4" /> Current Policies</TabsTrigger>
            <TabsTrigger value="upcoming" className="gap-1.5"><Clock className="h-4 w-4" /> Upcoming</TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="space-y-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {existingPolicies.map((policy) => (
                <Card key={policy.title} className="shadow-card overflow-hidden transition-all hover:shadow-elevated">
                  <div className="h-1 w-full bg-primary" />
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary shrink-0" />
                        <h3 className="font-display text-base font-semibold text-foreground">{policy.title}</h3>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant="outline" className="text-xs"><Calendar className="h-3 w-3 mr-1" />{policy.year}</Badge>
                        <Badge className="bg-aqi-good border-0 text-primary-foreground text-xs">Active</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">{policy.desc}</p>
                    <div className="flex items-start gap-2 rounded-lg bg-accent p-3">
                      <CheckCircle2 className="h-4 w-4 text-accent-foreground mt-0.5 shrink-0" />
                      <p className="text-xs font-medium text-accent-foreground">{policy.impact}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {upcomingPolicies.map((policy) => (
                <Card key={policy.title} className="shadow-card overflow-hidden transition-all hover:shadow-elevated">
                  <div className="h-1 w-full bg-aqi-moderate" />
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-aqi-moderate shrink-0" />
                        <h3 className="font-display text-base font-semibold text-foreground">{policy.title}</h3>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant="outline" className="text-xs"><Zap className="h-3 w-3 mr-1" />{policy.expectedYear}</Badge>
                        <Badge className="bg-aqi-moderate border-0 text-primary-foreground text-xs">Upcoming</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">{policy.desc}</p>
                    <div className="flex items-center gap-2 rounded-lg border border-border p-3">
                      <ArrowRight className="h-4 w-4 text-aqi-moderate shrink-0" />
                      <p className="text-xs font-medium text-foreground">Stage: {policy.stage}</p>
                    </div>
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
