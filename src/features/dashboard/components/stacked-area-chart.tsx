import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface StackedAreaChartProps {
  title: string;
  description?: string;
  data: any[];
  xKey: string;
  areas: {
    key: string;
    color: string;
    name?: string;
  }[];
}

export function StackedAreaChart({ title, description, data, xKey, areas }: StackedAreaChartProps) {
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
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey={xKey} 
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                fontSize={12}
              />
              <YAxis 
                 tickLine={false}
                 axisLine={false}
                 fontSize={12}
              />
              <Tooltip 
                cursor={{ stroke: 'rgba(0,0,0,0.1)', strokeWidth: 2 }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle" 
                  onClick={handleLegendClick}
                  wrapperStyle={{ cursor: 'pointer' }}
              />
              {areas.map((area) => (
                <Area 
                    key={area.key} 
                    type="monotone"
                    dataKey={area.key} 
                    name={area.name || area.key} 
                    stackId="1" 
                    stroke={area.color}
                    fill={area.color} 
                    hide={hiddenKeys.includes(area.key)}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
