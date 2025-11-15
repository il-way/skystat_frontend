export type ScopeState = {
  icao: string;
  from: string;
  to: string;
  threshold: string;
}

export type ScopeAction = 
  | { type: "patch", patch: Partial<ScopeState> }
  | { type: "reset", defaults: ScopeState }
