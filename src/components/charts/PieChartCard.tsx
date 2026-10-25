import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardTitle } from "@/components/ui/card";
import { CHART_COLORS } from "@/utils/constants";
import {
  LEGEND_STYLE,
  TOOLTIP_ITEM_STYLE,
  TOOLTIP_LABEL_STYLE,
  TOOLTIP_STYLE,
} from "@/components/charts/chartTheme";

export function PieChartCard({
  title,
  data,
  height = 340,
}: {
  title: string;
  data: Array<{ name: string; value: number }>;
  height?: number;
}) {
  return (
    <Card className="h-full">
      <CardTitle>{title}</CardTitle>
      <div className="mt-3" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              labelStyle={TOOLTIP_LABEL_STYLE}
              itemStyle={TOOLTIP_ITEM_STYLE}
              animationDuration={200}
            />
            <Legend wrapperStyle={LEGEND_STYLE} iconType="circle" iconSize={8} />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={58}
              outerRadius={98}
              paddingAngle={3}
              cornerRadius={8}
              stroke="rgba(255, 255, 255, 0.9)"
              strokeWidth={2}
              labelLine={false}
              animationDuration={850}
              animationEasing="ease-out"
            >
              {data.map((_, index) => (
                <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
