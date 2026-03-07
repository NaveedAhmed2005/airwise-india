export interface TollGate {
  id: string;
  name: string;
  state: string;
  district: string;
  lat: number;
  lng: number;
}

export interface VehicleEntry {
  id: string;
  vehicleNumber: string;
  vehicleType: string;
  tollGateId: string;
  tollGateName: string;
  state: string;
  district: string;
  direction: "entering" | "exiting";
  riskLevel: "high" | "moderate" | "low";
  aqiImpact: number;
  vehicleAge: number;
  timestamp: string;
}

export interface Fine {
  amount: number;
  date: string;
  reason: string;
}

export interface Company {
  id: string;
  name: string;
  type: "Industry" | "Factory" | "Mine";
  state: string;
  district: string;
  carbonCredits: number;
  usedCredits: number;
  fines: Fine[];
  status: "green" | "yellow" | "red";
  registrationDate: string;
}

export interface StateAQI {
  state: string;
  aqi: number;
  category: "good" | "moderate" | "unhealthy" | "hazardous" | "severe";
  lat: number;
  lng: number;
}

export type UserRole = "public" | "collector" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  approved: boolean;
}
