"use client";
import React, { useState } from "react";

const ChatWindow = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, input]);
    setInput("");
  };

  return (
    <div className="p-4 h-96 flex flex-col justify-between">
      {/* Chat Messages */}
      <div className="overflow-y-auto flex-1 mb-4 border rounded p-2 bg-gray-50">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center">No messages yet.</p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className="mb-2 p-2 bg-blue-100 rounded text-sm text-zinc-800"
            >
              {msg}
            </div>
          ))
        )}
      </div>

      {/* Input Area */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
