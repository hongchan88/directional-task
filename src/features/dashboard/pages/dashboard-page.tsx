import { useMemo } from "react";
import { useLoaderData } from "react-router-dom";
import { getWeeklyMoodTrend, getPopularSnackBrands } from "../api/dashboard-api";
import { WeeklyMoodTrend, PopularSnackBrands } from "../types";
import { SimpleBarChart } from "../components/simple-bar-chart";
import { SimpleDonutChart } from "../components/simple-donut-chart";
import { StackedBarChart } from "../components/stacked-bar-chart";

export async function dashboardLoader() {
  const [moodTrend, snackBrands] = await Promise.all([
    getWeeklyMoodTrend(),
    getPopularSnackBrands(),
  ]);
  return { moodTrend, snackBrands };
}

export default function DashboardPage() {
  const { moodTrend, snackBrands } = useLoaderData() as { 
      moodTrend: WeeklyMoodTrend[]; 
      snackBrands: PopularSnackBrands; 
  };

  const moodAverage = useMemo(() => {
    if (!moodTrend.length) return [];
    const total = moodTrend.length;
    const sum = moodTrend.reduce((acc, curr) => ({
        happy: acc.happy + curr.happy,
        tired: acc.tired + curr.tired,
        stressed: acc.stressed + curr.stressed
    }), { happy: 0, tired: 0, stressed: 0 });
    
    return [
        { name: 'Happy', value: Math.round(sum.happy / total), color: '#4ade80' },
        { name: 'Tired', value: Math.round(sum.tired / total), color: '#fb923c' },
        { name: 'Stressed', value: Math.round(sum.stressed / total), color: '#f87171' },
    ];
  }, [moodTrend]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h2>
        <p className="text-slate-500">Overview of weekly trends and preferences.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {/* Weekly Mood Trend Section */}
        <StackedBarChart 
            title="Weekly Mood Trend (Stacked Bar)" 
            description="Composition of daily employee mood"
            data={moodTrend}
            xKey="week"
            bars={[
                { key: 'happy', color: '#4ade80', name: 'Happy' },
                { key: 'tired', color: '#fb923c', name: 'Tired' },
                { key: 'stressed', color: '#f87171', name: 'Stressed' }
            ]}
        />
        <SimpleDonutChart 
            title="Average Mood Distribution (Donut)"
            description="Average mood composition over the period"
            data={moodAverage}
            nameKey="name"
            dataKey="value"
        />

        {/* Snack Brands Section */}
        <SimpleBarChart 
            title="Popular Snack Brands (Bar)" 
            description="Market share by brand preference"
            data={snackBrands}
            xKey="name"
            yKey="share"
            color="#ec4899"
        />
        <SimpleDonutChart 
            title="Snack Brand Share (Donut)"
            description="Brand preference distribution"
            data={snackBrands}
            nameKey="name"
            dataKey="share"
        />
      </div>
    </div>
  );
}
