import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
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

export function BarChartCard({
  title,
  data,
  xKey,
  barKey,
  name,
  height = 360,
  valueFormatter,
  colorful = false,
}: {
  title: string;
  data: Array<Record<string, string | number>>;
  xKey: string;
  barKey: string;
  name?: string;
  height?: number;
  valueFormatter?: (value: number) => string;
  colorful?: boolean;
}) {
  return (
    <Card className="h-full">
      <CardTitle>{title}</CardTitle>
      <div className="mt-3" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 6, right: 6, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="4 6" stroke={GRID_STROKE} vertical={false} />
            <XAxis
              dataKey={xKey}
              tick={AXIS_TICK}
              interval={0}
              angle={-20}
              textAnchor="end"
              height={72}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tick={AXIS_TICK}
              tickLine={false}
              axisLine={false}
              width={valueFormatter ? 88 : 44}
              tickFormatter={valueFormatter ? (value: number) => valueFormatter(value) : undefined}
            />
            <Tooltip
              cursor={{ fill: "rgba(245, 158, 11, 0.08)" }}
              contentStyle={TOOLTIP_STYLE}
              labelStyle={TOOLTIP_LABEL_STYLE}
              itemStyle={TOOLTIP_ITEM_STYLE}
              animationDuration={200}
              formatter={valueFormatter ? (value) => valueFormatter(Number(value)) : undefined}
            />
            <Legend wrapperStyle={LEGEND_STYLE} iconType="circle" iconSize={8} />
            <Bar
              dataKey={barKey}
              name={name ?? barKey}
              fill="#d97706"
              radius={[9, 9, 3, 3]}
              maxBarSize={64}
              animationDuration={800}
              animationEasing="ease-out"
            >
              {colorful &&
                data.map((_, index) => (
                  <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
