"use client";

export type RiskLevel = "low" | "moderate" | "high" | "critical";

export interface HistoryItem {
  id: string;
  title: string;
  snippet: string;
  risk: RiskLevel;
  date: string;
}

export interface UserMetrics {
  totalChats: number;
  medQueries: number;
  emergencies: number;
  highRisk: number;
  chatHistory: HistoryItem[];
  medHistory: HistoryItem[];
}

const STORAGE_KEY = "carebot_user_metrics_v1";

type MetricsStore = Record<string, UserMetrics>;

const defaultMetrics = (): UserMetrics => ({
  totalChats: 0,
  medQueries: 0,
  emergencies: 0,
  highRisk: 0,
  chatHistory: [],
  medHistory: [],
});

const nowText = () =>
  new Date().toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export const generateId = () => {
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }
  } catch {
    // ignore and fallback
  }
  return `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
};

const toUserKey = (user?: { id?: string; email?: string } | null) => {
  if (!user) return "guest";
  return user.id || user.email || "guest";
};

const readStore = (): MetricsStore => {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as MetricsStore) : {};
  } catch {
    return {};
  }
};

const writeStore = (store: MetricsStore) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
};

const updateMetrics = (
  user: { id?: string; email?: string } | null | undefined,
  updater: (current: UserMetrics) => UserMetrics
) => {
  const store = readStore();
  const key = toUserKey(user);
  const current = store[key] || defaultMetrics();
  store[key] = updater(current);
  writeStore(store);
};

const withHistoryLimit = (items: HistoryItem[], limit = 20) => items.slice(0, limit);

export const getUserMetrics = (user?: { id?: string; email?: string } | null): UserMetrics => {
  const store = readStore();
  const key = toUserKey(user);
  return store[key] || defaultMetrics();
};

export const recordChatMessage = (
  user: { id?: string; email?: string } | null | undefined,
  id: string,
  title: string,
  snippet?: string,
  risk: RiskLevel = "low"
) => {
  updateMetrics(user, (current) => {
    const isHighRisk = risk === "high" || risk === "critical";
    const existingIndex = current.chatHistory.findIndex(h => h.id === id);
    let newHistory = [...current.chatHistory];
    
    // If it exists, overwrite it so we don't dupe history items on every sync
    if (existingIndex !== -1) {
      newHistory[existingIndex] = { ...newHistory[existingIndex], snippet: (snippet || title).trim() };
      return { ...current, chatHistory: newHistory };
    }

    return {
      ...current,
      totalChats: current.totalChats + 1,
      highRisk: current.highRisk + (isHighRisk ? 1 : 0),
      chatHistory: withHistoryLimit([
        {
          id,
          title: title.trim(),
          snippet: (snippet || title).trim(),
          risk,
          date: nowText(),
        },
        ...newHistory,
      ]),
    };
  });
};

export const recordMedicationQuery = (
  user: { id?: string; email?: string } | null | undefined,
  id: string,
  query: string,
  responseSnippet: string,
  risk: RiskLevel = "low"
) => {
  updateMetrics(user, (current) => {
    const isHighRisk = risk === "high" || risk === "critical";
    
    const existingIndex = current.medHistory.findIndex(h => h.id === id);
    let newHistory = [...current.medHistory];

    if (existingIndex !== -1) {
      newHistory[existingIndex] = { ...newHistory[existingIndex], snippet: responseSnippet.trim() };
      return { ...current, medHistory: newHistory };
    }

    return {
      ...current,
      medQueries: current.medQueries + 1,
      highRisk: current.highRisk + (isHighRisk ? 1 : 0),
      medHistory: withHistoryLimit([
        {
          id,
          title: query.trim(),
          snippet: responseSnippet.trim(),
          risk,
          date: nowText(),
        },
        ...newHistory,
      ]),
    };
  });
};

export const deleteHistoryItem = (
  user: { id?: string; email?: string } | null | undefined,
  id: string,
  type: "chat" | "med"
) => {
  updateMetrics(user, (current) => {
    if (type === "chat") {
      return { ...current, chatHistory: current.chatHistory.filter(c => c.id !== id)};
    } else {
      return { ...current, medHistory: current.medHistory.filter(c => c.id !== id)};
    }
  });

  // Remove persistent cached raw session payloads smoothly
  if (typeof window !== "undefined") {
    localStorage.removeItem(`carebot_session_${id}`);
  }
};

export const recordEmergencyEvent = (
  user: { id?: string; email?: string } | null | undefined,
  symptom: string,
  severity: RiskLevel
) => {
  updateMetrics(user, (current) => {
    const isHighRisk = severity === "high" || severity === "critical";
    return {
      ...current,
      emergencies: current.emergencies + 1,
      highRisk: current.highRisk + (isHighRisk ? 1 : 0),
    };
  });
};

// Local storage session payload helpers
export const saveLocalSession = (id: string, data: any) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(`carebot_session_${id}`, JSON.stringify(data));
};

export const loadLocalSession = (id: string | null) => {
  if (typeof window === "undefined" || !id) return null;
  const raw = localStorage.getItem(`carebot_session_${id}`);
  return raw ? JSON.parse(raw) : null;
};
