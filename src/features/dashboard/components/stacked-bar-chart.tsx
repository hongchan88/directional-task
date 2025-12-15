import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface StackedBarChartProps {
  title: string;
  description?: string;
  data: any[];
  xKey: string;
  bars: {
    key: string;
    color: string;
    name?: string;
  }[];
}

export function StackedBarChart({ title, description, data, xKey, bars }: StackedBarChartProps) {
  const [hiddenKeys, setHiddenKeys] = useState<string[]>([]);

  const handleLegendClick = (e: any) => {
      // Recharts Legend payload key is usually the dataKey
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
            <BarChart data={data}>
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
                cursor={{ fill: 'transparent' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle" 
                  onClick={handleLegendClick}
                  wrapperStyle={{ cursor: 'pointer' }}
              />
              {bars.map((bar) => (
                <Bar 
                    key={bar.key} 
                    dataKey={bar.key} 
                    name={bar.name || bar.key} 
                    stackId="a" 
                    fill={bar.color} 
                    radius={[0, 0, 0, 0]} 
                    hide={hiddenKeys.includes(bar.key)}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
