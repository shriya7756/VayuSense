"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, MessageSquare, Mic, Info } from "lucide-react";

interface Message {
  role: "bot" | "user";
  content: string;
  timestamp: Date;
}

const suggestions = [
  "What is the AQI in Hyderabad today?",
  "Is it safe to go for a morning walk?",
  "హైదరాబాద్‌లో గాలి నాణ్యత ఎలా ఉంది?",
  "Which areas in Hyderabad have the worst air quality?",
  "What should children avoid doing today?",
];

export default function CitizenPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      content: "Namaskaram! I'm CitizenSaathi, your AI air quality assistant for Hyderabad. I can answer your questions in English or Telugu. Ask me about AQI levels, health advisories, or safe outdoor times! 🌿",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text?: string) => {
    const query = (text ?? input).trim();
    if (!query) return;

    setMessages((prev) => [...prev, { role: "user", content: query, timestamp: new Date() }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/.netlify/functions/enforcement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: data.response ?? "I'm sorry, I couldn't process that request.", timestamp: new Date() },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content:
            "I'm having trouble connecting to the server right now. Please ensure the COHERE_API_KEY is configured in Netlify environment variables. Try again shortly! 🔧",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (d: Date) =>
    d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-[1200px] mx-auto flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <MessageSquare className="text-purple-400" />
          CitizenSaathi
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Multilingual AI assistant · English & Telugu · Powered by Cohere Command R+
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
        {/* Suggestions Sidebar */}
        <div className="space-y-4">
          <div className="glass rounded-xl p-4 border border-purple-500/20">
            <div className="flex items-center gap-2 text-purple-400 text-sm font-semibold mb-3">
              <Info size={14} /> Try asking...
            </div>
            <div className="space-y-2">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(s)}
                  className="w-full text-left text-sm text-slate-300 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="glass rounded-xl p-4 border border-white/5">
            <p className="text-xs text-slate-500 leading-relaxed">
              <strong className="text-slate-400">Privacy:</strong> Your queries are processed securely via Netlify Serverless Functions. No data is stored beyond your session.
            </p>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="md:col-span-2 flex flex-col h-[600px] glass rounded-xl overflow-hidden border border-white/10">
          {/* Chat Header */}
          <div className="bg-slate-800/80 px-4 py-3 border-b border-white/5 flex items-center gap-3">
            <div className="bg-green-500/20 p-2 rounded-full">
              <Bot className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">CitizenSaathi</h3>
              <p className="text-xs text-green-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
                Online · Hyderabad Air Quality Expert
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-blue-600" : "bg-slate-700"}`}>
                  {msg.role === "user" ? <User size={14} className="text-white" /> : <Bot size={14} className="text-green-400" />}
                </div>
                <div className={`max-w-[78%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col`}>
                  <div className={`rounded-2xl p-3 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-tr-sm"
                      : "bg-slate-800/80 text-slate-200 rounded-tl-sm border border-white/5"
                  }`}>
                    {msg.content}
                  </div>
                  <span className="text-xs text-slate-600 mt-1 px-1">{formatTime(msg.timestamp)}</span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 flex-row">
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
                  <Bot size={14} className="text-green-400" />
                </div>
                <div className="bg-slate-800/80 rounded-2xl rounded-tl-sm p-3 border border-white/5 flex gap-1.5 items-center h-10">
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-slate-900/50 border-t border-white/5">
            <div className="flex items-center gap-2">
              <input
                type="text"
                className="flex-1 bg-slate-800 border border-white/10 rounded-full py-3 px-4 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors placeholder:text-slate-500"
                placeholder="Ask about AQI, health tips, or type in Telugu..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !loading && sendMessage()}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className="p-3 bg-purple-600 hover:bg-purple-500 rounded-full text-white transition-colors disabled:opacity-40 shrink-0"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
