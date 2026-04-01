"use client";

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
  PromptInputTools,
  PromptInputAttachments,
  PromptInputAttachment,
  PromptInputActionMenu,
  PromptInputActionMenuTrigger,
  PromptInputActionMenuContent,
  PromptInputActionAddAttachments,
} from "@/components/ai-elements/prompt-input";
import { Action, Actions } from "@/components/ai-elements/actions";
import React, { useState, useEffect, useRef, Suspense } from "react";
import { useChat } from "@ai-sdk/react";
import { Response } from "@/components/ai-elements/response";
import { CopyIcon, Mic, MicOff, Plus } from "lucide-react";
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "@/components/ai-elements/sources";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { Loader } from "@/components/ai-elements/loader";
import { useAuth } from "@/contexts/AuthContext";
import { recordChatMessage, RiskLevel, generateId, saveLocalSession, loadLocalSession } from "@/lib/userMetrics";
import type { PromptInputMessage } from "@/components/ai-elements/prompt-input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSearchParams, useRouter } from "next/navigation";

const AIChatContent = () => {
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("English");
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  
  const queryId = searchParams.get("id");
  const [chatId, setChatId] = useState(queryId || generateId());

  const { messages, sendMessage, status, setMessages } = useChat({
    id: chatId,
  });

  const { user } = useAuth();

  useEffect(() => {
    if (queryId) {
      setChatId(queryId);
      const saved = loadLocalSession(queryId);
      if (saved && Array.isArray(saved) && saved.length > 0) {
        setMessages(saved);
      } else {
        // Legacy chats without detailed local storage history fallback
        setMessages([{
           id: generateId(),
           role: 'assistant',
           parts: [{ type: 'text', text: "I'm sorry! CareBot+ was recently upgraded, and unfortunately the raw array data for this specific older session was not stored. Only sessions created from this point forward will be fully recoverable!" }]
        }]);
      }
    } else {
      const newId = generateId();
      setChatId(newId);
      setMessages([]);
    }
  }, [queryId, setMessages]);

  // Persist aggressively on message change
  useEffect(() => {
    if (messages.length > 0) {
      saveLocalSession(chatId, messages);
    }
  }, [messages, chatId]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        
        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput((prev) => prev ? prev + " " + transcript : transcript);
          setIsRecording(false);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsRecording(false);
        };

        recognitionRef.current.onend = () => {
          setIsRecording(false);
        };
      }
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      if (recognitionRef.current) {
        const langMap: Record<string, string> = { "English": "en-US", "Spanish": "es-ES", "Hindi": "hi-IN", "Bengali": "bn-IN", "French": "fr-FR", "Arabic": "ar-SA" };
        recognitionRef.current.lang = langMap[language] || "en-US";
        recognitionRef.current.start();
        setIsRecording(true);
      }
    }
  };

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

  const handleSubmit = async (message: PromptInputMessage) => {
    const value = (message.text ?? input).trim();
    if (!value && (!message.files || message.files.length === 0)) return;
    
    const parts: any[] = [{ type: 'text', text: value }];
    
    if (message.files && message.files.length > 0) {
      for (const file of message.files) {
        if (file.url) {
          try {
            const response = await fetch(file.url);
            const blob = await response.blob();
            const dataUrl = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });
            parts.push({ 
              type: 'file', 
              url: dataUrl,
              mediaType: file.mediaType || 'image/jpeg',
              filename: file.filename || 'image.jpg'
            });
          } catch (e) {}
        }
      }
    }

    try {
      recordChatMessage(user, chatId, value, value, classifyRisk(value));
    } catch (e) {}
    
    if (language !== "English") {
      parts[0].text = `[Important: You must respond in the ${language} language.]\n\n${value || "Hello"}`;
    }
    
    // @ts-ignore
    sendMessage({ role: 'user', parts });
    setInput("");
    
    // Auto update URL if started new chat without refresh
    if (!queryId) {
      router.replace(`/dashboard/chat?id=${chatId}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full px-2 sm:px-6 relative flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-160px)]">
        <div className="flex items-center justify-between mb-4 bg-white p-3 rounded-xl shadow-sm z-10 shrink-0">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[180px] h-9 bg-white opacity-100 shadow-sm border-slate-200 text-slate-600 transition-colors">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent className="bg-white opacity-100 border border-slate-200 shadow-lg">
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="Spanish">Spanish</SelectItem>
              <SelectItem value="Hindi">Hindi</SelectItem>
              <SelectItem value="Bengali">Bengali</SelectItem>
              <SelectItem value="French">French</SelectItem>
              <SelectItem value="Arabic">Arabic</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.push("/dashboard/chat")}
            className="text-slate-600 hover:text-slate-900 gap-2"
          >
            <Plus className="size-4" />
            New Chat
          </Button>
        </div>

        <Conversation className="flex-1 min-h-0">
          <ConversationContent>
            {messages.map((message) => (
              <div key={message.id}>
                {message.role === "assistant" &&
                  message.parts.filter((part) => part.type === "source-url")
                    .length > 0 && (
                    <Sources>
                      <SourcesTrigger
                        count={
                          message.parts.filter(
                            (part) => part.type === "source-url"
                          ).length
                        }
                      />
                      {message.parts
                        .filter((part) => part.type === "source-url")
                        .map((part, i) => (
                          <SourcesContent key={`${message.id}-${i}`}>
                            <Source
                              key={`${message.id}-${i}`}
                              href={part.url}
                              title={part.url}
                            />
                          </SourcesContent>
                        ))}
                    </Sources>
                  )}
                {message.parts.map((part, i) => {
                  switch (part.type) {
                    case "text":
                      // Hide internal system language prompt visually from history
                      const renderText = part.text.replace(/\[Important: You must respond in the .*? language\.\]\n\n/, "");
                      return (
                        <React.Fragment key={`${message.id}-${i}`}>
                          <Message from={message.role}>
                            <MessageContent>
                              <Response>{renderText}</Response>
                            </MessageContent>
                          </Message>
                          {message.role === "assistant" &&
                            i === messages.length - 1 && (
                              <Actions className="mt-2">
                                <Action
                                  onClick={() =>
                                    navigator.clipboard.writeText(renderText)
                                  }
                                  label="Copy"
                                >
                                  <CopyIcon className="size-3" />
                                </Action>
                              </Actions>
                            )}
                        </React.Fragment>
                      );
                    case "reasoning":
                      return (
                        <Reasoning
                          key={`${message.id}-${i}`}
                          className="w-full"
                          isStreaming={
                            status === "streaming" &&
                            i === message.parts.length - 1 &&
                            message.id === messages.at(-1)?.id
                          }
                        >
                          <ReasoningTrigger />
                          <ReasoningContent>{part.text}</ReasoningContent>
                        </Reasoning>
                      );
                    case "file":
                      return (
                        <React.Fragment key={`${message.id}-${i}`}>
                          <Message from={message.role}>
                            <MessageContent>
                              <div className="flex flex-wrap gap-2 mb-2 p-1">
                                {/* @ts-ignore */}
                                <img src={part.url} alt="attachment" className="max-w-64 max-h-64 object-cover rounded-lg border shadow-sm" />
                              </div>
                            </MessageContent>
                          </Message>
                        </React.Fragment>
                      );
                    default:
                      return null;
                  }
                })}
              </div>
            ))}
            {status === "submitted" && <Loader />}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <div className="shrink-0 mt-4">
          <PromptInput onSubmit={handleSubmit} accept="image/*" multiple>
            <PromptInputAttachments>
              {(file) => <PromptInputAttachment data={file} />}
            </PromptInputAttachments>
            <PromptInputTextarea
              onChange={(e) => setInput(e.target.value)}
              value={input}
            />
            <PromptInputToolbar>
              <PromptInputTools>
                <PromptInputActionMenu>
                  <PromptInputActionMenuTrigger />
                  <PromptInputActionMenuContent>
                    <PromptInputActionAddAttachments />
                  </PromptInputActionMenuContent>
                </PromptInputActionMenu>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`rounded-lg transition-colors ${isRecording ? 'text-red-500 bg-red-50' : 'text-slate-500'}`} 
                  onClick={toggleRecording}
                  type="button"
                  title="Voice Input"
                >
                  {isRecording ? <MicOff className="size-4" /> : <Mic className="size-4" />}
                </Button>
              </PromptInputTools>
              <PromptInputSubmit disabled={!input && input.length === 0} status={status} />
            </PromptInputToolbar>
          </PromptInput>
        </div>
    </div>
  );
};

export default function AIChat() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader /></div>}>
      <AIChatContent />
    </Suspense>
  );
}