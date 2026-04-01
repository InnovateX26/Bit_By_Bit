import api from '../lib/api';

export interface ChatMessage {
  id?: string;
  message: string;
  sender?: 'user' | 'bot';
  timestamp?: Date;
  sessionId?: string;
}

export interface ChatResponse {
  success: boolean;
  message?: string;
  data?: any;
  sessionId?: string;
}

const chatService = {
  sendMessage: async (message: string, sessionId?: string): Promise<ChatResponse> => {
    try {
      const response = await api.post('/chat/message', { message, sessionId });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Error sending message' };
    }
  },

  getHistory: async (sessionId: string): Promise<ChatMessage[]> => {
    try {
      const response = await api.get(`/chat/history/${sessionId}`);
      return response.data.messages || [];
    } catch (error: any) {
      throw error.response?.data || { message: 'Error fetching chat history' };
    }
  },

  // Generate a new session ID
  generateSessionId: (): string => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  // Store session ID in localStorage
  setSessionId: (sessionId: string) => {
    localStorage.setItem('chatSessionId', sessionId);
  },

  // Get session ID from localStorage
  getSessionId: (): string | null => {
    return localStorage.getItem('chatSessionId');
  },

  // Clear session ID
  clearSessionId: () => {
    localStorage.removeItem('chatSessionId');
  }
};

export default chatService;
