import { useState } from "react";
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
  const [hiddenNames, setHiddenNames] = useState<string[]>([]);

  const toggleHidden = (name: string) => {
      setHiddenNames(prev => 
          prev.includes(name) 
              ? prev.filter(n => n !== name) 
              : [...prev, name]
      );
  };

  const activeData = data.filter(item => !hiddenNames.includes(item[nameKey]));

  // Custom Legend that shows ALL items, with hidden ones greyed out
  const CustomLegend = () => (
    <div className="flex flex-wrap justify-center gap-4 mt-2">
      {data.map((item, index) => {
        const name = item[nameKey];
        const isHidden = hiddenNames.includes(name);
        const color = item.color || colors[index % colors.length];
        return (
          <div 
            key={name}
            onClick={() => toggleHidden(name)}
            className="flex items-center gap-1.5 cursor-pointer select-none"
            style={{ opacity: isHidden ? 0.4 : 1 }}
          >
            <span 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: isHidden ? '#ccc' : color }}
            />
            <span 
              className="text-sm"
              style={{ color: isHidden ? '#aaa' : '#333' }}
            >
              {name}
            </span>
          </div>
        );
      })}
    </div>
  );

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
                            data={activeData}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey={dataKey}
                            nameKey={nameKey}
                        >
                            {activeData.map((entry, index) => {
                                // Preserve color by finding original index
                                const originalIndex = data.findIndex(d => d[nameKey] === entry[nameKey]);
                                const color = entry.color || colors[originalIndex % colors.length];
                                return <Cell key={`cell-${originalIndex}`} fill={color} />;
                            })}
                        </Pie>
                        <Tooltip 
                             contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                             itemStyle={{ color: '#1e293b' }}
                        />
                        <Legend content={<CustomLegend />} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </CardContent>
    </Card>
  );
}
