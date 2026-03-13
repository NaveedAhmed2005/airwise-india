import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare, Send, ThumbsUp, ThumbsDown, FileText, Upload, Users,
  Vote, Clock, CheckCircle2, XCircle, Eye, ChevronDown, ChevronUp,
  Phone, Video, User
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

// ────────────── types ──────────────
interface ChatMessage {
  id: string;
  sender: string;
  role: "admin" | "collector";
  content: string;
  timestamp: Date;
}

interface SchemeVote {
  odBy: string;
  vote: "approve" | "reject";
  feedback: string;
  timestamp: Date;
}

interface Scheme {
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
  { id: "1", sender: "System Admin", role: "admin", content: "Welcome to the Collector Hub! Use this channel for coordination.", timestamp: new Date(Date.now() - 3600000 * 5) },
  { id: "2", sender: "Rajesh Kumar", role: "collector", content: "Delhi AQI crossing 350 today. Requesting emergency response team deployment.", timestamp: new Date(Date.now() - 3600000 * 3) },
  { id: "3", sender: "System Admin", role: "admin", content: "Noted. I'm flagging this for the environment ministry. All NCR collectors please report ground data.", timestamp: new Date(Date.now() - 3600000 * 2) },
  { id: "4", sender: "Priya Sharma", role: "collector", content: "Mumbai readings stable at 89 AQI. Industrial zone checks completed.", timestamp: new Date(Date.now() - 3600000) },
];

const SEED_SCHEMES: Scheme[] = [
  {
    id: "S001",
    title: "Electric Vehicle Subsidy Extension for Public Transport",
    brief: "Proposal to extend the existing EV subsidy scheme to cover all public transport vehicles including auto-rickshaws and city buses. This will significantly reduce vehicular emissions in urban areas.",
    dprFileName: "EV_Subsidy_DPR_2024.pdf",
    implementationPlan: "Phase 1 (0-6 months): Policy framework & stakeholder consultation\nPhase 2 (6-12 months): Pilot in 5 metro cities\nPhase 3 (12-24 months): Nationwide rollout with state-level partnerships",
    budgetEstimation: "₹15,000 Crores over 3 years\n- Subsidy pool: ₹10,000 Cr\n- Charging infrastructure: ₹3,000 Cr\n- Administration & monitoring: ₹2,000 Cr",
    proposedBy: "System Admin",
    proposedByRole: "admin",
    proposedAt: new Date(Date.now() - 86400000 * 3),
    status: "voting",
    votes: [
      { odBy: "Rajesh Kumar", vote: "approve", feedback: "Excellent initiative. We've seen 30% emission reduction in pilot areas.", timestamp: new Date(Date.now() - 86400000 * 2) },
      { odBy: "Priya Sharma", vote: "approve", feedback: "Mumbai's public transport fleet desperately needs this. Fully support.", timestamp: new Date(Date.now() - 86400000) },
    ],
  },
  {
    id: "S002",
    title: "Industrial Emission Real-Time Monitoring Network",
    brief: "Deploy IoT-based continuous emission monitoring systems (CEMS) in all major industrial zones to enable real-time tracking of industrial pollution.",
    dprFileName: "CEMS_Network_DPR.pdf",
    implementationPlan: "Phase 1: Install sensors in 50 critical industrial zones\nPhase 2: Integrate with central monitoring dashboard\nPhase 3: Automated compliance alerts & penalties",
    budgetEstimation: "₹8,500 Crores over 2 years\n- Sensor hardware: ₹4,000 Cr\n- Software platform: ₹2,500 Cr\n- Maintenance (5yr): ₹2,000 Cr",
    proposedBy: "Rajesh Kumar",
    proposedByRole: "collector",
    proposedAt: new Date(Date.now() - 86400000 * 5),
    status: "approved",
    votes: [
      { odBy: "System Admin", vote: "approve", feedback: "Critical infrastructure. Fast-track approval recommended.", timestamp: new Date(Date.now() - 86400000 * 4) },
      { odBy: "Priya Sharma", vote: "approve", feedback: "Will significantly improve our data accuracy.", timestamp: new Date(Date.now() - 86400000 * 3) },
    ],
  },
];

// ────────────── online users ──────────────
const ONLINE_USERS = [
  { name: "System Admin", role: "admin" as const, online: true },
  { name: "Rajesh Kumar", role: "collector" as const, online: true },
  { name: "Priya Sharma", role: "collector" as const, online: false },
  { name: "Amit Verma", role: "collector" as const, online: false },
];

