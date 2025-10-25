export type Scope = { icao: string; from: string; to: string };
export type Ctx = {
  scope: Scope;
  setScope: (next: Partial<Scope>) => void;
}