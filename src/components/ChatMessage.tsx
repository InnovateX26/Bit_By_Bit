// components/ChatMessage.tsx

export function ChatMessage({ message }: { message: string }) {
  return (
    <div className="p-2 rounded bg-blue-100 text-gray-800 w-fit max-w-md">
      {message}
    </div>
  );
}
