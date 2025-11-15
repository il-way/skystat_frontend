import type { ScopeAction, ScopeState } from "./Scope";

export function scopeReducer(state: ScopeState, action: ScopeAction): ScopeState {
  switch (action.type) {
    case "patch":
      return { ...state, ...action.patch };
    case "reset":
      return { ...action.defaults };
    default:
      return state;
  }
}