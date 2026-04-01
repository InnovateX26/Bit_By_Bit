"use client";
import React from "react";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: string;
  sender: "user" | "ai";
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, sender }) => {
  const isUser = sender === "user";

  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[80%] rounded-2xl p-3 text-sm whitespace-pre-line shadow-sm",
          isUser
            ? "bg-green-600 text-white rounded-br-none"
            : "bg-gray-100 text-gray-900 rounded-bl-none"
        )}
      >
        {message}
      </div>
    </div>
  );
};

export default MessageBubble;
