import { MetarStatisticApi } from "@/api/MetarStatisticApi";
import Hint from "@/components/common/Hint";
import Topbar from "@/components/topbar/Topbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { localInputToISO, monthShortNames, toLocalInput } from "@/lib/date";
import type { BasicQueryParams } from "@/types/api/request/statistic/BasicQueryParams";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  BarChart,
  Customized,
  Legend,
  PolarAngleAxis,
  PolarGrid,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
} from "recharts";
import { WindroseTooltip } from "./WindroseTooltip";
// import { CenterCalmLabel } from "./CenterCalmLabel";
import { Separator } from "@/components/ui/separator";
import ReactECharts from "echarts-for-react";
import { buildEchartOptions, buildWindroseDataset } from "./WindroseHelper";

export default function Windrose() {
  const [icao, setIcao] = useState("KJFK");
  const [from, setFrom] = useState(
    toLocalInput(Date.parse("2019-01-01 00:00"))
  );
  const [to, setTo] = useState(toLocalInput(Date.parse("2023-01-01 00:00")));

  const [loading, setLoading] = useState(false);

  const basicQueryParams: BasicQueryParams = useMemo(
    () => ({
      icao,
      startISO: localInputToISO(from),
      endISO: localInputToISO(to),
    }),
    [icao, from, to]
  );

  const { data, isFetching, error, refetch } = useQuery({
    queryKey: ["altimeter-threshold-stats", basicQueryParams],
    queryFn: async () =>
      MetarStatisticApi.fetchWindRoseStatistic({
        icao,
        startISO: basicQueryParams.startISO,
        endISO: basicQueryParams.endISO,
      }),
    enabled: false,
    placeholderData: keepPreviousData,
  });

  async function handleFetch() {
    setLoading(true);
    try {
      await refetch();
    } finally {
      setLoading(false);
    }
  }

  const [monthSel, setMonthSel] = useState<number>(1);
  const [view, setView] = useState<"graph" | "table">("graph");
  const dataset = useMemo(() => buildWindroseDataset(data), [data]);
  const echartOptions = useMemo(() => buildEchartOptions(dataset, monthSel), [
    dataset,
    monthSel,
  ]);

  const hasData =
    dataset.directionBins.length > 0 &&
    dataset.speedBins.length > 0 &&
    dataset.series[monthShortNames[monthSel - 1]]?.length > 0;

  return (
    <>
      <Topbar
        icao={icao}
        setIcao={setIcao}
        from={from}
        setFrom={setFrom}
        to={to}
        setTo={setTo}
        loading={loading}
        isFetching={isFetching}
        onFetch={handleFetch}
      />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Analytics</span>
            <span>/</span>
            <span className="text-foreground">Windrose</span>
            <Hint text="[kt]" />
          </div>
          {data && data.totalCount > 0 ? (
            <Badge variant="secondary">Summary</Badge>
          ) : error === null ? (
            <Badge variant="destructive">No Data</Badge>
          ) : (
            <Badge variant="destructive">Error</Badge>
          )}
        </div>

        {/* <ThresholdKpiCardGrid kpis={kpis} /> */}

        {/* ==== (1) 월별 관측일수: 연도별 or 합계 그래프/테이블 ==== */}
        <Card className="rounded-2xl w-full min-w-0 overflow-hidden">
          <CardHeader className="pb-2 space-y-2">
            <CardTitle className="text-base">
              Windrose (gust not included)
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select
                value={String(monthSel)}
                onValueChange={(v) => setMonthSel(Number(v))}
              >
                <SelectTrigger className="h-8 w-28">
                  <SelectValue placeholder="month" />
                </SelectTrigger>
                <SelectContent>
                  {monthShortNames.map((m, i) => (
                    <SelectItem key={m} value={String(i + 1)}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="ml-auto flex gap-2">
                <Button
                  size="sm"
                  variant={view === "graph" ? "default" : "secondary"}
                  onClick={() => setView("graph")}
                >
                  Graph
                </Button>
                <Button
                  size="sm"
                  variant={view === "table" ? "default" : "secondary"}
                  onClick={() => setView("table")}
                >
                  Table
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent
            className={`w-full min-w-0 ${view === "graph" ? "h-160" : ""}`}
          >
            {view === "graph" ? (
              <div className="w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <div className="w-full">
                    {hasData ? (
                      <ReactECharts
                        option={echartOptions}
                        style={{ width: "100%", height: "100%" }}
                        notMerge={true}
                        lazyUpdate={true}
                      />
                    ) : (
                      <Hint text="No data to display." />
                    )}
                  </div>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <colgroup>
                    <col className="w-1/7" />
                    <col className="w-1/7" />
                    <col className="w-1/7" />
                    <col className="w-1/7" />
                    <col className="w-1/7" />
                    <col className="w-1/7" />
                    <col className="w-1/7" />
                  </colgroup>
                  <thead className="text-left text-muted-foreground border-b">
                    <tr>
                      <th className="py-2 pr-4 text-right">Direction</th>
                      {dataset.speedBins.filter(s => s.toUpperCase()!=="CALM").map((s) => (
                        <th key={s} className="py-2 pr-4 text-center">
                          {s}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dataset.directionBins.map((r,i) => (
                      <tr
                        key={r}
                        className="border-b last:border-none odd:bg-muted/30 hover:bg-muted/40 transition-colors"
                      >
                        <td className="py-2 pr-4 font-medium text-right">{r}</td>
                        {dataset.series[monthShortNames[monthSel - 1]]
                          .filter(s => s.speedBin.toUpperCase()!=="CALM")
                          .map((s) => (
                            <td key={s.speedBin} className="py-2 pl-2 pr-4 text-center">
                              {s.data[i]}
                            </td>
                          ))
                        
                        }
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <Separator />
        {/* Next steps */}
        <div className="text-sm text-muted-foreground leading-6">
          <div className="font-medium text-foreground mb-1">
            Next steps (실전 적용 가이드)
          </div>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              여기가 있어야 가로폭이 유지됨. 글자수 따라 보이는 가로폭이 달라짐
              최소폭으로 했을 때 2줄로 보이도록 글을 좀 써야됨
            </li>
          </ul>
        </div>
      </main>
    </>
  );
}