import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardTitle } from "@/components/ui/card";
import { CHART_COLORS } from "@/utils/constants";
import {
  AXIS_TICK,
  GRID_STROKE,
  LEGEND_STYLE,
  TOOLTIP_ITEM_STYLE,
  TOOLTIP_LABEL_STYLE,
  TOOLTIP_STYLE,
} from "@/components/charts/chartTheme";

export interface LineSeries {
  key: string;
  name: string;
  color?: string;
  dashed?: boolean;
}

export function LineChartCard({
  title,
  data,
  xKey,
  series,
  height = 340,
  valueFormatter,
  zoomToData = false,
}: {
  title: string;
  data: Array<Record<string, string | number>>;
  xKey: string;
  series: LineSeries[];
  height?: number;
  valueFormatter?: (value: number) => string;
  zoomToData?: boolean;
}) {
  return (
    <Card className="h-full">
      <CardTitle>{title}</CardTitle>
      <div className="mt-3" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="4 6" stroke={GRID_STROKE} vertical={false} />
            <XAxis
              dataKey={xKey}
              tick={AXIS_TICK}
              minTickGap={28}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tick={AXIS_TICK}
              tickLine={false}
              axisLine={false}
              width={valueFormatter ? 88 : 44}
              domain={
                zoomToData
                  ? [(min: number) => Math.floor(min * 0.97), (max: number) => Math.ceil(max * 1.03)]
                  : undefined
              }
              tickFormatter={valueFormatter ? (value: number) => valueFormatter(value) : undefined}
            />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              labelStyle={TOOLTIP_LABEL_STYLE}
              itemStyle={TOOLTIP_ITEM_STYLE}
              animationDuration={200}
              formatter={valueFormatter ? (value) => valueFormatter(Number(value)) : undefined}
            />
            <Legend wrapperStyle={LEGEND_STYLE} iconType="circle" iconSize={8} />
            {series.map((item, index) => (
              <Line
                key={item.key}
                type="monotone"
                dataKey={item.key}
                name={item.name}
                stroke={item.color ?? CHART_COLORS[index % CHART_COLORS.length]}
                strokeDasharray={item.dashed ? "6 5" : undefined}
                strokeWidth={2.5}
                strokeLinecap="round"
                dot={false}
                activeDot={{ r: 5, strokeWidth: 2, stroke: "#ffffff" }}
                animationDuration={850}
                animationEasing="ease-out"
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
