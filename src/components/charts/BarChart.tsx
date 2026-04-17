import { Bar, BarChart as RBarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface Props {
  data: { label: string; value: number }[];
  color?: string;
  height?: number;
  horizontal?: boolean;
}

export function BarChart({ data, color = "#091c53", height = 260, horizontal }: Props) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RBarChart
        data={data}
        layout={horizontal ? "vertical" : "horizontal"}
        margin={{ top: 8, right: 8, bottom: 0, left: horizontal ? 40 : -16 }}
      >
        <CartesianGrid stroke="#eef0f5" vertical={false} horizontal={!horizontal} />
        {horizontal ? (
          <>
            <XAxis type="number" tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="label" tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} width={100} />
          </>
        ) : (
          <>
            <XAxis dataKey="label" tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
          </>
        )}
        <Tooltip
          contentStyle={{ background: "#fff", border: "1px solid #e4e7ee", borderRadius: 10, fontSize: 12 }}
          cursor={{ fill: "#f1f3f8" }}
        />
        <Bar dataKey="value" fill={color} radius={[6, 6, 0, 0]} />
      </RBarChart>
    </ResponsiveContainer>
  );
}
