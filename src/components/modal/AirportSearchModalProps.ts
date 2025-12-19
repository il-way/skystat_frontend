export type AirportSearchModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (icao: string) => void; // 부모에게 선택된 ICAO 전달
  currentIcao?: string;
}