import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, UserCheck, Wind, AlertCircle, Camera, Upload, X, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import type { UserRole } from "@/types/monitor";

export default function Login() {
  const navigate = useNavigate();
  const { login, requestCollectorSignup } = useAuth();
  const [loginData, setLoginData] = useState({ email: "", password: "", role: "collector" as UserRole });
  const [signupData, setSignupData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  // Photo capture state
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // ID proof state
  const [idProof, setIdProof] = useState<File | null>(null);
  const [idProofPreview, setIdProofPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: 640, height: 480 } });
      setStream(mediaStream);
      setIsCameraOpen(true);
      setCapturedPhoto(null);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();
        }
      }, 100);
    } catch {
      toast.error("Unable to access camera. Please allow camera permission.");
    }
  }, []);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
        setCapturedPhoto(dataUrl);
      }
    }
    // Stop camera
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  }, [stream]);

  const retakePhoto = useCallback(() => {
    setCapturedPhoto(null);
    openCamera();
  }, [openCamera]);

  const handleIdProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be under 5MB");
        return;
      }
      setIdProof(file);
      const reader = new FileReader();
      reader.onloadend = () => setIdProofPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

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
    if (!capturedPhoto) {
      setError("Please capture your live photo");
      return;
    }
    if (!idProof) {
      setError("Please upload your IAS ID proof");
      return;
    }
    requestCollectorSignup(signupData.name, signupData.email, signupData.password, capturedPhoto, idProofPreview || undefined);
    toast.success("Signup request submitted with photo & ID proof. Waiting for admin approval.");
    setSignupData({ name: "", email: "", password: "" });
    setCapturedPhoto(null);
    setIdProof(null);
    setIdProofPreview(null);
    setError("");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
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
                <p className="text-sm text-muted-foreground">Collector signup requires admin approval. Please provide your live photo and IAS ID proof.</p>
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

                {/* Live Photo Capture */}
                <div>
                  <Label className="mb-2 flex items-center gap-2">
                    <Camera className="h-4 w-4" /> Live Photo <span className="text-xs text-destructive">*Required</span>
                  </Label>
                  {!capturedPhoto && !isCameraOpen && (
                    <Button type="button" variant="outline" className="w-full gap-2" onClick={openCamera}>
                      <Camera className="h-4 w-4" /> Open Camera & Capture Photo
                    </Button>
                  )}
                  {isCameraOpen && (
                    <div className="space-y-2">
                      <div className="relative overflow-hidden rounded-xl border-2 border-primary bg-black">
                        <video ref={videoRef} autoPlay playsInline muted className="w-full rounded-xl" style={{ transform: "scaleX(-1)" }} />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="h-40 w-40 rounded-full border-2 border-dashed border-primary/60" />
                        </div>
                      </div>
                      <Button type="button" className="w-full gap-2" onClick={capturePhoto}>
                        <Camera className="h-4 w-4" /> Capture Photo
                      </Button>
                    </div>
                  )}
                  {capturedPhoto && (
                    <div className="space-y-2">
                      <div className="relative overflow-hidden rounded-xl border-2 border-primary">
                        <img src={capturedPhoto} alt="Captured" className="w-full rounded-xl" style={{ transform: "scaleX(-1)" }} />
                        <div className="absolute top-2 right-2 flex gap-1">
                          <CheckCircle className="h-6 w-6 text-primary drop-shadow" />
                        </div>
                      </div>
                      <Button type="button" variant="outline" size="sm" className="w-full gap-2" onClick={retakePhoto}>
                        <Camera className="h-4 w-4" /> Retake Photo
                      </Button>
                    </div>
                  )}
                  <canvas ref={canvasRef} className="hidden" />
                </div>

                {/* IAS ID Proof Upload */}
                <div>
                  <Label className="mb-2 flex items-center gap-2">
                    <Upload className="h-4 w-4" /> IAS ID Proof <span className="text-xs text-destructive">*Required</span>
                  </Label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleIdProofChange}
                    className="hidden"
                  />
                  {!idProof ? (
                    <Button type="button" variant="outline" className="w-full gap-2" onClick={() => fileInputRef.current?.click()}>
                      <Upload className="h-4 w-4" /> Upload IAS ID Proof
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      {idProofPreview && idProof.type.startsWith("image/") ? (
                        <div className="relative overflow-hidden rounded-xl border-2 border-primary">
                          <img src={idProofPreview} alt="ID Proof" className="w-full max-h-48 object-contain rounded-xl bg-muted" />
                          <div className="absolute top-2 right-2">
                            <CheckCircle className="h-6 w-6 text-primary drop-shadow" />
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 rounded-xl border-2 border-primary bg-muted p-3">
                          <Upload className="h-5 w-5 text-primary" />
                          <span className="text-sm font-medium text-foreground truncate">{idProof.name}</span>
                          <CheckCircle className="h-5 w-5 text-primary ml-auto" />
                        </div>
                      )}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full gap-2"
                        onClick={() => { setIdProof(null); setIdProofPreview(null); }}
                      >
                        <X className="h-4 w-4" /> Remove & Re-upload
                      </Button>
                    </div>
                  )}
                  <p className="mt-1 text-xs text-muted-foreground">Accepted: Images or PDF (max 5MB)</p>
                </div>

                {error && (
                  <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" /> {error}
                  </div>
                )}
                <Button type="submit" className="w-full gap-2">
                  <UserCheck className="h-4 w-4" /> Request Collector Access
                </Button>
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
