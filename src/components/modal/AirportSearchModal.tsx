import { useEffect, useState } from "react";
import type { AirportSearchModalProps } from "./AirportSearchModalProps";
import { useQuery } from "@tanstack/react-query";
import { MetarInventoryApi } from "@/api/MetarInventoryApi";
import { useDebounce } from "@/hooks/useDebounce";
import type { DatasetCoverage } from "@/api/types/response/common/DatasetCoverage";
import { Button } from "../ui/button";
import {
  Calendar,
  CheckCircle,
  Database,
  Loader2,
  Search,
  XCircle,
} from "lucide-react";
import { Input } from "../ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AirportSearchModal(props: AirportSearchModalProps) {
  const { open, onOpenChange, onSelect, currentIcao } = props;

  const [searchTerm, setSearchTerm] = useState(currentIcao);
  const debouncedIcao = useDebounce(searchTerm, 300); // 300ms로 유지

  const {
    data: coverage,
    isLoading,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["airport-coverage", debouncedIcao],
    queryFn: async () => {
      const cacheKey = `airport_coverage_${debouncedIcao}`;

      const cachedData = sessionStorage.getItem(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData) as DatasetCoverage;
      }

      const safeIcao = debouncedIcao || "";
      const data = await MetarInventoryApi.fetchDataCoverage(safeIcao);
      sessionStorage.setItem(cacheKey, JSON.stringify(data));

      return data;
    },
    enabled: (debouncedIcao?.length ?? 0) >= 3,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (open) setSearchTerm(currentIcao);
  }, [open, currentIcao]);

  const fmtDate = (isoString?: string) => {
    if (!isoString) return "-";
    return isoString.replace("T", " ").substring(0, 16);
  };

  // ✅ [수정 포인트] 상태 변수 정의 (JSX를 깔끔하게 하기 위함)

  // 1. 입력이 너무 짧을 때
  const isTooShort = (debouncedIcao || "").length < 3;

  // 2. 데이터 없음 (에러 발생 OR 성공했지만 개수가 0)
  const hasNoData =
    !isTooShort && (isError || (isSuccess && coverage?.totalCount === 0));

  // 3. 데이터 있음 (성공했고 개수가 0보다 큼)
  const hasData =
    !isTooShort && isSuccess && coverage && coverage.totalCount > 0;

  // 선택 핸들러: 데이터가 있을 때만 동작
  const handleSelect = () => {
    if (debouncedIcao && hasData) {
      onSelect(debouncedIcao);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Search Airport</DialogTitle>
          <DialogDescription>
            Enter ICAO code to check data availability.
          </DialogDescription>
        </DialogHeader>

        {/* 검색 입력창 */}
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
            placeholder="e.g. RKSI"
            className="pl-9 uppercase"
            maxLength={4}
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            </div>
          )}
        </div>

        {/* 결과 영역 */}
        <div className="mt-4 space-y-4">
          {/* Case 1: 입력 짧음 */}
          {isTooShort && (
            <div className="text-center text-sm text-muted-foreground py-6">
              Please enter at least 3 characters.
            </div>
          )}

          {/* Case 2: 데이터 없음 (XCircle 적용됨) */}
          {hasNoData && (
            <div className="flex flex-col items-center justify-center p-6 border rounded-lg bg-destructive/10 text-destructive animate-in fade-in zoom-in-95 duration-200">
              <XCircle className="h-8 w-8 mb-2" />
              <p className="font-medium">
                {isError ? "Airport Not Found" : "No Data Available"}
              </p>
              <p className="text-xs opacity-80 mt-1">
                Zero records found for "{debouncedIcao}"
              </p>
            </div>
          )}

          {/* Case 3: 데이터 있음 (CheckCircle) */}
          {hasData && coverage && (
            <div className="border rounded-lg p-4 bg-card shadow-sm animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {debouncedIcao}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Data Available</h4>
                    <p className="text-xs text-muted-foreground">
                      Cached & Ready
                    </p>
                  </div>
                </div>
                <CheckCircle className="text-green-500 h-5 w-5" />
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="col-span-2 bg-muted/50 p-2 rounded flex items-center justify-between">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Database className="h-3.5 w-3.5" /> Total Records
                  </span>
                  <span className="font-mono font-medium">
                    {coverage.totalCount.toLocaleString()}
                  </span>
                </div>

                <div className="bg-muted/50 p-2 rounded space-y-1">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" /> First Data (UTC)
                  </span>
                  <div className="font-mono text-xs">
                    {fmtDate(coverage.firstReportTime)}
                  </div>
                </div>

                <div className="bg-muted/50 p-2 rounded space-y-1">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" /> Last Data (UTC)
                  </span>
                  <div className="font-mono text-xs">
                    {fmtDate(coverage.lastReportTime)}
                  </div>
                </div>
              </div>

              <Button onClick={handleSelect} className="w-full mt-4" size="sm">
                Select {debouncedIcao}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
