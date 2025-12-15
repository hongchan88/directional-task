import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface DualAxisLineChartProps {
  title: string;
  description?: string;
  data: any[];
  xKey: string;
  xLabel?: string;
  teams: { name: string; color: string }[];
  leftMetric: { key: string; label: string };
  rightMetric: { key: string; label: string };
}

// Custom Square Dot for Right Axis metrics
const SquareDot = (props: any) => {
  const { cx, cy, stroke, fill, payload, size = 8, filled = false, color: explicitColor } = props;
  // Priority: explicit color > stroke > fill > payload values > fallback
  const color = explicitColor || stroke || fill || payload?.stroke || payload?.fill || "#000";
  const offset = size / 2;
  return (
    <rect 
        x={cx - offset} 
        y={cy - offset} 
        width={size} 
        height={size} 
        fill={filled ? color : "white"} 
        stroke={color} 
        strokeWidth={2} 
    />
  );
};

// Custom Tooltip component
const CustomTooltip = ({ active, payload, label, xLabel }: any) => {
  if (active && payload && payload.length) {
    // With shared={false}, payload usually contains 1 item (the hovered point)
    const p = payload[0];
    const teamName = p.name?.split('.')[0] || "Unknown"; // e.g., "Frontend.bugs" -> "Frontend"
    // Access full data object for this X point
    const dataPoint = p.payload; 
    const metricName = p.name?.split('.')[1]; // "bugs" or "productivity"

    // User request: "Tooltip shows ... corresponding team's data only"
    // And "X-axis value, Coffee Cups(X), Bugs(Left), Productivity(Right)"
    // Even if we hover one line, user implies wanting to see the "Context" for that team.
    
    // Let's find the matching data for this team
    const teamData = dataPoint[teamName]; // { bugs: 2, productivity: 80 }
    if (!teamData) return null;

    return (
      <div className="bg-white p-3 border rounded shadow-md text-sm">
        <p className="font-bold mb-1">{`${teamName} Team`}</p>
        <p className="text-slate-500 mb-2">{`${xLabel || 'Count'}: ${label}`}</p>
        <div className="space-y-1">
            <p style={{ color: p.color }}>
                {/* Try to show both metrics if available for context, or just the hovered one? 
                    User said "Tooltip... X value... AND coffee cups AND bugs AND productivity".
                    So YES, show ALL metrics for that team.
                */}
                Bugs/Missed: <span className="font-bold">{Object.values(teamData)[0] as number}</span> {/* Heuristic or pass props? Passing props is cleaner but complex here. */}
                {/* Let's rely on payload Access if possible, but 'bugs' key is dynamic. 
                    Actually we know leftMetric and rightMetric keys from parent? 
                    We don't have them here easily without currying.
                    Let's just iterate teamData since it strictly has 2 keys in our mock?
                    Or better, just display what's in teamData.
                */}
            </p>
             {Object.entries(teamData).map(([k, v]) => (
                <p key={k} className="capitalize">
                    {k}: <span className="font-bold">{v as number}</span>
                </p>
             ))}
        </div>
      </div>
    );
  }
  return null;
};



export function DualAxisLineChart({ 
    title, 
    description, 
    data, 
    xKey, 
    xLabel,
    teams, 
    leftMetric, 
    rightMetric 
}: DualAxisLineChartProps) {
  const [hiddenKeys, setHiddenKeys] = useState<string[]>([]);

  const handleLegendClick = (e: any) => {
      const key = e.dataKey;
      setHiddenKeys(prev => 
          prev.includes(key) 
              ? prev.filter(k => k !== key) 
              : [...prev, key]
      );
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey={xKey} 
                label={{ value: xLabel, position: 'insideBottom', offset: -5 }} 
                fontSize={12}
                tickMargin={10}
              />
              <YAxis 
                yAxisId="left" 
                label={{ value: leftMetric.label, angle: -90, position: 'insideLeft' }} 
                fontSize={12}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                label={{ value: rightMetric.label, angle: 90, position: 'insideRight' }} 
                fontSize={12}
              />
              <Tooltip 
                content={<CustomTooltip xLabel={xLabel} />}
                shared={false} 
                trigger="hover"
              />
              <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  onClick={handleLegendClick}
                  wrapperStyle={{ cursor: 'pointer' }}
               />

              {teams.map((team) => {
                const leftKey = `${team.name}.${leftMetric.key}`;
                const rightKey = `${team.name}.${rightMetric.key}`;

                return [
                // Left Axis Line (Solid, Circle)
                <Line
                    key={`${team.name}-${leftMetric.key}`}
                    yAxisId="left"
                    type="monotone"
                    dataKey={leftKey}
                    name={`${team.name} ${leftMetric.label}`}
                    legendType="circle"
                    stroke={team.color}
                    strokeWidth={2}
                    dot={{ r: 4, fill: "white", strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: team.color, stroke: "none" }}
                    hide={hiddenKeys.includes(leftKey)}
                />,
                // Right Axis Line (Dashed, Square)
                <Line
                    key={`${team.name}-${rightMetric.key}`}
                    yAxisId="right"
                    type="monotone"
                    dataKey={rightKey}
                    name={`${team.name} ${rightMetric.label}`}
                    legendType="square"
                    stroke={team.color}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={(props: any) => <SquareDot {...props} color={team.color} />}
                    activeDot={(props: any) => <SquareDot {...props} size={12} filled color={team.color} />}
                    hide={hiddenKeys.includes(rightKey)}
                />
                ];
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
