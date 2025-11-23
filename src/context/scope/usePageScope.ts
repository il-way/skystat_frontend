import { ssKey } from "@/lib/storageKeys";
import type { ScopeState } from "./Scope";
import { useEffect, useMemo, useReducer } from "react";
import { scopeReducer } from "./scopeReducer";
import { PAGE_ID_THRESHOLD, type PageId } from "./pageDefaults";

export function usePageScope(opts: { pageId: PageId; defaults: ScopeState }) {
  const { pageId, defaults } = opts;
  const SS_KEY = ssKey(pageId);
  const initial = useMemo<ScopeState>(() => {
    const saved = loadFromSession(SS_KEY);
    if (saved?.icao && saved.from && saved?.to) return saved;

    return { ...defaults };
  }, []);

  const [state, dispatch] = useReducer(scopeReducer, initial);

  useEffect(() => { saveToSession(SS_KEY, state) }, [SS_KEY, state]);

  const result = {
    ...state,
    setIcao: (v: string) =>
      dispatch({ type: "patch", patch: { icao: v.toUpperCase() } }),
    setFrom: (v: string) =>
      dispatch({ type: "patch", patch: { from: v } }),
    setTo: (v: string) =>
      dispatch({ type: "patch", patch: { to: v } }),
    reset: () =>
      dispatch({ type: "reset", defaults }),
    setThreshold: (v: string) => {
      if (PAGE_ID_THRESHOLD[pageId]) return dispatch({ type: "patch", patch: { threshold: v } });
    }
  };

  return result;
}

function loadFromSession(key: string): ScopeState | null {
  if (!isBroswer()) return null;
  try {
    const sessionValue = sessionStorage.getItem(key);
    return sessionValue ? (JSON.parse(sessionValue) as ScopeState) : null;
  } catch {
    return null;
  }
}

function saveToSession(key: string, value: ScopeState) {
  if (!isBroswer()) return;
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    return;
  }
}

function isBroswer() {
  return typeof window !== "undefined";
}