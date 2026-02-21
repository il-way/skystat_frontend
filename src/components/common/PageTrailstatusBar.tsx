import { Badge } from "../ui/badge";
import Hint from "./Hint";
import type { PageTrailStatus } from "./types/PageTrailStatus";
import { useTranslation } from "react-i18next";

type PageTrailstatusBarProps = { page: string; status: PageTrailStatus; hint?: string };

export default function PageTrailstatusBar(props: PageTrailstatusBarProps) {
  const { t } = useTranslation();
  const { page, status, hint } = props;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>{t("trail.analytics")}</span>
        <span>/</span>
        <span className="text-foreground">{page}</span>
        {hint ? <Hint text={hint} /> : null}
      </div>
      <StatusLabel status={status} />
    </div>
  );
}

function StatusLabel({ status }: { status: PageTrailStatus }) {
  const { t } = useTranslation();

  switch (status) {
    case "summary":
      return <Badge variant="secondary">{t("trail.summary")}</Badge>;
    case "no-data":
      return <Badge variant="destructive">{t("trail.noData")}</Badge>;
    case "error":
      return <Badge variant="destructive">{t("trail.error")}</Badge>;
    case "preview":
      return <Badge variant="secondary">{t("trail.preview")}</Badge>;
    default:
      return <Badge variant="secondary">{t("trail.preview")}</Badge>;
  }
}
