import { type VehicleEntry, type Company, type TollGate, type StateAQI } from "@/types/monitor";

export const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Chandigarh"
];

export const vehicleTypes = ["Car", "Bus", "Lorry", "Bike", "Auto", "Truck"] as const;

export const tollGates: TollGate[] = [
  { id: "TG001", name: "Attibele Toll Plaza", state: "Karnataka", district: "Bengaluru Urban", lat: 12.78, lng: 77.77 },
  { id: "TG002", name: "Hoskote Toll Plaza", state: "Karnataka", district: "Bengaluru Rural", lat: 13.07, lng: 77.79 },
  { id: "TG003", name: "Krishnagiri Toll Plaza", state: "Tamil Nadu", district: "Krishnagiri", lat: 12.52, lng: 78.21 },
  { id: "TG004", name: "Walajapet Toll Plaza", state: "Tamil Nadu", district: "Ranipet", lat: 12.92, lng: 79.36 },
  { id: "TG005", name: "Kherki Daula Toll Plaza", state: "Haryana", district: "Gurugram", lat: 28.41, lng: 77.02 },
  { id: "TG006", name: "Dasna Toll Plaza", state: "Uttar Pradesh", district: "Ghaziabad", lat: 28.71, lng: 77.52 },
  { id: "TG007", name: "Mulund Toll Naka", state: "Maharashtra", district: "Mumbai", lat: 19.17, lng: 72.95 },
  { id: "TG008", name: "Bandra-Worli Sea Link Toll", state: "Maharashtra", district: "Mumbai", lat: 19.04, lng: 72.82 },
  { id: "TG009", name: "DND Flyway Toll", state: "Delhi", district: "South Delhi", lat: 28.57, lng: 77.29 },
  { id: "TG010", name: "Palsit Toll Plaza", state: "West Bengal", district: "Purba Bardhaman", lat: 23.43, lng: 87.93 },
  { id: "TG011", name: "Shahjahanpur Toll", state: "Rajasthan", district: "Alwar", lat: 27.87, lng: 76.39 },
  { id: "TG012", name: "Vadodara Toll Plaza", state: "Gujarat", district: "Vadodara", lat: 22.31, lng: 73.19 },
];

const riskLevels = ["high", "moderate", "low"] as const;
const directions = ["entering", "exiting"] as const;

function randomFrom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateVehicleEntries(count: number): VehicleEntry[] {
  const entries: VehicleEntry[] = [];
  for (let i = 0; i < count; i++) {
    const tollGate = randomFrom(tollGates);
    const vehicleType = randomFrom(vehicleTypes);
    const ageYears = Math.floor(Math.random() * 15) + 1;
    const risk = ageYears > 10 ? "high" : ageYears > 5 ? "moderate" : "low";
    const emissionFactor = vehicleType === "Truck" || vehicleType === "Lorry" ? 2.5 : vehicleType === "Bus" ? 2.0 : vehicleType === "Car" ? 1.0 : vehicleType === "Auto" ? 0.8 : 0.5;
    const aqiImpact = +(emissionFactor * (1 + ageYears * 0.1) * (Math.random() * 0.5 + 0.75)).toFixed(2);

    entries.push({
      id: `VE${String(i + 1).padStart(4, "0")}`,
      vehicleNumber: `${tollGate.state.substring(0, 2).toUpperCase()}${Math.floor(Math.random() * 99).toString().padStart(2, "0")} ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))} ${Math.floor(Math.random() * 9999).toString().padStart(4, "0")}`,
      vehicleType,
      tollGateId: tollGate.id,
      tollGateName: tollGate.name,
      state: tollGate.state,
      district: tollGate.district,
      direction: randomFrom(directions),
      riskLevel: risk,
      aqiImpact,
      vehicleAge: ageYears,
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 3600000)).toISOString(),
    });
  }
  return entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export const companies: Company[] = [
  { id: "C001", name: "Tata Steel Ltd", type: "Industry", state: "Jharkhand", district: "Jamshedpur", carbonCredits: 500, usedCredits: 480, fines: [], status: "yellow", registrationDate: "2020-01-15" },
  { id: "C002", name: "Reliance Industries", type: "Industry", state: "Gujarat", district: "Jamnagar", carbonCredits: 1000, usedCredits: 750, fines: [], status: "green", registrationDate: "2019-06-20" },
  { id: "C003", name: "Singareni Collieries", type: "Mine", state: "Telangana", district: "Mancherial", carbonCredits: 300, usedCredits: 350, fines: [{ amount: 500000, date: "2025-08-10", reason: "Exceeded carbon credit limit by 50 metric tons" }], status: "red", registrationDate: "2021-03-01" },
  { id: "C004", name: "Adani Power", type: "Industry", state: "Gujarat", district: "Mundra", carbonCredits: 800, usedCredits: 600, fines: [], status: "green", registrationDate: "2018-11-05" },
  { id: "C005", name: "Coal India Ltd", type: "Mine", state: "West Bengal", district: "Kolkata", carbonCredits: 1200, usedCredits: 1250, fines: [{ amount: 1000000, date: "2025-06-15", reason: "Exceeded limit by 50 metric tons" }, { amount: 750000, date: "2025-11-01", reason: "Continued excess emissions" }], status: "red", registrationDate: "2017-02-28" },
  { id: "C006", name: "JSW Steel", type: "Industry", state: "Karnataka", district: "Bellary", carbonCredits: 600, usedCredits: 590, fines: [], status: "yellow", registrationDate: "2020-07-12" },
  { id: "C007", name: "Vedanta Ltd", type: "Mine", state: "Rajasthan", district: "Udaipur", carbonCredits: 450, usedCredits: 200, fines: [], status: "green", registrationDate: "2019-09-18" },
  { id: "C008", name: "NTPC Ltd", type: "Industry", state: "Uttar Pradesh", district: "Singrauli", carbonCredits: 900, usedCredits: 870, fines: [], status: "yellow", registrationDate: "2018-04-22" },
  { id: "C009", name: "Hindustan Zinc", type: "Mine", state: "Rajasthan", district: "Chittorgarh", carbonCredits: 350, usedCredits: 150, fines: [], status: "green", registrationDate: "2021-01-10" },
  { id: "C010", name: "UltraTech Cement", type: "Factory", state: "Maharashtra", district: "Mumbai", carbonCredits: 700, usedCredits: 720, fines: [{ amount: 300000, date: "2025-09-20", reason: "Exceeded limit by 20 metric tons" }], status: "red", registrationDate: "2019-12-05" },
  { id: "C011", name: "ACC Cement", type: "Factory", state: "Maharashtra", district: "Thane", carbonCredits: 400, usedCredits: 380, fines: [], status: "yellow", registrationDate: "2020-05-14" },
  { id: "C012", name: "Dalmia Bharat", type: "Factory", state: "Tamil Nadu", district: "Tiruchirappalli", carbonCredits: 0, usedCredits: 0, fines: [], status: "green", registrationDate: "2024-01-01" },
  { id: "C013", name: "Ambuja Cements", type: "Factory", state: "Gujarat", district: "Ahmedabad", carbonCredits: 550, usedCredits: 300, fines: [], status: "green", registrationDate: "2019-08-30" },
  { id: "C014", name: "SAIL Bhilai", type: "Industry", state: "Chhattisgarh", district: "Durg", carbonCredits: 650, usedCredits: 700, fines: [{ amount: 800000, date: "2025-07-05", reason: "Exceeded limit by 50 metric tons" }], status: "red", registrationDate: "2018-06-15" },
  { id: "C015", name: "IOCL Refinery", type: "Industry", state: "Bihar", district: "Begusarai", carbonCredits: 500, usedCredits: 490, fines: [], status: "yellow", registrationDate: "2020-10-20" },
];

