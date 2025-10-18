import type { TopbarProps } from "@/types/components/topbar/TopbarProps";
import type { JSX } from "react";
import { SidebarTrigger } from "../ui/sidebar";
import { Search } from "lucide-react";
import { Label } from "recharts";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function Topbar(props: TopbarProps): JSX.Element {
  const { icao, setIcao, from, setFrom, to, setTo, loading, qFetching, onFetch } = props;
  
  return (
    <div className="sticky top-0 z-10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-wrap items-end gap-3">
          <SidebarTrigger className="mr-1" />
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <div>
              <Label>ICAO</Label>
              <Input
                value={icao}
                onChange={(e) => setIcao(e.target.value.toUpperCase())}
                placeholder="e.g., RKSI"
                className="w-28"
              />
            </div>
          </div>

          <div>
            <Label>From</Label>
            <Input
              type="datetime-local"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>

          <div>
            <Label>To</Label>
            <Input
              type="datetime-local"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>

          <div className="ml-auto">
            <Button
              onClick={onFetch}
              disabled={loading || qFetching}
              className="rounded-2xl"
            >
              {loading || qFetching ? "Loading..." : "Fetch"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
