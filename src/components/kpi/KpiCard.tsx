import Hint from "../common/Hint";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function KpiCard({ title, value, hint }: { title: string; value: string; hint?: string }) {
  return (
    <Card className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <CardHeader className="p-0 pb-2">
        <CardTitle className="text-xs text-slate-500">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="text-2xl font-semibold leading-none tracking-tight text-slate-900">{value}</div>
        <Hint text={hint} />
      </CardContent>
    </Card>
  )
}

