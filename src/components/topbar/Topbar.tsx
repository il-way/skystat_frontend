import type { TopbarProps } from "@/components/topbar/TopbarProps";
import { useState, type JSX } from "react";
import { SidebarTrigger } from "../ui/sidebar";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import AirportSearchModal from "../modal/AirportSearchModal";

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

  const [isSearchOpen, setIsSearchOpen] = useState(false);

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
                readOnly
                onClick={() => setIsSearchOpen(true)}
                placeholder="ICAO"
                className="pl-8 w-full sm:w-28"
              />
            </div>
          </div>

          <div>
            {/* <Label>From</Label> */}
            <Input
              type={props.inputType ?? "date"}
              value={from.split("T")[0]}
              onChange={(e) =>
                props.inputType === undefined
                  ? setFrom(`${e.target.value}T00:00`)
                  : setFrom(e.target.value)
              }
            />
          </div>
          <div>
            {/* <Label>To</Label> */}
            <Input
              type={props.inputType ?? "date"}
              value={to.split("T")[0]}
              onChange={(e) =>
                props.inputType === undefined
                  ? setTo(`${e.target.value}T00:00`)
                  : setTo(e.target.value)
              }
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
                {loading || isFetching ? "Loading..." : "Search"}
              </Button>
            </div>
          </div>

          <AirportSearchModal
            open={isSearchOpen}
            onOpenChange={setIsSearchOpen}
            currentIcao={icao}
            onSelect={(selectedIcao) => {setIcao(selectedIcao);}}
          />
        </div>
      </div>
    </div>
  );
}
