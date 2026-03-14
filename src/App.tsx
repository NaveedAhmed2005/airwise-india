import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { HubProvider } from "@/contexts/HubContext";
import Chatbot from "@/components/Chatbot";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import TollGates from "./pages/TollGates";
import CarbonCredits from "./pages/CarbonCredits";
import AQIMap from "./pages/AQIMap";
import AQIPrediction from "./pages/AQIPrediction";
import Analytics from "./pages/Analytics";
import Suggestions from "./pages/Suggestions";
import Policies from "./pages/Policies";
import About from "./pages/About";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import CollectorHub from "./pages/CollectorHub";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/toll-gates" element={<TollGates />} />
            <Route path="/carbon-credits" element={<CarbonCredits />} />
            <Route path="/aqi-map" element={<AQIMap />} />
            <Route path="/aqi-prediction" element={<AQIPrediction />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/suggestions" element={<Suggestions />} />
            <Route path="/policies" element={<Policies />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/collector-hub" element={<CollectorHub />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Chatbot />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
