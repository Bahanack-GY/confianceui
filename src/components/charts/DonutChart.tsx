import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface Props {
  data: { label: string; value: number }[];
  height?: number;
  colors?: string[];
}

const DEFAULT_COLORS = ["#091c53", "#4a5db3", "#0ea5a4", "#d97706", "#64748b", "#2563eb"];

export function DonutChart({ data, height = 220, colors = DEFAULT_COLORS }: Props) {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <div className="flex items-center gap-6">
      <div style={{ width: height, height }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="label" innerRadius="62%" outerRadius="92%" strokeWidth={0}>
              {data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
            </Pie>
            <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e4e7ee", borderRadius: 10, fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="flex-1 space-y-2">
        {data.map((d, i) => (
          <li key={d.label} className="flex items-center justify-between text-[13px]">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ background: colors[i % colors.length] }} />
              <span className="text-ink-soft">{d.label}</span>
            </span>
            <span className="tabular-nums text-[color:var(--color-muted)]">
              {d.value} <span className="text-[11px]">({total ? Math.round((d.value / total) * 100) : 0}%)</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
