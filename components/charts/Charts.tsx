"use client";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = ["#635BFF", "#A79FFF", "#4F46E5", "#E5E3FF", "#8580FF", "#3F36C4"];

export function AreaTrend({
  data,
  xKey = "x",
  yKey = "y",
  height = 220,
}: {
  data: Array<Record<string, any>>;
  xKey?: string;
  yKey?: string;
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
        <defs>
          <linearGradient id="brandGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#635BFF" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#635BFF" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey={xKey} tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} width={50} />
        <Tooltip />
        <Area
          type="monotone"
          dataKey={yKey}
          stroke="#635BFF"
          strokeWidth={2}
          fill="url(#brandGrad)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function BarHours({
  data,
  xKey = "hour",
  yKey = "value",
  height = 240,
}: {
  data: Array<Record<string, any>>;
  xKey?: string;
  yKey?: string;
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey={xKey} tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} width={50} />
        <Tooltip cursor={{ fill: "rgba(99,91,255,0.06)" }} />
        <Bar dataKey={yKey} fill="#635BFF" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function LineNet({
  data,
  height = 220,
}: {
  data: Array<{ date: string; net: number; gross?: number }>;
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="date" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} width={60} />
        <Tooltip />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        {data[0]?.gross !== undefined && (
          <Line
            type="monotone"
            dataKey="gross"
            stroke="#AAB7C4"
            strokeWidth={1.5}
            dot={false}
            strokeDasharray="4 4"
          />
        )}
        <Line
          type="monotone"
          dataKey="net"
          stroke="#635BFF"
          strokeWidth={2.2}
          dot={{ r: 3, fill: "#635BFF" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function CategoryDonut({
  data,
  height = 220,
}: {
  data: Array<{ name: string; value: number }>;
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Tooltip />
        <Pie
          data={data}
          innerRadius={55}
          outerRadius={85}
          paddingAngle={2}
          dataKey="value"
          nameKey="name"
          strokeWidth={0}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Legend
          verticalAlign="bottom"
          iconType="circle"
          wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function HorizontalBars({
  data,
  height = 220,
}: {
  data: Array<{ name: string; value: number }>;
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, bottom: 4, left: 12 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" tickLine={false} axisLine={false} />
        <YAxis
          type="category"
          dataKey="name"
          tickLine={false}
          axisLine={false}
          width={140}
          tick={{ fontSize: 11 }}
        />
        <Tooltip cursor={{ fill: "rgba(99,91,255,0.06)" }} />
        <Bar dataKey="value" fill="#635BFF" radius={[0, 6, 6, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
