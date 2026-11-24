"use client";

import React, { useState } from "react";
import { UserRole } from "@/types";
import {
  Sparkles,
  MessageSquare,
  X,
  Send,
  Loader2,
  Shield,
  ExternalLink,
  ChevronRight,
  Bot,
  User,
  RotateCcw,
} from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "copilot";
  text: string;
  timestamp: string;
  sources?: string[];
  suggestedActions?: Array<{ label: string; action: string }>;
}

interface AICopilotDrawerProps {
  role: UserRole;
  userName?: string;
  userEmail?: string;
}

export function AICopilotDrawer({
  role,
  userName = "Campus Member",
  userEmail = "user@smartcampus.demo",
}: AICopilotDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-welcome",
      sender: "copilot",
      text: `Hello ${userName}! I am your Smart Campus AI Operations Copilot. How can I assist you today?`,
      timestamp: "Just now",
      sources: ["Smart Campus Knowledge Base"],
      suggestedActions: [
        { label: "Check Campus Incidents", action: "CHECK_INCIDENTS" },
        { label: "Recurring AC Complaints", action: "AC_COMPLAINTS" },
        { label: "Department Workload", action: "DEPT_WORKLOAD" },
      ],
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const suggestedQuestions =
    role === "administrator"
      ? [
          "Which department has the highest number of pending requests?",
          "Show repeated AC complaints in the Computer Science block.",
          "Are there any active emergency incidents right now?",
          "Summarize this week's maintenance SLA compliance.",
        ]
      : role === "faculty"
      ? [
          "Help me report a laboratory equipment issue.",
          "Show classroom readiness in the Engineering Block.",
          "What is the status of my recent service requests?",
        ]
      : [
          "How do I submit an emergency hostel plumbing request?",
          "What are the departmental service turnaround SLAs?",
          "Is the central library open and what is its occupancy?",
        ];

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: query,
          role,
          userName,
          userEmail,
        }),
      });

      if (!res.ok) {
        throw new Error("Copilot service encountered a temporary error.");
      }

      const data = await res.json();
      const copilotMsg: Message = {
        id: `cop-${Date.now()}`,
        sender: "copilot",
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        sources: data.sources || ["Smart Campus Directory"],
        suggestedActions: data.suggestedActions,
      };

      setMessages((prev) => [...prev, copilotMsg]);
    } catch {
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        sender: "copilot",
        text: "I was unable to retrieve a verified response from the campus operations engine. Please check your network connection or try rephrasing your request.",
        timestamp: "Now",
        sources: ["System Diagnostics"],
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (action: string) => {
    if (action === "NAVIGATE_INCIDENTS" || action === "CHECK_INCIDENTS") {
      handleSend("Are there any active emergency incidents right now?");
    } else if (action === "AC_COMPLAINTS") {
      handleSend("Show repeated AC complaints in the Engineering Block.");
    } else if (action === "DEPT_WORKLOAD") {
      handleSend("Which department has the highest number of pending requests?");
    } else if (action === "NAVIGATE_NEW_REQUEST") {
      window.location.href = `/${role === "faculty" ? "faculty" : "student"}/requests/new`;
    } else if (action === "NAVIGATE_MAP") {
      window.location.href = "/student/dashboard";
    } else if (action === "NAVIGATE_COURSES") {
      window.location.href = `/${role === "faculty" ? "faculty" : "student"}/courses`;
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 p-3.5 rounded-2xl bg-[#101828] text-white shadow-xl hover:bg-teal-900 border border-teal-500/30 flex items-center gap-2.5 transition-all hover:scale-105 cursor-pointer group"
        title="Open Smart Campus AI Copilot"
      >
        <div className="w-6 h-6 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
          <Sparkles className="w-4 h-4 animate-pulse" />
        </div>
        <span className="text-xs font-extrabold tracking-tight hidden sm:inline group-hover:text-teal-300">
          Campus AI Copilot
        </span>
      </button>

      {/* Floating Chat Drawer */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 w-[92vw] sm:w-[420px] h-[580px] max-h-[85vh] bg-white rounded-3xl border border-slate-200/90 shadow-2xl z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 duration-200">
          {/* Header */}
          <div className="p-4 bg-[#101828] text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="font-extrabold text-sm flex items-center gap-1.5 leading-none">
                  SmartCampus Copilot
                  <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 font-mono font-bold">
                    Grounded AI
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 font-mono">
                  <Shield className="w-3 h-3 text-teal-400" />
                  Role: <span className="text-slate-200 capitalize font-bold">{role}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() =>
                  setMessages([
                    {
                      id: "msg-reset",
                      sender: "copilot",
                      text: "Conversation cleared. How can I assist your campus operations today?",
                      timestamp: "Now",
                    },
                  ])
                }
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Clear Conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Conversation Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/60 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.sender === "copilot" && (
                  <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] p-3 rounded-2xl shadow-2xs space-y-2 ${
                    m.sender === "user"
                      ? "bg-slate-900 text-white rounded-br-xs"
                      : "bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs"
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>

                  {/* Sources Grounding Tag */}
                  {m.sources && m.sources.length > 0 && (
                    <div className="pt-1.5 border-t border-slate-100 flex flex-wrap items-center gap-1 text-[9px] text-slate-500">
                      <span className="font-semibold text-slate-600">Source:</span>
                      {m.sources.map((s, idx) => (
                        <span key={idx} className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-mono">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Suggested Action Buttons */}
                  {m.suggestedActions && m.suggestedActions.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {m.suggestedActions.map((act, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleActionClick(act.action)}
                          className="px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 text-[10px] font-bold border border-teal-200 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          {act.label}
                          <ChevronRight className="w-3 h-3 text-teal-600" />
                        </button>
                      ))}
                    </div>
                  )}

                  <div
                    className={`text-[9px] ${
                      m.sender === "user" ? "text-slate-400 text-right" : "text-slate-400 text-left"
                    }`}
                  >
                    {m.timestamp}
                  </div>
                </div>

                {m.sender === "user" && (
                  <div className="w-7 h-7 rounded-lg bg-slate-700 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-slate-500 text-xs p-2">
                <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
                <span>Consulting campus knowledge and telemetry...</span>
              </div>
            )}
          </div>

          {/* Quick Suggested Prompts Pills */}
          <div className="p-2.5 bg-white border-t border-slate-100 overflow-x-auto flex gap-1.5 scrollbar-none">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(q)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-[10px] text-slate-700 font-medium transition-colors cursor-pointer shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about campus operations, tickets, or policies..."
              className="flex-1 bg-slate-50 text-xs text-slate-900 px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-teal-500 focus:bg-white transition-all placeholder-slate-400"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="p-2 rounded-xl bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
