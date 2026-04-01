import { useChat } from '@ai-sdk/react';

type T = ReturnType<typeof useChat>;

// generate an error to print out type
const t: T = 1 as any;
