import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User, Sparkles } from "lucide-react";
import { useApp } from "../context/AppContext";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

export default function SupportChat() {
  const { theme, language } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "bot_init",
      sender: "bot",
      text: "Assalam-o-Alaikum! Hello! I am your Bazaar Plaza AI Co-pilot Support. How may I assist you with your orders, products, or checkout today? (Urdu aur Roman Urdu mein bhi raabta kar sakte hain!)",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async (customMessage?: string) => {
    const textToSend = customMessage || input;
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: "u_" + Date.now(),
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customMessage) setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat-support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend }),
      });

      const data = await response.json();
      if (response.ok && data.text) {
        setMessages((prev) => [
          ...prev,
          {
            id: "bot_" + Date.now(),
            sender: "bot",
            text: data.text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        throw new Error(data.error || "Failed AI response");
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: "bot_err_" + Date.now(),
          sender: "bot",
          text: "Zaruri Paigham: Backend is operating in demomode but checkout is fully safe! (Try applying WELCOME50 or Bazaar20 code!)",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const selectSuggested = (query: string) => {
    handleSend(query);
  };

  const suggestions = [
    { label: "💰 Discount Code Coupon Check?", query: "Give me the list of active shopping coupons please!" },
    { label: "📦 Delivery Time?", query: "How many days it takes to deliver?" },
    { label: "اردو گفتگو کریں", query: "Bhai, kya aap Urdu ya Roman Urdu mein baat kar sakte ho? Mujhe guidance chahiye." },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Action Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          id="chat_trigger"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:bg-slate-800 dark:bg-amber-500 dark:text-slate-950 dark:hover:bg-amber-400"
        >
          <MessageSquare className="h-6 w-6 animate-pulse" />
        </button>
      )}

      {/* Structured Chat Dialog Panel */}
      {isOpen && (
        <div
          id="chat_container"
          className="flex h-[520px] w-96 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all duration-300 dark:border-slate-800 dark:bg-slate-950"
        >
          {/* Conversation Header */}
          <div className="flex items-center justify-between border-b border-gray-100 bg-slate-900 px-4 py-3 text-white dark:bg-slate-900">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-slate-950 font-bold">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold tracking-tight text-white flex items-center gap-1.5">
                  Bazaar AI Agent <Sparkles className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                </h3>
                <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span> Live & Multilingual Ready
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Stream container */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto bg-slate-50/50 p-4 space-y-3 dark:bg-slate-900/40"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2 ${m.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    m.sender === "user" ? "bg-slate-800 text-white" : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {m.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div
                  className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-xs shadow-sm leading-relaxed ${
                    m.sender === "user"
                      ? "bg-slate-900 text-white rounded-tr-none dark:bg-slate-800"
                      : "bg-white text-slate-800 rounded-tl-none border border-slate-100 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-200"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>
                  <span className="mt-1 block text-right text-[9px] text-slate-400 font-mono">
                    {m.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-amber-800">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="max-w-[75%] rounded-2xl rounded-tl-none border border-slate-100 bg-white px-3.5 py-2.5 text-xs text-slate-400 dark:bg-slate-950 dark:border-slate-800">
                  <div className="flex gap-1 items-center py-1">
                    <span className="h-2 w-2 rounded-full bg-slate-300 animate-bounce"></span>
                    <span className="h-2 w-2 rounded-full bg-slate-300 animate-bounce delay-100"></span>
                    <span className="h-2 w-2 rounded-full bg-slate-300 animate-bounce delay-200"></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick FAQ Suggested prompt selectors */}
          {messages.length < 5 && (
            <div className="p-2 border-t border-gray-100 space-y-1.5 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/70">
              <p className="text-[10px] text-slate-400 font-medium px-1">Quick Questions:</p>
              <div className="flex flex-col gap-1">
                {suggestions.map((s, index) => (
                  <button
                    key={index}
                    onClick={() => selectSuggested(s.query)}
                    className="w-full text-left text-[11px] bg-white border border-slate-200 px-2 py-1.5 rounded-lg text-slate-700 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input field actions */}
          <div className="border-t border-gray-100 p-3 bg-white dark:border-slate-800 dark:bg-slate-950">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask our e-commerce co-pilot..."
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs focus:border-amber-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-amber-400"
              />
              <button
                onClick={() => handleSend()}
                className="rounded-xl bg-slate-950 px-3 py-2 text-white hover:bg-slate-900 dark:bg-amber-500 dark:text-slate-950 dark:hover:bg-amber-400 transition"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
