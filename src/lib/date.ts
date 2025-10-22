import type { MonthIdx, MonthShortName, MonthValue } from "@/types/dates/Dates";

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
  } catch (error) {
    return ""
  }
}

export function localInputToISO(local: string): string {
  try {
    return new Date(local).toISOString();
  } catch (error) {
    return "";
  }
  
}

export const monthValues: MonthValue[] = [1,2,3,4,5,6,7,8,9,10,11,12];
export const monthIndex: MonthIdx[] = [0,1,2,3,4,5,6,7,8,9,10,11];
export const monthShortName: MonthShortName[] = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

export function monthShortNameFrom(monthValue: number) {
  return monthShortName[monthValue-1];
}