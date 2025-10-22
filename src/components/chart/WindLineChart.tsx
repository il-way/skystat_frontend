import type { WindLineProps } from "@/types/components/charts/WindLineProps";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { JSX } from "react";

export default function WindLineChart(props: WindLineProps): JSX.Element {
  const { data } = props;

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="text-base">Wind Speed Over Time</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="t" />
            <YAxis />
            <Tooltip formatter={(value: number, name: string) => [`${value} KT`, name]}/>
            <Line type="monotone" dataKey="wind" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
