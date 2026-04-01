"use client";
import { useEffect, useState } from "react";

type Message = {
  id: string;
  question: string;
  answer: string;
  timestamp: string;
};

export default function HistoryPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace with actual API call to MongoDB
    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/history");
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error("Failed to fetch history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Your Chat History</h2>
      {loading ? (
        <p>Loading...</p>
      ) : messages.length === 0 ? (
        <p className="text-gray-500">No history found.</p>
      ) : (
        <ul className="space-y-4">
          {messages.map((msg) => (
            <li key={msg.id} className="border p-4 rounded shadow">
              <p className="font-semibold">Q: {msg.question}</p>
              <p className="text-gray-700">A: {msg.answer}</p>
              <p className="text-xs text-gray-400">{new Date(msg.timestamp).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}