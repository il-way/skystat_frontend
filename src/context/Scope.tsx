import { toLocalInput } from "@/lib/date";
import type { Ctx, Scope } from "@/types/context/Scope";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

function readInitial(): Scope {
  const def: Scope = {
    icao: "KFJK",
    from: toLocalInput(Date.parse("2019-01-01 00:00")),
    to: toLocalInput(Date.parse("2024-01-01 00:00")),
  }

  try {
    const sp = new URLSearchParams(window.location.search);
    const ls = localStorage.getItem("skystat:scope");
    const fromLS = ls ? (JSON.parse(ls) as Scope) : null;

    return {
      icao: sp.get("icao") || fromLS?.icao || def.icao,
      from: sp.get("from") || fromLS?.from || def.from,
      to: sp.get("to") || fromLS?.to || def.to,
    }
  } catch {
    return def;
  }

}

const ScopeContext = createContext<Ctx | undefined>(undefined);

export function ScopeProvider({ children }: { children: React.ReactNode }) {
  const [scope, setScopeState] = useState<Scope>(() => readInitial());
  const setScope = (next: Partial<Scope>) => setScopeState(prev => ({ ...prev, ...next}));

  useEffect(() => {
    localStorage.setItem("skystat:scope", JSON.stringify(scope));
    const sp = new URLSearchParams(window.location.search);
    sp.set("icao", scope.icao);
    sp.set("from", scope.from);
    sp.set("to", scope.to);

    window.history.replaceState(null, "", `${window.location.pathname}?${sp.toString()}`);
  }, [scope]);

  const value = useMemo(() => ({ scope, setScope }), [scope]);
  return <ScopeContext.Provider value={value}>{children}</ScopeContext.Provider>;
}

export function useScope(): Ctx {
  const ctx = useContext(ScopeContext);
  if (!ctx) throw new Error("useScope must be used within <ScopeProvider>");
  return ctx;
}