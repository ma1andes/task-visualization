import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface HistoryGraphProps {
  data: Array<Record<string, number | string | null>>;
  selectedTags: string[];
  colorMap: Record<string, string>;
  height?: number;
}

const HistoryGraph: React.FC<HistoryGraphProps> = ({
  data,
  selectedTags,
  colorMap,
  height = 420,
}) => {
  const formatXAxis = (value: unknown) => {
    if (typeof value === "number") {
      const tsMs = value < 2_000_000_000 ? value * 1000 : value;
      const d = new Date(tsMs);
      return `${d.getHours().toString().padStart(2, "0")}:${d
        .getMinutes()
        .toString()
        .padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")}`;
    }
    if (typeof value === "string") {
      const num = Number(value);
      if (!Number.isNaN(num)) return formatXAxis(num);
      return value;
    }
    return String(value ?? "");
  };

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={formatXAxis}
            stroke="#aaa"
          />
          <YAxis stroke="#aaa" domain={["auto", "auto"]} allowDataOverflow />
          <Tooltip
            contentStyle={{ background: "#1a1a1a", border: "1px solid #333" }}
            labelStyle={{ color: "#fff" }}
            formatter={(value: unknown) =>
              typeof value === "number" ? value.toLocaleString() : String(value)
            }
            labelFormatter={(label) => `t: ${formatXAxis(label)}`}
          />
          <Legend wrapperStyle={{ color: "#ddd" }} />

          {selectedTags.map((tagId) => (
            <Line
              key={tagId}
              type="monotone"
              dataKey={(d: any) => (d ? (d[tagId] as number | null) : null)}
              name={tagId}
              stroke={colorMap[tagId] || "#8884d8"}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HistoryGraph;
