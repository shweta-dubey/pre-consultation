"use client";

import { cn } from "@/lib/utils";
import Avatar from "@mui/material/Avatar";
import { Bot, User } from "lucide-react";

export type ChatMessageProps = {
  role: "user" | "bot";
  children: React.ReactNode;
  className?: string;
};

export function ChatMessage({ role, children, className }: ChatMessageProps) {
  const isBot = role === "bot";
  return (
    <div
      className={cn(
        "flex items-start gap-3 w-full animate-in fade-in zoom-in-95",
        isBot ? "justify-start" : "justify-end",
        className
      )}
    >
      {isBot && (
        <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main" }}>
          <Bot className="h-5 w-5 text-primary" />
        </Avatar>
      )}
      <div
        className={cn(
          "max-w-[80%] rounded-lg p-3 text-sm shadow-sm",
          isBot
            ? "bg-card text-card-foreground"
            : "bg-primary text-primary-foreground"
        )}
      >
        {children}
      </div>
      {!isBot && (
        <Avatar sx={{ width: 32, height: 32, bgcolor: "success.main" }}>
          <User className="h-5 w-5 text-primary" />
        </Avatar>
      )}
    </div>
  );
}
