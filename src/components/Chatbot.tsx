import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: Date;
}

const FAQ: Record<string, string> = {
  "aqi": "AQI (Air Quality Index) is a scale from 0-500 that measures air pollution levels. 0-50 is Good, 51-100 Moderate, 101-200 Unhealthy, 201-300 Very Unhealthy, 301-500 Hazardous.",
  "carbon credit": "Carbon credits are tradable certificates representing the right to emit one tonne of CO₂. Companies exceeding limits must purchase credits, creating a market incentive to reduce emissions.",
  "toll gate": "Our toll gate monitoring system tracks vehicle emissions in real-time across India's highways, identifying high-pollution vehicles and assessing their AQI impact.",
  "pollution": "Key pollutants include PM2.5, PM10, NO₂, SO₂, CO, and O₃. PM2.5 is the most dangerous as it penetrates deep into lungs. Wear N95 masks on high-pollution days.",
  "mask": "N95 masks filter 95% of airborne particles. Use them when AQI exceeds 200. Cloth masks are ineffective against PM2.5 pollution.",
  "plant": "Air-purifying plants like Snake Plant, Aloe Vera, Peace Lily, and Spider Plant can improve indoor air quality. NASA recommends 1 plant per 100 sq ft.",
  "prediction": "Our AQI prediction model uses historical data, seasonal patterns, and trend analysis to forecast air quality up to 1 year ahead for all Indian states.",
  "collector": "Data collectors are verified government officials who gather real-time environmental data. They must register with live photo and IAS ID proof, subject to admin approval.",
  "policy": "India's key environmental policies include NCAP (National Clean Air Programme), BS-VI emission standards, and upcoming Carbon Trading Scheme and Zero Emission Zones.",
  "help": "I can help you with:\n• AQI information & health advice\n• Carbon credits & trading\n• Toll gate monitoring\n• Pollution precautions\n• Platform features\n• Government policies\n\nJust type your question!",
};

function getBotResponse(input: string): string {
  const lower = input.toLowerCase();
  
  for (const [key, value] of Object.entries(FAQ)) {
    if (lower.includes(key)) return value;
  }
  
  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
    return "Hello! 👋 Welcome to Monitor India. I'm your AQI assistant. Ask me about air quality, carbon credits, pollution precautions, or any platform feature!";
  }
  if (lower.includes("thank")) {
    return "You're welcome! 🌿 Stay safe and breathe clean air. Feel free to ask anything else!";
  }
  if (lower.includes("weather") || lower.includes("temperature")) {
    return "I focus on air quality rather than weather. However, weather significantly affects AQI — cold, calm days trap pollutants near the ground, while rain helps clear the air.";
  }
  if (lower.includes("health") || lower.includes("safe")) {
    return "When AQI is high:\n• Stay indoors, keep windows closed\n• Use air purifiers with HEPA filters\n• Wear N95 masks outdoors\n• Avoid outdoor exercise\n• Keep emergency medicines handy\n• Monitor AQI updates on our dashboard";
  }
  
  return "I'm not sure about that. Try asking about AQI, carbon credits, pollution, toll gates, health precautions, or government policies. Type 'help' to see all topics I can assist with!";
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "bot",
      content: "Hi! 👋 I'm your Monitor India assistant. Ask me anything about air quality, carbon credits, or environmental policies!",
      timestamp: new Date(),
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: `u-${Date.now()}`, role: "user", content: input.trim(), timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      const botMsg: Message = { id: `b-${Date.now()}`, role: "bot", content: getBotResponse(input), timestamp: new Date() };
      setMessages((prev) => [...prev, botMsg]);
    }, 600);
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow-green transition-all hover:scale-110 active:scale-95"
          aria-label="Open chatbot"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-50"></span>
            <span className="relative inline-flex h-4 w-4 rounded-full bg-primary"></span>
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-elevated" style={{ height: "520px" }}>
          {/* Header */}
          <div className="flex items-center justify-between bg-primary px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-foreground/20">
                <Bot className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-primary-foreground">AQI Assistant</h3>
                <p className="text-xs text-primary-foreground/70">Always online</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="rounded-lg p-1.5 text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "bot" && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                    msg.role === "user"
                      ? "rounded-br-sm bg-primary text-primary-foreground"
                      : "rounded-bl-sm bg-muted text-foreground"
                  }`}
                >
                  {msg.content}
                </div>
                {msg.role === "user" && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent">
                    <User className="h-4 w-4 text-accent-foreground" />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="flex gap-1.5 overflow-x-auto px-4 pb-2">
            {["AQI Info", "Health Tips", "Carbon Credits", "Help"].map((q) => (
              <button
                key={q}
                onClick={() => { setInput(q); }}
                className="shrink-0 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="border-t border-border p-3">
            <form
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <Button type="submit" size="icon" className="h-10 w-10 shrink-0 rounded-xl" disabled={!input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
