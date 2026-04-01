import { useChat } from '@ai-sdk/react';
const { sendMessage } = useChat();
const x: typeof sendMessage = 1 as any;
