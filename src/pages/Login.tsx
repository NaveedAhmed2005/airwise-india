import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, UserCheck, Wind, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import type { UserRole } from "@/types/monitor";

export default function Login() {
  const navigate = useNavigate();
  const { login, requestCollectorSignup } = useAuth();
  const [loginData, setLoginData] = useState({ email: "", password: "", role: "collector" as UserRole });
  const [signupData, setSignupData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const success = login(loginData.email, loginData.password, loginData.role);
    if (success) {
      toast.success(`Logged in as ${loginData.role}`);
      navigate(loginData.role === "admin" ? "/admin" : "/dashboard");
    } else {
      setError("Invalid credentials or account not approved");
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupData.name || !signupData.email || !signupData.password) {
      setError("Please fill all fields");
      return;
    }
    requestCollectorSignup(signupData.name, signupData.email, signupData.password);
    toast.success("Signup request submitted. Waiting for admin approval.");
    setSignupData({ name: "", email: "", password: "" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-glow-green">
            <Wind className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="mt-4 font-display text-2xl font-bold text-foreground">Monitor India</h1>
          <p className="mt-1 text-sm text-muted-foreground">Official / Admin Login Portal</p>
        </div>

        <Card className="shadow-elevated p-6">
          <Tabs defaultValue="login">
            <TabsList className="mb-6 w-full">
              <TabsTrigger value="login" className="flex-1">Login</TabsTrigger>
              <TabsTrigger value="signup" className="flex-1">Collector Signup</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="flex gap-2">
                  <Button type="button" variant={loginData.role === "collector" ? "default" : "outline"} className="flex-1 gap-2" onClick={() => setLoginData({ ...loginData, role: "collector" })}>
                    <UserCheck className="h-4 w-4" /> Collector
                  </Button>
                  <Button type="button" variant={loginData.role === "admin" ? "default" : "outline"} className="flex-1 gap-2" onClick={() => setLoginData({ ...loginData, role: "admin" })}>
                    <Shield className="h-4 w-4" /> Admin
                  </Button>
                </div>
                <div>
                  <Label>Email</Label>
                  <Input type="email" value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} placeholder="Enter email" />
                </div>
                <div>
                  <Label>Password</Label>
                  <Input type="password" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} placeholder="Enter password" />
                </div>
                {error && (
                  <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" /> {error}
                  </div>
                )}
                <Button type="submit" className="w-full">Login as {loginData.role === "admin" ? "Admin" : "Collector/Official"}</Button>

                <div className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">
                  <p className="font-semibold">Demo Credentials:</p>
                  <p>Admin: admin@monitorindia.gov.in / admin123</p>
                  <p>Collector: collector@monitorindia.gov.in / collector123</p>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <p className="text-sm text-muted-foreground">Collector signup requires admin approval before access is granted.</p>
                <div>
                  <Label>Full Name</Label>
                  <Input value={signupData.name} onChange={(e) => setSignupData({ ...signupData, name: e.target.value })} placeholder="Full name" />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input type="email" value={signupData.email} onChange={(e) => setSignupData({ ...signupData, email: e.target.value })} placeholder="Official email" />
                </div>
                <div>
                  <Label>Password</Label>
                  <Input type="password" value={signupData.password} onChange={(e) => setSignupData({ ...signupData, password: e.target.value })} placeholder="Create password" />
                </div>
                {error && (
                  <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" /> {error}
                  </div>
                )}
                <Button type="submit" className="w-full">Request Collector Access</Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          <button onClick={() => navigate("/")} className="text-primary underline-offset-4 hover:underline">Back to Home</button>
        </p>
      </div>
    </div>
  );
}
