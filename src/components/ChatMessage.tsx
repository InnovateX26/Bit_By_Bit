// components/ChatMessage.tsx

export function ChatMessage({ message }: { message: string }) {
  return (
    <div className="p-2 rounded bg-white text-gray-800 w-fit max-w-md">
      {message}
    </div>
  );
}
