import { MetarStatisticApi } from "@/api/MetarStatisticApi";
import Hint from "@/components/common/Hint";
import Topbar from "@/components/topbar/Topbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { monthShortNames, toUTCInputFrom, utcInputToISO } from "@/lib/date";
import type { BasicQueryParams } from "@/api/types/request/statistic/BasicQueryParams";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { ResponsiveContainer } from "recharts";
import { Separator } from "@/components/ui/separator";
import ReactEChartsCore from "echarts-for-react/lib/core";
import echarts from "@/utils/echarts";
import { buildEchartOptions, buildWindroseDataset } from "./WindroseHelper";
import { getErrorMessage } from "@/lib/page";
import SimpleAlertModal from "@/components/modal/SimpleAlertModal";
import type { PageTrailStatus } from "@/components/common/types/PageTrailStatus";
import PageTrailstatusBar from "@/components/common/PageTrailstatusBar";
import type { WindroseKpiValues } from "./type/WindroseKpiValues";
import { WindroseKpiGrid } from "./WindroseKpiGrid";
import { usePageScope } from "@/context/scope/usePageScope";
import { PAGE_DEFAULTS } from "@/context/scope/pageDefaults";

export default function Windrose() {
  const { icao, from, to, setIcao, setFrom, setTo } = usePageScope({ pageId: "windrose", defaults: { ...PAGE_DEFAULTS.windrose } });
  const [errOpen, setErrOpen] = useState(false);
  const [errDetails, setErrDetails] = useState("");

  const [loading, setLoading] = useState(false);

  const basicQueryParams: BasicQueryParams = useMemo(
    () => ({
      icao,
      startISO: utcInputToISO(toUTCInputFrom(from)),
      endISO: utcInputToISO(toUTCInputFrom(to)),
    }),
    [icao, from, to]
  );

  const { data, isFetching, isFetched, error, refetch } = useQuery({
    queryKey: ["windrose-stats", basicQueryParams],
    queryFn: async () =>
      MetarStatisticApi.fetchWindRoseStatistic({
        icao,
        startISO: basicQueryParams.startISO,
        endISO: basicQueryParams.endISO,
      }),
    enabled: false,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    const err = error;
    if (err) {
      setErrDetails(getErrorMessage(err));
      setErrOpen(true);
    }
  }, [error]);

  async function handleFetch() {
    setLoading(true);
    try {
      const r = await refetch();
      const e = r.error;
      if (e) {
        setErrDetails(getErrorMessage(e));
        setErrOpen(true);
      }
    } catch {
      setErrOpen(true);
    } finally {
      setLoading(false);
    }
  }

  const [monthSel, setMonthSel] = useState<number>(1);
  const [view, setView] = useState<"graph" | "table">("graph");
  const dataset = useMemo(() => buildWindroseDataset(data), [data]);
  const echartOptions = useMemo(
    () => buildEchartOptions(dataset, monthSel),
    [dataset, monthSel]
  );

  const status: PageTrailStatus = data && data.totalCount > 0
    ? "summary"
    : error === null ? "no-data" : "error";

  const hasData =
    dataset.directionBins.length > 0 &&
    dataset.speedBins.length > 0 &&
    dataset.series[monthShortNames[monthSel - 1]]?.length > 0;

  const kpis: WindroseKpiValues = {
    coverageFrom: data?.coverageFrom ?? "",
    coverageTo: data?.coverageTo ?? "",
    totalCount: data?.totalCount ?? 0,
    sampleSize: data?.sampleSize ?? 0,
    variableSize: data?.variableSize ?? 0,
    speedBins: dataset.speedBins ?? [],
    directionBins: dataset.directionBins ?? [],
    isFetched,
    hasData: data ? data.sampleSize > 0 : false,
  };

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
        inputType="number"
      />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <PageTrailstatusBar page="Windrose" status={status} hint="[%] gusts not included" />

        <WindroseKpiGrid kpis={kpis} />

        <SimpleAlertModal
          open={errOpen}
          onOpenChange={setErrOpen}
          details={errDetails}
          okText="OK"
          blockOutsideClose
        />

        {/* ==== (1) 월별 관측일수: 연도별 or 합계 그래프/테이블 ==== */}
        <Card className="rounded-2xl w-full min-w-0 overflow-hidden">
          <CardHeader className="pb-2 space-y-2">
            <CardTitle className="text-base">
              Monthly Observed
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
                      <ReactEChartsCore
                        echarts={echarts}
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
                      {dataset.speedBins
                        .filter((s) => s.toUpperCase() !== "CALM")
                        .map((s) => (
                          <th key={s} className="py-2 pr-4 text-center">
                            {s}
                          </th>
                        ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dataset.directionBins.map((r, i) => (
                      <tr
                        key={r}
                        className="border-b last:border-none odd:bg-muted/30 hover:bg-muted/40 transition-colors"
                      >
                        <td className="py-2 pr-4 font-medium text-right">
                          {r}
                        </td>
                        {dataset.series[monthShortNames[monthSel - 1]]
                          .filter((s) => s.speedBin.toUpperCase() !== "CALM")
                          .map((s) => (
                            <td
                              key={s.speedBin}
                              className="py-2 pl-2 pr-4 text-center"
                            >
                              {s.data[i]}
                            </td>
                          ))}
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
            Quick Guide — Windrose
          </div>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Set <strong>ICAO</strong> and <strong>UTC range</strong> (From
              inclusive, To exclusive). Click <strong>Search</strong>.
            </li>
            <li>
              The <strong>polar chart</strong> stacks direction-wise <strong>frequency (%)</strong> by <strong>speed bins (kt)</strong>; the center shows <strong>Calm %</strong>. <em className="not-italic">(Gusts are not included)</em>
            </li>
            <li>
              Uses <strong>{dataset.directionBins.length} cardinal directions</strong>.
            </li>
            <li>
              Toggle <strong>Graph/Table</strong> anytime; refine with{" "}
              <strong>total/year</strong> and <strong>month</strong> selectors.
            </li>
            <li>
              Tip: Change the code or date range to compare scenarios; all
              numbers reflect your selected range & filters.
            </li>
          </ul>
        </div>
      </main>
    </>
  );
}
