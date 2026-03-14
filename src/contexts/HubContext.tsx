import React, { createContext, useContext, useState, type ReactNode } from "react";

// ────────────── types ──────────────
export interface ChatMessage {
  id: string;
  sender: string;
  senderEmail: string;
  role: "admin" | "collector";
  content: string;
  timestamp: Date;
  to: string | null;
}

export interface SchemeVote {
  votedBy: string;
  vote: "approve" | "reject";
  feedback: string;
  timestamp: Date;
}

export interface Scheme {
  id: string;
  title: string;
  brief: string;
  dprFileName: string;
  implementationPlan: string;
  budgetEstimation: string;
  proposedBy: string;
  proposedByRole: "admin" | "collector";
  proposedAt: Date;
  status: "voting" | "approved" | "rejected";
  votes: SchemeVote[];
}

// ────────────── seed data ──────────────
const SEED_MESSAGES: ChatMessage[] = [
  { id: "1", sender: "System Admin", senderEmail: "admin@monitorindia.gov.in", role: "admin", content: "Welcome to the Collector Hub! Use this channel for coordination.", timestamp: new Date(Date.now() - 3600000 * 5), to: null },
  { id: "2", sender: "Rajesh Kumar", senderEmail: "collector@monitorindia.gov.in", role: "collector", content: "Delhi AQI crossing 350 today. Requesting emergency response team deployment.", timestamp: new Date(Date.now() - 3600000 * 3), to: null },
  { id: "3", sender: "System Admin", senderEmail: "admin@monitorindia.gov.in", role: "admin", content: "Noted. I'm flagging this for the environment ministry. All NCR collectors please report ground data.", timestamp: new Date(Date.now() - 3600000 * 2), to: null },
  { id: "4", sender: "Rajesh Kumar", senderEmail: "collector@monitorindia.gov.in", role: "collector", content: "Mumbai readings stable at 89 AQI. Industrial zone checks completed.", timestamp: new Date(Date.now() - 3600000), to: null },
];

const SEED_SCHEMES: Scheme[] = [
  {
    id: "S001",
    title: "Electric Vehicle Subsidy Extension for Public Transport",
    brief: "Proposal to extend the existing EV subsidy scheme to cover all public transport vehicles including auto-rickshaws and city buses.",
    dprFileName: "EV_Subsidy_DPR_2024.pdf",
    implementationPlan: "Phase 1 (0-6 months): Policy framework & stakeholder consultation\nPhase 2 (6-12 months): Pilot in 5 metro cities\nPhase 3 (12-24 months): Nationwide rollout",
    budgetEstimation: "₹15,000 Crores over 3 years\n- Subsidy pool: ₹10,000 Cr\n- Charging infra: ₹3,000 Cr\n- Admin: ₹2,000 Cr",
    proposedBy: "System Admin",
    proposedByRole: "admin",
    proposedAt: new Date(Date.now() - 86400000 * 3),
    status: "voting",
    votes: [
      { votedBy: "Rajesh Kumar", vote: "approve", feedback: "Excellent initiative. 30% emission reduction in pilot areas.", timestamp: new Date(Date.now() - 86400000 * 2) },
    ],
  },
  {
    id: "S002",
    title: "Industrial Emission Real-Time Monitoring Network",
    brief: "Deploy IoT-based continuous emission monitoring systems (CEMS) in all major industrial zones.",
    dprFileName: "CEMS_Network_DPR.pdf",
    implementationPlan: "Phase 1: Install sensors in 50 critical industrial zones\nPhase 2: Integrate with central dashboard\nPhase 3: Automated compliance alerts",
    budgetEstimation: "₹8,500 Crores over 2 years",
    proposedBy: "Rajesh Kumar",
    proposedByRole: "collector",
    proposedAt: new Date(Date.now() - 86400000 * 5),
    status: "approved",
    votes: [
      { votedBy: "System Admin", vote: "approve", feedback: "Critical infrastructure. Fast-track recommended.", timestamp: new Date(Date.now() - 86400000 * 4) },
    ],
  },
];

interface HubContextType {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  schemes: Scheme[];
  setSchemes: React.Dispatch<React.SetStateAction<Scheme[]>>;
}

const HubContext = createContext<HubContextType | null>(null);

export function HubProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>(SEED_MESSAGES);
  const [schemes, setSchemes] = useState<Scheme[]>(SEED_SCHEMES);

  return (
    <HubContext.Provider value={{ messages, setMessages, schemes, setSchemes }}>
      {children}
    </HubContext.Provider>
  );
}

export function useHub() {
  const ctx = useContext(HubContext);
  if (!ctx) throw new Error("useHub must be used within HubProvider");
  return ctx;
}
