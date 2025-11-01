import { Badge } from "../ui/badge";
import Hint from "./Hint";
import type { PageTrailStatus } from "./types/PageTrailStatus";

type PageTrailstatusBarProps = { page: string; status: PageTrailStatus; hint?: string };

export default function PageTrailstatusBar(props: PageTrailstatusBarProps) {
  const { page, status, hint } = props;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Analytics</span>
        <span>/</span>
        <span className="text-foreground">{page}</span>
        {hint ? <Hint text={hint} /> : null}
      </div>
      <StatusLabel status={status} />
    </div>
  );
}

function StatusLabel({ status }: { status: PageTrailStatus }) {
  switch (status) {
    case "summary":
      return <Badge variant="secondary">Summary</Badge>;
    case "no-data":
      return <Badge variant="destructive">No Data</Badge>;
    case "error":
      return <Badge variant="destructive">Error</Badge>;
    default:
      return <Badge variant="secondary">preview</Badge>;
  }
}