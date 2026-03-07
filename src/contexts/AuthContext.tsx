import React, { createContext, useContext, useState, type ReactNode } from "react";
import type { User, UserRole } from "@/types/monitor";

interface PendingCollector extends User {
  password: string;
}

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
const INITIAL_COLLECTORS = [
  { email: "collector@monitorindia.gov.in", password: "collector123", name: "Rajesh Kumar" },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [pendingCollectors, setPendingCollectors] = useState<PendingCollector[]>([
    { id: "PC001", name: "Priya Sharma", email: "priya@gov.in", role: "collector", approved: false, password: "priya123" },
    { id: "PC002", name: "Amit Verma", email: "amit@gov.in", role: "collector", approved: false, password: "amit123" },
  ]);
  const [approvedCollectors, setApprovedCollectors] = useState(INITIAL_COLLECTORS);

  const login = (email: string, password: string, role: UserRole): boolean => {
    if (role === "admin" && email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      setUser({ id: "ADMIN001", name: "System Admin", email, role: "admin", approved: true });
      return true;
    }
    if (role === "collector") {
      const found = approvedCollectors.find((c) => c.email === email && c.password === password);
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
      // Use the password they signed up with
      setApprovedCollectors((prev) => [...prev, { email: collector.email, password: collector.password, name: collector.name }]);
    }
  };

  const rejectCollector = (id: string) => {
    setPendingCollectors((prev) => prev.filter((c) => c.id !== id));
  };

  const requestCollectorSignup = (name: string, email: string, password: string) => {
    setPendingCollectors((prev) => [...prev, { id: `PC${Date.now()}`, name, email, role: "collector" as const, approved: false, password }]);
  };

  // Expose only User fields (without password) to the pending list shown in UI
  const safePendingCollectors: User[] = pendingCollectors.map(({ password, ...rest }) => rest);

  return (
    <AuthContext.Provider value={{ user, login, logout, pendingCollectors: safePendingCollectors, approveCollector, rejectCollector, requestCollectorSignup }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
