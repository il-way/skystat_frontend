import { monthValues } from "./date";

export function buildMonthlyCountMap() {
  const result: Record<number, number> = {};
  monthValues.forEach(mv => result[mv] = 0);
  
  return result;
}