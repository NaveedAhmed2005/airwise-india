import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useHub } from "@/contexts/HubContext";
import type { ChatMessage, Scheme } from "@/contexts/HubContext";
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
  Phone, Video, User, Globe, Lock, ArrowLeft
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

type Tab = "chat" | "schemes" | "members";

export default function CollectorHub() {
  const { user, approvedCollectorsList } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("chat");
  const [messages, setMessages] = useState<ChatMessage[]>(SEED_MESSAGES);
  const [schemes, setSchemes] = useState<Scheme[]>(SEED_SCHEMES);
  const [chatInput, setChatInput] = useState("");
  const [showNewScheme, setShowNewScheme] = useState(false);
  const [expandedScheme, setExpandedScheme] = useState<string | null>(null);
  const [voteDialog, setVoteDialog] = useState<string | null>(null);
  const [voteFeedback, setVoteFeedback] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [newScheme, setNewScheme] = useState({ title: "", brief: "", dprFileName: "", implementationPlan: "", budgetEstimation: "" });

  // Private DM state: null = public broadcast channel, string = email of DM recipient
  const [dmRecipient, setDmRecipient] = useState<string | null>(null);
  const dmRecipientInfo = dmRecipient ? approvedCollectorsList.find((m) => m.email === dmRecipient) : null;

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  if (!user || (user.role !== "collector" && user.role !== "admin")) {
    return <Navigate to="/login" replace />;
  }

  // Filter messages: public channel shows all broadcast messages; DM channel shows only DMs between user & recipient
  const visibleMessages = messages.filter((msg) => {
    if (!dmRecipient) return msg.to === null; // public broadcast only
    return (
      (msg.senderEmail === user.email && msg.to === dmRecipient) ||
      (msg.senderEmail === dmRecipient && msg.to === user.email)
    );
  });

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    setMessages((prev) => [...prev, {
      id: `msg-${Date.now()}`,
      sender: user.name,
      senderEmail: user.email,
      role: user.role as "admin" | "collector",
      content: chatInput.trim(),
      timestamp: new Date(),
      to: dmRecipient,
    }]);
    setChatInput("");
  };

  const submitScheme = () => {
    if (!newScheme.title || !newScheme.brief || !newScheme.implementationPlan || !newScheme.budgetEstimation) return;
    setSchemes((prev) => [{
      id: `S${Date.now()}`, ...newScheme,
      dprFileName: newScheme.dprFileName || "DPR_Document.pdf",
      proposedBy: user.name, proposedByRole: user.role as "admin" | "collector",
      proposedAt: new Date(), status: "voting", votes: [],
    }, ...prev]);
    setNewScheme({ title: "", brief: "", dprFileName: "", implementationPlan: "", budgetEstimation: "" });
    setShowNewScheme(false);
  };

  const castVote = (schemeId: string, decision: "approve" | "reject") => {
    setSchemes((prev) =>
      prev.map((s) => {
        if (s.id !== schemeId) return s;
        if (s.votes.some((v) => v.odBy === user.name)) return s;
        return { ...s, votes: [...s.votes, { odBy: user.name, vote: decision, feedback: voteFeedback, timestamp: new Date() }] };
      })
    );
    setVoteFeedback("");
    setVoteDialog(null);
  };

  // Count unread DMs per member (simple: messages from them to us)
  const getDmCount = (email: string) => messages.filter((m) => m.senderEmail === email && m.to === user.email).length;

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "chat", label: "Team Chat", icon: <MessageSquare className="h-4 w-4" /> },
    { key: "schemes", label: "Schemes & Voting", icon: <Vote className="h-4 w-4" /> },
    { key: "members", label: "Members", icon: <Users className="h-4 w-4" /> },
  ];

  const openDm = (email: string) => {
    setDmRecipient(email);
    setActiveTab("chat");
  };

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
          <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
            {/* Sidebar: channels + DM list */}
            <Card className="hidden lg:block">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Channels & DMs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 p-3">
                {/* Public channel */}
                <button
                  onClick={() => setDmRecipient(null)}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                    !dmRecipient ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <Globe className="h-4 w-4" /> Public Channel
                </button>

                <div className="mt-3 mb-1 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Direct Messages</div>
                {approvedCollectorsList
                  .filter((m) => m.email !== user.email)
                  .map((m) => {
                    const count = getDmCount(m.email);
                    return (
                      <button
                        key={m.email}
                        onClick={() => setDmRecipient(m.email)}
                        className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                          dmRecipient === m.email ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        <User className="h-3.5 w-3.5" />
                        <span className="flex-1 text-left truncate">{m.name}</span>
                        {count > 0 && <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">{count}</span>}
                      </button>
                    );
                  })}
              </CardContent>
            </Card>

            {/* Chat area */}
            <Card className="overflow-hidden">
              <CardHeader className="border-b border-border pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {dmRecipient && (
                      <Button variant="ghost" size="icon" className="h-8 w-8 lg:hidden" onClick={() => setDmRecipient(null)}>
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                    )}
                    <div>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        {dmRecipient ? (
                          <><Lock className="h-4 w-4 text-muted-foreground" /> {dmRecipientInfo?.name || "DM"}</>
                        ) : (
                          <><Globe className="h-4 w-4 text-primary" /> Public Channel</>
                        )}
                      </CardTitle>
                      <CardDescription>
                        {dmRecipient ? "Private conversation" : "Messages visible to all collectors & admin"}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1.5" disabled><Phone className="h-4 w-4" /> Call</Button>
                    <Button variant="outline" size="sm" className="gap-1.5" disabled><Video className="h-4 w-4" /> Video</Button>
                  </div>
                </div>
                {/* Mobile DM selector */}
                <div className="mt-3 flex gap-1.5 overflow-x-auto lg:hidden">
                  <Badge
                    variant={!dmRecipient ? "default" : "outline"}
                    className="cursor-pointer whitespace-nowrap"
                    onClick={() => setDmRecipient(null)}
                  >
                    <Globe className="mr-1 h-3 w-3" /> Public
                  </Badge>
                  {approvedCollectorsList
                    .filter((m) => m.email !== user.email)
                    .map((m) => (
                      <Badge
                        key={m.email}
                        variant={dmRecipient === m.email ? "default" : "outline"}
                        className="cursor-pointer whitespace-nowrap"
                        onClick={() => setDmRecipient(m.email)}
                      >
                        {m.name}
                      </Badge>
                    ))}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[400px] overflow-y-auto p-4 space-y-4">
                  {visibleMessages.length === 0 && (
                    <p className="text-center text-sm text-muted-foreground py-8">
                      {dmRecipient ? "No messages yet. Start the conversation!" : "No messages in the public channel."}
                    </p>
                  )}
                  {visibleMessages.map((msg) => {
                    const isSelf = msg.senderEmail === user.email;
                    return (
                      <div key={msg.id} className={`flex gap-3 ${isSelf ? "flex-row-reverse" : ""}`}>
                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${msg.role === "admin" ? "bg-destructive/10" : "bg-primary/10"}`}>
                          <User className={`h-4 w-4 ${msg.role === "admin" ? "text-destructive" : "text-primary"}`} />
                        </div>
                        <div className={`max-w-[70%] ${isSelf ? "text-right" : ""}`}>
                          <div className={`mb-1 flex items-center gap-2 ${isSelf ? "justify-end" : ""}`}>
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
                    <Input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder={dmRecipient ? `Message ${dmRecipientInfo?.name}...` : "Message everyone..."} className="flex-1" />
                    <Button type="submit" disabled={!chatInput.trim()}><Send className="h-4 w-4" /></Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ═══════════════ SCHEMES TAB ═══════════════ */}
        {activeTab === "schemes" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-foreground">Schemes & Initiatives</h2>
              <Button onClick={() => setShowNewScheme(!showNewScheme)} className="gap-1.5"><FileText className="h-4 w-4" /> Propose New Scheme</Button>
            </div>

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
                    <Textarea value={newScheme.brief} onChange={(e) => setNewScheme((p) => ({ ...p, brief: e.target.value }))} placeholder="Describe the scheme..." rows={3} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">DPR Upload (Detailed Project Report)</label>
                    <div className="mt-1 flex items-center gap-3">
                      <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border bg-muted px-4 py-3 text-sm text-muted-foreground hover:bg-accent transition-colors">
                        <Upload className="h-4 w-4" /> Upload PDF
                        <input type="file" accept=".pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) setNewScheme((p) => ({ ...p, dprFileName: f.name })); }} />
                      </label>
                      {newScheme.dprFileName && <span className="text-sm text-primary font-medium">{newScheme.dprFileName}</span>}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Implementation Plan</label>
                    <Textarea value={newScheme.implementationPlan} onChange={(e) => setNewScheme((p) => ({ ...p, implementationPlan: e.target.value }))} placeholder="Phase 1: ..." rows={4} />
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
                          <Badge variant={scheme.status === "approved" ? "default" : scheme.status === "rejected" ? "destructive" : "secondary"}>
                            {scheme.status === "voting" && <Clock className="mr-1 h-3 w-3" />}
                            {scheme.status === "approved" && <CheckCircle2 className="mr-1 h-3 w-3" />}
                            {scheme.status === "rejected" && <XCircle className="mr-1 h-3 w-3" />}
                            {scheme.status.charAt(0).toUpperCase() + scheme.status.slice(1)}
                          </Badge>
                          <Badge variant="outline" className="text-[10px]">{scheme.proposedByRole}</Badge>
                        </div>
                        <CardTitle className="text-lg">{scheme.title}</CardTitle>
                        <CardDescription className="mt-1">Proposed by {scheme.proposedBy} • {scheme.proposedAt.toLocaleDateString()}</CardDescription>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="flex items-center gap-1 text-primary"><ThumbsUp className="h-4 w-4" /> {approves}</span>
                        <span className="flex items-center gap-1 text-destructive"><ThumbsDown className="h-4 w-4" /> {rejects}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{scheme.brief}</p>
                    <button onClick={() => setExpandedScheme(isExpanded ? null : scheme.id)} className="flex items-center gap-1 text-sm font-medium text-primary hover:underline mb-3">
                      <Eye className="h-4 w-4" /> {isExpanded ? "Hide" : "View"} Full Details
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

                    {scheme.status === "voting" && !hasVoted && (
                      <div className="flex gap-2">
                        <Button size="sm" className="gap-1.5" onClick={() => setVoteDialog(scheme.id + "-approve")}><ThumbsUp className="h-4 w-4" /> Approve</Button>
                        <Button size="sm" variant="destructive" className="gap-1.5" onClick={() => setVoteDialog(scheme.id + "-reject")}><ThumbsDown className="h-4 w-4" /> Reject</Button>
                      </div>
                    )}
                    {hasVoted && <p className="text-xs text-muted-foreground italic">You have already voted on this scheme.</p>}
                  </CardContent>
                </Card>
              );
            })}

            <Dialog open={!!voteDialog} onOpenChange={() => setVoteDialog(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{voteDialog?.includes("approve") ? "Approve" : "Reject"} Scheme</DialogTitle>
                  <DialogDescription>Provide your feedback before casting your vote.</DialogDescription>
                </DialogHeader>
                <Textarea value={voteFeedback} onChange={(e) => setVoteFeedback(e.target.value)} placeholder="Share your thoughts..." rows={4} />
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setVoteDialog(null)}>Cancel</Button>
                  <Button
                    variant={voteDialog?.includes("approve") ? "default" : "destructive"}
                    onClick={() => {
                      const [schemeId, decision] = (voteDialog || "").split("-") as [string, "approve" | "reject"];
                      castVote(schemeId, decision);
                    }}
                  >Submit Vote</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* ═══════════════ MEMBERS TAB ═══════════════ */}
        {activeTab === "members" && (
          <div className="grid gap-4 sm:grid-cols-2">
            {approvedCollectorsList.map((m) => {
              const isSelf = m.email === user.email;
              return (
                <Card key={m.email}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card ${isSelf ? "bg-primary" : "bg-muted-foreground/40"}`} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{m.name} {isSelf && <span className="text-xs text-muted-foreground">(You)</span>}</p>
                        <div className="flex items-center gap-1.5">
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">{m.role}</Badge>
                          <span className="text-[10px] text-muted-foreground">{isSelf ? "Online" : "Available"}</span>
                        </div>
                      </div>
                    </div>
                    {!isSelf && (
                      <div className="flex gap-1.5">
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => openDm(m.email)}>
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8" disabled>
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8" disabled>
                          <Video className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
