import React, { createContext, useContext, useState, type ReactNode } from "react";
import type { User, UserRole } from "@/types/monitor";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  pendingCollectors: User[];
  approveCollector: (id: string) => void;
  rejectCollector: (id: string) => void;
  requestCollectorSignup: (name: string, email: string, password: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const ADMIN_CREDENTIALS = { email: "admin@monitorindia.gov.in", password: "admin123" };
const COLLECTOR_CREDENTIALS = [
  { email: "collector@monitorindia.gov.in", password: "collector123", name: "Rajesh Kumar", approved: true },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [pendingCollectors, setPendingCollectors] = useState<User[]>([
    { id: "PC001", name: "Priya Sharma", email: "priya@gov.in", role: "collector", approved: false },
    { id: "PC002", name: "Amit Verma", email: "amit@gov.in", role: "collector", approved: false },
  ]);
  const [approvedCollectors, setApprovedCollectors] = useState(COLLECTOR_CREDENTIALS);

  const login = (email: string, password: string, role: UserRole): boolean => {
    if (role === "admin" && email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      setUser({ id: "ADMIN001", name: "System Admin", email, role: "admin", approved: true });
      return true;
    }
    if (role === "collector") {
      const found = approvedCollectors.find((c) => c.email === email && c.password === password && c.approved);
      if (found) {
        setUser({ id: `COL_${found.email}`, name: found.name, email, role: "collector", approved: true });
        return true;
      }
    }
    return false;
  };

  const logout = () => setUser(null);

  const approveCollector = (id: string) => {
    const collector = pendingCollectors.find((c) => c.id === id);
    if (collector) {
      setPendingCollectors((prev) => prev.filter((c) => c.id !== id));
      setApprovedCollectors((prev) => [...prev, { email: collector.email, password: "approved123", name: collector.name, approved: true }]);
    }
  };

  const rejectCollector = (id: string) => {
    setPendingCollectors((prev) => prev.filter((c) => c.id !== id));
  };

  const requestCollectorSignup = (name: string, email: string, _password: string) => {
    setPendingCollectors((prev) => [...prev, { id: `PC${Date.now()}`, name, email, role: "collector" as const, approved: false }]);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, pendingCollectors, approveCollector, rejectCollector, requestCollectorSignup }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
