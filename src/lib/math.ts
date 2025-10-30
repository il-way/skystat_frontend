export function round2(n: number | null | undefined) {
  return (n == null ? null : Math.round(n*100)/100);
}