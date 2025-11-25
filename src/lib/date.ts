import type { MonthIdx, MonthShortName, MonthValue } from "@/types/dates/Dates";

export function toUTCInput(dt: number | string | Date): string {
  try {
    const d = new Date(dt);
    const pad = (n: number) => String(n).padStart(2, "0");
    const yyyy = d.getUTCFullYear();
    const mm = pad(d.getUTCMonth() + 1);
    const dd = pad(d.getUTCDate());
    const hh = pad(d.getUTCHours());
    const mi = pad(d.getUTCMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
  } catch {
    return "";
  }
}

export function toUTCInputFrom(year: number | string): string {
  try {
    const d = new Date(Number(year), 0, 1, 0, 0);
    const yyyy = d.getFullYear();
    const mm = "01";
    const dd = "01";
    const hh = "00";
    const mi = "00";
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
  } catch {
    return "";
  }
}

export function utcInputToISO(local: string): string {
  try {
    const [datePart, timePart] = local.split("T");
    if (!datePart || !timePart) return "";
    const [y, m, d] = datePart.split("-").map(Number);
    const [hh, mi] = timePart.split(":").map(Number);
    const ms = Date.UTC(y, (m ?? 1) - 1, d ?? 1, hh ?? 0, mi ?? 0, 0, 0);
    return new Date(ms).toISOString();
  } catch {
    return "";
  }
}


export function toLocalInput(dt: number | string | Date): string {
  try {
    const d = new Date(dt);
    const pad = (n: number) => String(n).padStart(2, "0");
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const mi = pad(d.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;  
  } catch {
    return ""
  }
}

export function localInputToISO(local: string): string {
  try {
    return new Date(local).toISOString();
  } catch {
    return "";
  }
  
}

export const monthValues: MonthValue[] = [1,2,3,4,5,6,7,8,9,10,11,12];
export const monthIndex: MonthIdx[] = [0,1,2,3,4,5,6,7,8,9,10,11];
export const monthShortNames: MonthShortName[] = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

export function monthShortNameFrom(monthValue: number) {
  return monthShortNames[monthValue-1];
}

export function getYearsFrom(coverageFrom: string, coverageTo: string) {
  const from = localInputToISO(coverageFrom);
  const to = localInputToISO(coverageTo);

  return [from.slice(0,4), to.slice(0,4)];
}

export function validatePeriod(from: string, to: string) {
  const fromDt = new Date(from).getTime();
  const toDt = new Date(to).getTime();
  if (isNaN(fromDt) || isNaN(toDt)) {
    throw new Error("Invalid date format");
  }

  if (fromDt >= toDt) {
    throw new Error("Invalid period: Start date must be before end date");
  }

  return fromDt < toDt;
}