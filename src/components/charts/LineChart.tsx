import { CartesianGrid, Line, LineChart as RLineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";

interface Series { key: string; name: string; color: string; }

interface Props {
  data: Array<Record<string, number | string>>;
  xKey: string;
  series: Series[];
  height?: number;
}

export function LineChart({ data, xKey, series, height = 260 }: Props) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RLineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
        <CartesianGrid stroke="#eef0f5" vertical={false} />
        <XAxis dataKey={xKey} tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ background: "#fff", border: "1px solid #e4e7ee", borderRadius: 10, fontSize: 12 }}
          cursor={{ stroke: "#e4e7ee" }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        {series.map((s) => (
          <Line
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.name}
            stroke={s.color}
            strokeWidth={2}
            dot={{ r: 3, strokeWidth: 0, fill: s.color }}
            activeDot={{ r: 5, strokeWidth: 0, fill: s.color }}
          />
        ))}
      </RLineChart>
    </ResponsiveContainer>
  );
}
