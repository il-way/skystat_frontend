import Hint from "../common/Hint";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function KpiCard({ title, value, hint }: { title: string; value: string; hint?: string }) {
  return (
    <Card className="xl:w-60 lg:w-46">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold leading-none tracking-tight">{value}</div>
        <Hint text={hint} />
      </CardContent>
    </Card>
  )
}

