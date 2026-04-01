import { UIMessage } from 'ai';
export const msg: Extract<UIMessage['parts'][number], { type: 'file' }> = {} as any;
msg.url === '';
msg.data === '';
msg.image === '';
