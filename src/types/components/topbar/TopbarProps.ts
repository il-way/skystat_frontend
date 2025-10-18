export type TopbarProps = {
  icao: string,
  setIcao: (v: string) => void;
  from: string;
  setFrom: (v: string) => void;
  to: string;
  setTo: (v: string) => void;
  loading: boolean;
  qFetching: boolean;
  onFetch: () => void;
};