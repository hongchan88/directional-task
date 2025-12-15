import { useMemo, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { 
    getWeeklyMoodTrend, 
    getPopularSnackBrands, 
    getWeeklyWorkoutTrend,
    getCoffeeConsumption,
    getSnackImpact
} from "../api/dashboard-api";
import { 
    WeeklyMoodTrend, 
    PopularSnackBrands, 
    WeeklyWorkoutTrend,
    ConsumptionImpact
} from "../types";
import { SimpleBarChart } from "../components/simple-bar-chart";
import { SimpleDonutChart } from "../components/simple-donut-chart";
import { StackedBarChart } from "../components/stacked-bar-chart";
import { StackedAreaChart } from "../components/stacked-area-chart";
import { DualAxisLineChart } from "../components/dual-axis-line-chart";

export async function dashboardLoader() {
  const [moodTrend, snackBrands, workoutTrend, coffeeConsumption, snackImpact] = await Promise.all([
    getWeeklyMoodTrend(),
    getPopularSnackBrands(),
    getWeeklyWorkoutTrend(),
    getCoffeeConsumption(),
    getSnackImpact(),
  ]);
  return { moodTrend, snackBrands, workoutTrend, coffeeConsumption, snackImpact };
}

export default function DashboardPage() {
  const { 
      moodTrend = [], 
      snackBrands = [], 
      workoutTrend = [], 
      coffeeConsumption = [], 
      snackImpact = [] 
  } = useLoaderData() as { 
      moodTrend: WeeklyMoodTrend[]; 
      snackBrands: PopularSnackBrands;
      workoutTrend: WeeklyWorkoutTrend[];
      coffeeConsumption: ConsumptionImpact[];
      snackImpact: ConsumptionImpact[];
  };

  const [activeTab, setActiveTab] = useState<"task1" | "task2" | "task3">("task1");

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
      <div className="flex flex-col space-y-4">
        <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h2>
            <p className="text-slate-500">Overview of weekly trends and preferences.</p>
        </div>
        
        <div className="flex border-b border-slate-200 overflow-x-auto">
             <button 
                onClick={() => setActiveTab("task1")}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === "task1" 
                    ? "border-blue-600 text-blue-600" 
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}
             >
                Task 1: Snacks & Mood
             </button>
             <button 
                onClick={() => setActiveTab("task2")}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === "task2" 
                    ? "border-blue-600 text-blue-600" 
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}
             >
                Task 2: Trends
             </button>
             <button 
                onClick={() => setActiveTab("task3")}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === "task3" 
                    ? "border-blue-600 text-blue-600" 
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}
             >
                Task 3: Multi-Line Analysis
             </button>
        </div>
      </div>

      {activeTab === "task1" && (
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
      )}

      {activeTab === "task2" && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
             {/* Weekly Mood Trend - Task 2 Variant */}
             <StackedBarChart 
                title="Weekly Mood Trend (Stacked Bar)" 
                description="Daily mood composition"
                data={moodTrend}
                xKey="week"
                bars={[
                    { key: 'happy', color: '#4ade80', name: 'Happy' },
                    { key: 'tired', color: '#fb923c', name: 'Tired' },
                    { key: 'stressed', color: '#f87171', name: 'Stressed' }
                ]}
            />
             <StackedAreaChart 
                title="Weekly Mood Trend (Stacked Area)" 
                description="Daily mood composition trend"
                data={moodTrend}
                xKey="week"
                areas={[
                    { key: 'happy', color: '#4ade80', name: 'Happy' },
                    { key: 'tired', color: '#fb923c', name: 'Tired' },
                    { key: 'stressed', color: '#f87171', name: 'Stressed' }
                ]}
            />

             {/* Weekly Workout Trend */}
             <StackedBarChart 
                title="Weekly Workout Trend (Stacked Bar)" 
                description="Daily workout activities"
                data={workoutTrend}
                xKey="week"
                bars={[
                    { key: 'running', color: '#3b82f6', name: 'Running' },
                    { key: 'cycling', color: '#06b6d4', name: 'Cycling' },
                    { key: 'stretching', color: '#6366f1', name: 'Stretching' }
                ]}
            />
             <StackedAreaChart 
                title="Weekly Workout Trend (Stacked Area)" 
                description="Daily workout activities trend"
                data={workoutTrend}
                xKey="week"
                areas={[
                    { key: 'running', color: '#3b82f6', name: 'Running' },
                    { key: 'cycling', color: '#06b6d4', name: 'Cycling' },
                    { key: 'stretching', color: '#6366f1', name: 'Stretching' }
                ]}
            />
          </div>
      )}

      {activeTab === "task3" && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
              <DualAxisLineChart 
                 title="Coffee Consumption Impact"
                 description="Correlating coffee intake with performance metrics"
                 xKey="amount"
                 xLabel="Cups/Day"
                 data={coffeeConsumption}
                 teams={[
                    { name: 'Frontend', color: '#3b82f6' },
                    { name: 'Backend', color: '#ef4444' },
                    { name: 'AI', color: '#10b981' }
                 ]}
                 leftMetric={{ key: 'bugs', label: 'Bugs' }}
                 rightMetric={{ key: 'productivity', label: 'Productivity' }}
              />
              <DualAxisLineChart 
                 title="Snack Consumption Impact"
                 description="Correlating snack intake with team morale"
                 xKey="amount"
                 xLabel="Snacks/Event"
                 data={snackImpact}
                 teams={[
                    { name: 'Marketing', color: '#3b82f6' },
                    { name: 'Sales', color: '#ef4444' },
                    { name: 'HR', color: '#10b981' }
                 ]}
                 leftMetric={{ key: 'meetingsMissed', label: 'Meetings Missed' }}
                 rightMetric={{ key: 'morale', label: 'Morale' }}
              />
          </div>
      )}
    </div>
  );
}
