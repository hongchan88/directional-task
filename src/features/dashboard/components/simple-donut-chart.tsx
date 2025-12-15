import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SimpleDonutChartProps {
  title: string;
  description?: string;
  data: any[];
  nameKey: string;
  dataKey: string;
  colors?: string[];
}

const DEFAULT_COLORS = ["#3b82f6", "#ef4444", "#eab308", "#22c55e", "#a855f7"];

export function SimpleDonutChart({ title, description, data, nameKey, dataKey, colors = DEFAULT_COLORS }: SimpleDonutChartProps) {
  return (
    <Card>
        <CardHeader>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey={dataKey}
                            nameKey={nameKey}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color || colors[index % colors.length]} />
                            ))}
                        </Pie>
                        <Tooltip 
                             contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                             itemStyle={{ color: '#1e293b' }}
                        />
                         <Legend 
                            verticalAlign="bottom" 
                            height={36} 
                            iconType="circle"
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </CardContent>
    </Card>
  );
}
