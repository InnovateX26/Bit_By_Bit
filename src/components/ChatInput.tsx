// components/ChatInput.tsx
"use client";

import { useState } from "react";
import { Button } from "./ui/button";

export function ChatInput({ onSend }: { onSend: (msg: string) => void }) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    onSend(input);
    setInput("");
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 px-4 py-2 rounded border border-gray-300"
      />
      <Button onClick={handleSend}>Send</Button>
    </div>
  );
}
