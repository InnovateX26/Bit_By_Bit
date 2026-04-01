"use client";

import React, { useState } from "react";
import { useChat } from "@ai-sdk/react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
} from "@/components/ai-elements/prompt-input";
import { Response } from "@/components/ai-elements/response";
import { CopyIcon } from "lucide-react";
import { Actions, Action } from "@/components/ai-elements/actions";
import { Loader } from "@/components/ai-elements/loader";
import { useAuth } from "@/contexts/AuthContext";
import { recordChatMessage, RiskLevel } from "@/lib/userMetrics";

const ChatPage = () => {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat();
  const { user } = useAuth();

  const classifyRisk = (text: string): RiskLevel => {
    const value = text.toLowerCase();
    if (
      value.includes("chest pain") ||
      value.includes("breathing") ||
      value.includes("unconscious") ||
      value.includes("stroke") ||
      value.includes("heavy bleeding") ||
      value.includes("suicidal")
    ) {
      return "high";
    }
    return "low";
  };

  const handleSubmit = (message: { text?: string }) => {
    const value = (message.text ?? input).trim();
    if (!value) return;
    try {
      recordChatMessage(user, value, value, classifyRisk(value));
    } catch (e) {
      // ignore metrics errors
    }
    sendMessage({ text: value });
    setInput("");
  };

  return (
    <div className="min-h-screen bg-sky-50">
      <div className="max-w-4xl mx-auto px-6 pb-40">
        <div className="flex flex-col items-stretch">
          <Conversation className="h-full py-8">
            <ConversationContent>
              {messages.map((message) => (
                <div key={message.id}>
                  {message.parts.map((part, i) => {
                    if (part.type === "text") {
                      return (
                        <React.Fragment key={`${message.id}-${i}`}>
                          <Message from={message.role}>
                            <MessageContent>
                              <Response>{part.text}</Response>
                            </MessageContent>
                          </Message>
                          {message.role === "assistant" &&
                            i === messages.length - 1 && (
                              <Actions className="mt-2">
                                <Action
                                  onClick={() =>
                                    navigator.clipboard.writeText(part.text)
                                  }
                                  label="Copy"
                                >
                                  <CopyIcon className="size-3" />
                                </Action>
                              </Actions>
                            )}
                        </React.Fragment>
                      );
                    }
                    return null;
                  })}
                </div>
              ))}
              {status === "submitted" && <Loader />}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>
        </div>
      </div>

      {/* fixed input dock */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center pointer-events-none">
        <div className="w-full max-w-4xl px-6 pointer-events-auto">
          <PromptInput onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md">
            <PromptInputTextarea
              onChange={(e) => setInput(e.target.value)}
              value={input}
              placeholder="What would you like to know?"
            />
            <PromptInputToolbar>
              <PromptInputSubmit variant="outline" disabled={!input} status={status} />
            </PromptInputToolbar>
          </PromptInput>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
