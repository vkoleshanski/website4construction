import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { defaultSiteContent, type SiteContent } from "@/content/defaultContent";

const STORAGE_KEY = "format4-site-content-v1";

interface SiteContentContextValue {
  content: SiteContent;
  saveContent: (next: SiteContent) => void;
  resetContent: () => void;
  exportContent: () => string;
  importContent: (rawJson: string) => { ok: boolean; message: string };
}

const SiteContentContext = createContext<SiteContentContextValue | null>(null);

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const mergeWithDefaults = <T,>(defaults: T, override: unknown): T => {
  if (Array.isArray(defaults)) {
    return (Array.isArray(override) ? override : defaults) as T;
  }

  if (isObject(defaults)) {
    if (!isObject(override)) {
      return defaults;
    }

    const next = { ...defaults } as Record<string, unknown>;
    for (const key of Object.keys(defaults)) {
      next[key] = mergeWithDefaults(
        (defaults as Record<string, unknown>)[key],
        (override as Record<string, unknown>)[key],
      );
    }
    return next as T;
  }

  return (override ?? defaults) as T;
};

const readStoredContent = (): SiteContent => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSiteContent;

    const parsed = JSON.parse(raw) as unknown;
    return mergeWithDefaults(defaultSiteContent, parsed);
  } catch {
    return defaultSiteContent;
  }
};

export const SiteContentProvider = ({ children }: { children: React.ReactNode }) => {
  const [content, setContent] = useState<SiteContent>(() => readStoredContent());

  const saveContent = useCallback((next: SiteContent) => {
    const normalized = mergeWithDefaults(defaultSiteContent, next);
    setContent(normalized);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  }, []);

  const resetContent = useCallback(() => {
    setContent(defaultSiteContent);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const exportContent = useCallback(() => JSON.stringify(content, null, 2), [content]);

  const importContent = useCallback(
    (rawJson: string) => {
      try {
        const parsed = JSON.parse(rawJson) as unknown;
        const merged = mergeWithDefaults(defaultSiteContent, parsed);
        setContent(merged);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        return { ok: true, message: "Съдържанието е импортирано успешно." };
      } catch {
        return { ok: false, message: "Невалиден JSON файл. Проверете формата и опитайте отново." };
      }
    },
    [],
  );

  const value = useMemo(
    () => ({ content, saveContent, resetContent, exportContent, importContent }),
    [content, saveContent, resetContent, exportContent, importContent],
  );

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
};

export const useSiteContentContext = () => {
  const context = useContext(SiteContentContext);
  if (!context) {
    throw new Error("useSiteContentContext must be used within SiteContentProvider");
  }
  return context;
};
