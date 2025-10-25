import type { TopbarProps } from "@/types/components/topbar/TopbarProps";
import type { JSX } from "react";
import { SidebarTrigger } from "../ui/sidebar";
import { Search } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function Topbar(props: TopbarProps): JSX.Element {
  const {
    icao,
    setIcao,
    from,
    setFrom,
    to,
    setTo,
    loading,
    isFetching,
    onFetch,
    rightSlot,
  } = props;

  return (
    <div className="sticky top-0 z-10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:items-end sm:gap-3 w-full min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <SidebarTrigger className="mr-1" />

            <div className="relative w-full sm:w-28">
              <Search className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              {/* <Label>ICAO</Label> */}
              <Input
                value={icao}
                onChange={(e) => setIcao(e.target.value.toUpperCase())}
                placeholder="e.g., RKSI"
                className="pl-8 w-full sm:w-28"
              />
            </div>
          </div>

          <div>
            {/* <Label>From</Label> */}
            <Input
              type="datetime-local"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>

          <div>
            {/* <Label>To</Label> */}
            <Input
              type="datetime-local"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>

          <div className="flex items-end gap-3 w-full sm:w-auto justify-between sm:justify-end sm:ml-auto">
            <div className="flex justify-between w-full sm:w-auto">
              {rightSlot}
              <Button
                onClick={onFetch}
                disabled={loading || isFetching}
                className={`rounded-2xl ${rightSlot ? "" : "w-full"} sm:w-20`}
              >
                {loading || isFetching ? "Loading..." : "Fetch"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
