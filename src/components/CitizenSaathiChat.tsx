"use client";

import { useState } from "react";
import { Send, Bot, User, ShieldAlert, MessageSquare } from "lucide-react";

export default function CitizenSaathiChat() {
  const [messages, setMessages] = useState([
    { role: "bot", content: "Namaskaram! I am CitizenSaathi. How can I help you with air quality updates for Hyderabad today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/enforcement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userMsg })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "bot", content: data.response }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: "bot", content: "I am having trouble connecting to the network right now. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] glass rounded-xl overflow-hidden border border-white/10">
      <div className="bg-slate-800/80 p-4 border-b border-white/5 flex items-center gap-3">
        <div className="bg-green-500/20 p-2 rounded-full">
          <MessageSquare className="w-5 h-5 text-green-400" />
        </div>
        <div>
          <h3 className="font-semibold text-white">CitizenSaathi</h3>
          <p className="text-xs text-green-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse"></span>
            Online (Telugu / English)
          </p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-blue-600" : "bg-slate-700"}`}>
              {msg.role === "user" ? <User size={16} className="text-white" /> : <Bot size={16} className="text-green-400" />}
            </div>
            <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${
              msg.role === "user" 
                ? "bg-blue-600 text-white rounded-tr-sm" 
                : "bg-slate-800/80 text-slate-200 rounded-tl-sm border border-white/5"
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3 flex-row">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
              <Bot size={16} className="text-green-400" />
            </div>
            <div className="bg-slate-800/80 rounded-2xl rounded-tl-sm p-3 border border-white/5 flex gap-1 items-center h-10 w-16">
              <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
              <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-900/50 border-t border-white/5">
        <div className="relative flex items-center">
          <input
            type="text"
            className="w-full bg-slate-800 border border-white/10 rounded-full py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="Ask about AQI in your ward..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="absolute right-2 p-2 bg-blue-600 hover:bg-blue-500 rounded-full text-white transition-colors disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