export const stateAQIData: StateAQI[] = [
  { state: "Delhi", aqi: 312, category: "hazardous", lat: 28.61, lng: 77.23 },
  { state: "Uttar Pradesh", aqi: 245, category: "unhealthy", lat: 26.85, lng: 80.91 },
  { state: "Bihar", aqi: 198, category: "unhealthy", lat: 25.60, lng: 85.12 },
  { state: "Haryana", aqi: 210, category: "unhealthy", lat: 29.06, lng: 76.09 },
  { state: "Maharashtra", aqi: 145, category: "moderate", lat: 19.08, lng: 75.71 },
  { state: "West Bengal", aqi: 168, category: "unhealthy", lat: 22.98, lng: 87.75 },
  { state: "Punjab", aqi: 185, category: "unhealthy", lat: 31.15, lng: 75.34 },
  { state: "Rajasthan", aqi: 130, category: "moderate", lat: 27.02, lng: 74.22 },
  { state: "Gujarat", aqi: 110, category: "moderate", lat: 22.26, lng: 71.19 },
  { state: "Tamil Nadu", aqi: 78, category: "moderate", lat: 11.13, lng: 78.66 },
  { state: "Karnataka", aqi: 65, category: "good", lat: 15.32, lng: 75.71 },
  { state: "Kerala", aqi: 42, category: "good", lat: 10.85, lng: 76.27 },
  { state: "Telangana", aqi: 120, category: "moderate", lat: 18.11, lng: 79.02 },
  { state: "Andhra Pradesh", aqi: 85, category: "moderate", lat: 15.91, lng: 79.74 },
  { state: "Madhya Pradesh", aqi: 155, category: "unhealthy", lat: 22.97, lng: 78.66 },
  { state: "Jharkhand", aqi: 175, category: "unhealthy", lat: 23.61, lng: 85.28 },
  { state: "Chhattisgarh", aqi: 160, category: "unhealthy", lat: 21.27, lng: 81.87 },
  { state: "Odisha", aqi: 95, category: "moderate", lat: 20.94, lng: 84.80 },
  { state: "Assam", aqi: 55, category: "good", lat: 26.20, lng: 92.94 },
  { state: "Goa", aqi: 35, category: "good", lat: 15.30, lng: 74.08 },
  { state: "Himachal Pradesh", aqi: 30, category: "good", lat: 31.10, lng: 77.17 },
  { state: "Uttarakhand", aqi: 48, category: "good", lat: 30.07, lng: 79.00 },
  { state: "Sikkim", aqi: 22, category: "good", lat: 27.53, lng: 88.51 },
  { state: "Meghalaya", aqi: 28, category: "good", lat: 25.47, lng: 91.37 },
  { state: "Chandigarh", aqi: 135, category: "moderate", lat: 30.73, lng: 76.77 },
];