// ────────────── tabs ──────────────
type Tab = "chat" | "schemes" | "members";

export default function CollectorHub() {
  const { user } = useAuth();

  if (!user || (user.role !== "collector" && user.role !== "admin")) {
    return <Navigate to="/login" replace />;
  }

  const [activeTab, setActiveTab] = useState<Tab>("chat");
  const [messages, setMessages] = useState<ChatMessage[]>(SEED_MESSAGES);
  const [schemes, setSchemes] = useState<Scheme[]>(SEED_SCHEMES);
  const [chatInput, setChatInput] = useState("");
  const [showNewScheme, setShowNewScheme] = useState(false);
  const [expandedScheme, setExpandedScheme] = useState<string | null>(null);
  const [voteDialog, setVoteDialog] = useState<string | null>(null);
  const [voteFeedback, setVoteFeedback] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // ── new scheme form ──
  const [newScheme, setNewScheme] = useState({
    title: "", brief: "", dprFileName: "", implementationPlan: "", budgetEstimation: "",
  });

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    setMessages((prev) => [...prev, {
      id: `msg-${Date.now()}`,
      sender: user.name,
      role: user.role as "admin" | "collector",
      content: chatInput.trim(),
      timestamp: new Date(),
    }]);
    setChatInput("");
  };

  const submitScheme = () => {
    if (!newScheme.title || !newScheme.brief || !newScheme.implementationPlan || !newScheme.budgetEstimation) return;
    setSchemes((prev) => [{
      id: `S${Date.now()}`,
      ...newScheme,
      dprFileName: newScheme.dprFileName || "DPR_Document.pdf",
      proposedBy: user.name,
      proposedByRole: user.role as "admin" | "collector",
      proposedAt: new Date(),
      status: "voting",
      votes: [],
    }, ...prev]);
    setNewScheme({ title: "", brief: "", dprFileName: "", implementationPlan: "", budgetEstimation: "" });
    setShowNewScheme(false);
  };

  const castVote = (schemeId: string, decision: "approve" | "reject") => {
    setSchemes((prev) =>
      prev.map((s) => {
        if (s.id !== schemeId) return s;
        const alreadyVoted = s.votes.some((v) => v.odBy === user.name);
        if (alreadyVoted) return s;
        const newVotes = [...s.votes, { odBy: user.name, vote: decision, feedback: voteFeedback, timestamp: new Date() }];
        return { ...s, votes: newVotes };
      })
    );
    setVoteFeedback("");
    setVoteDialog(null);
  };

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "chat", label: "Team Chat", icon: <MessageSquare className="h-4 w-4" /> },
    { key: "schemes", label: "Schemes & Voting", icon: <Vote className="h-4 w-4" /> },
    { key: "members", label: "Members", icon: <Users className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold text-foreground">Collector Hub</h1>
          <p className="text-muted-foreground">Collaborate, communicate & vote on environmental initiatives</p>
        </div>

        {/* Tabs */}
        <div className="mb-4 flex gap-1 rounded-xl bg-muted p-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-colors ${
                activeTab === t.key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* ═══════════════ CHAT TAB ═══════════════ */}
        {activeTab === "chat" && (
          <Card className="overflow-hidden">
            <CardHeader className="border-b border-border pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Team Communication</CardTitle>
                  <CardDescription>Real-time discussion between collectors and admin</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-1.5" disabled>
                    <Phone className="h-4 w-4" /> Call
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1.5" disabled>
                    <Video className="h-4 w-4" /> Video
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[400px] overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => {
                  const isSelf = msg.sender === user.name;
                  return (
                    <div key={msg.id} className={`flex gap-3 ${isSelf ? "flex-row-reverse" : ""}`}>
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${msg.role === "admin" ? "bg-destructive/10" : "bg-primary/10"}`}>
                        <User className={`h-4 w-4 ${msg.role === "admin" ? "text-destructive" : "text-primary"}`} />
                      </div>
                      <div className={`max-w-[70%] ${isSelf ? "text-right" : ""}`}>
                        <div className="mb-1 flex items-center gap-2">
                          <span className="text-xs font-semibold text-foreground">{msg.sender}</span>
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">{msg.role}</Badge>
                          <span className="text-[10px] text-muted-foreground">{msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                        </div>
                        <div className={`inline-block rounded-2xl px-4 py-2.5 text-sm ${isSelf ? "rounded-br-sm bg-primary text-primary-foreground" : "rounded-bl-sm bg-muted text-foreground"}`}>
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={chatEndRef} />
              </div>
              <div className="border-t border-border p-4">
                <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
                  <Input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1"
                  />
                  <Button type="submit" disabled={!chatInput.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ═══════════════ SCHEMES TAB ═══════════════ */}
        {activeTab === "schemes" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-foreground">Schemes & Initiatives</h2>
              <Button onClick={() => setShowNewScheme(!showNewScheme)} className="gap-1.5">
                <FileText className="h-4 w-4" /> Propose New Scheme
              </Button>
            </div>

            {/* New Scheme Form */}
            {showNewScheme && (
              <Card className="border-primary/30">
                <CardHeader>
                  <CardTitle className="text-lg">Submit New Scheme for Voting</CardTitle>
                  <CardDescription>Fill in all details so collectors & admin can review before voting</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Scheme Title</label>
                    <Input value={newScheme.title} onChange={(e) => setNewScheme((p) => ({ ...p, title: e.target.value }))} placeholder="e.g., Urban Green Corridor Initiative" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Brief Description</label>
                    <Textarea value={newScheme.brief} onChange={(e) => setNewScheme((p) => ({ ...p, brief: e.target.value }))} placeholder="Describe the scheme objectives and expected outcomes..." rows={3} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">DPR Upload (Detailed Project Report)</label>
                    <div className="mt-1 flex items-center gap-3">
                      <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border bg-muted px-4 py-3 text-sm text-muted-foreground hover:bg-accent transition-colors">
                        <Upload className="h-4 w-4" />
                        Upload PDF
                        <input
                          type="file"
                          accept=".pdf"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) setNewScheme((p) => ({ ...p, dprFileName: file.name }));
                          }}
                        />
                      </label>
                      {newScheme.dprFileName && <span className="text-sm text-primary font-medium">{newScheme.dprFileName}</span>}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Implementation Plan</label>
                    <Textarea value={newScheme.implementationPlan} onChange={(e) => setNewScheme((p) => ({ ...p, implementationPlan: e.target.value }))} placeholder="Phase 1: ...\nPhase 2: ...\nPhase 3: ..." rows={4} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Budget Estimation</label>
                    <Textarea value={newScheme.budgetEstimation} onChange={(e) => setNewScheme((p) => ({ ...p, budgetEstimation: e.target.value }))} placeholder="Total budget and breakdown..." rows={3} />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button onClick={submitScheme}>Submit for Voting</Button>
                    <Button variant="outline" onClick={() => setShowNewScheme(false)}>Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Scheme Cards */}
            {schemes.map((scheme) => {
              const isExpanded = expandedScheme === scheme.id;
              const approves = scheme.votes.filter((v) => v.vote === "approve").length;
              const rejects = scheme.votes.filter((v) => v.vote === "reject").length;
              const hasVoted = scheme.votes.some((v) => v.odBy === user.name);

              return (
                <Card key={scheme.id} className={`transition-all ${scheme.status === "approved" ? "border-primary/30" : scheme.status === "rejected" ? "border-destructive/30" : ""}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            variant={scheme.status === "approved" ? "default" : scheme.status === "rejected" ? "destructive" : "secondary"}
                          >
                            {scheme.status === "voting" && <Clock className="mr-1 h-3 w-3" />}
                            {scheme.status === "approved" && <CheckCircle2 className="mr-1 h-3 w-3" />}
                            {scheme.status === "rejected" && <XCircle className="mr-1 h-3 w-3" />}
                            {scheme.status.charAt(0).toUpperCase() + scheme.status.slice(1)}
                          </Badge>
                          <Badge variant="outline" className="text-[10px]">{scheme.proposedByRole}</Badge>
                        </div>
                        <CardTitle className="text-lg">{scheme.title}</CardTitle>
                        <CardDescription className="mt-1">
                          Proposed by {scheme.proposedBy} • {scheme.proposedAt.toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="flex items-center gap-1 text-primary"><ThumbsUp className="h-4 w-4" /> {approves}</span>
                        <span className="flex items-center gap-1 text-destructive"><ThumbsDown className="h-4 w-4" /> {rejects}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{scheme.brief}</p>

                    <button
                      onClick={() => setExpandedScheme(isExpanded ? null : scheme.id)}
                      className="flex items-center gap-1 text-sm font-medium text-primary hover:underline mb-3"
                    >
                      <Eye className="h-4 w-4" />
                      {isExpanded ? "Hide" : "View"} Full Details
                      {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    </button>

                    {isExpanded && (
                      <div className="space-y-4 rounded-xl bg-muted p-4 mb-4 animate-fade-in">
                        <div>
                          <h4 className="text-sm font-semibold text-foreground mb-1 flex items-center gap-1.5"><FileText className="h-4 w-4" /> DPR Document</h4>
                          <p className="text-sm text-primary cursor-pointer hover:underline">{scheme.dprFileName}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-foreground mb-1">Implementation Plan</h4>
                          <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-body">{scheme.implementationPlan}</pre>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-foreground mb-1">Budget Estimation</h4>
                          <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-body">{scheme.budgetEstimation}</pre>
                        </div>
                      </div>
                    )}

                    {/* Votes & Feedback */}
                    {scheme.votes.length > 0 && (
                      <div className="space-y-2 mb-4">
                        <h4 className="text-sm font-semibold text-foreground">Votes & Feedback</h4>
                        {scheme.votes.map((v, i) => (
                          <div key={i} className="flex items-start gap-2 rounded-lg bg-muted/50 px-3 py-2">
                            <div className={`mt-0.5 ${v.vote === "approve" ? "text-primary" : "text-destructive"}`}>
                              {v.vote === "approve" ? <ThumbsUp className="h-3.5 w-3.5" /> : <ThumbsDown className="h-3.5 w-3.5" />}
                            </div>
                            <div className="flex-1">
                              <span className="text-xs font-semibold text-foreground">{v.odBy}</span>
                              {v.feedback && <p className="text-xs text-muted-foreground mt-0.5">{v.feedback}</p>}
                            </div>
                            <span className="text-[10px] text-muted-foreground">{v.timestamp.toLocaleDateString()}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Vote Actions */}
                    {scheme.status === "voting" && !hasVoted && (
                      <div className="flex gap-2">
                        <Button size="sm" className="gap-1.5" onClick={() => setVoteDialog(scheme.id + "-approve")}>
                          <ThumbsUp className="h-4 w-4" /> Approve
                        </Button>
                        <Button size="sm" variant="destructive" className="gap-1.5" onClick={() => setVoteDialog(scheme.id + "-reject")}>
                          <ThumbsDown className="h-4 w-4" /> Reject
                        </Button>
                      </div>
                    )}
                    {hasVoted && <p className="text-xs text-muted-foreground italic">You have already voted on this scheme.</p>}
                  </CardContent>
                </Card>
              );
            })}

            {/* Vote Dialog */}
            <Dialog open={!!voteDialog} onOpenChange={() => setVoteDialog(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{voteDialog?.includes("approve") ? "Approve" : "Reject"} Scheme</DialogTitle>
                  <DialogDescription>Provide your feedback before casting your vote.</DialogDescription>
                </DialogHeader>
                <Textarea
                  value={voteFeedback}
                  onChange={(e) => setVoteFeedback(e.target.value)}
                  placeholder="Share your thoughts, suggestions, or concerns..."
                  rows={4}
                />
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setVoteDialog(null)}>Cancel</Button>
                  <Button
                    variant={voteDialog?.includes("approve") ? "default" : "destructive"}
                    onClick={() => {
                      const [schemeId, decision] = (voteDialog || "").split("-") as [string, "approve" | "reject"];
                      castVote(schemeId, decision);
                    }}
                  >
                    Submit Vote
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* ═══════════════ MEMBERS TAB ═══════════════ */}
        {activeTab === "members" && (
          <div className="grid gap-4 sm:grid-cols-2">
            {ONLINE_USERS.map((u) => (
              <Card key={u.name}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card ${u.online ? "bg-primary" : "bg-muted-foreground/40"}`} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{u.name}</p>
                      <div className="flex items-center gap-1.5">
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">{u.role}</Badge>
                        <span className="text-[10px] text-muted-foreground">{u.online ? "Online" : "Offline"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <Button variant="outline" size="icon" className="h-8 w-8" disabled={!u.online}>
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8" disabled={!u.online}>
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8" disabled={!u.online}>
                      <Video className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
