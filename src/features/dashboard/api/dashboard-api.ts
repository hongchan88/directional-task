import { api } from "@/lib/axios";
import { WeeklyMoodTrend, PopularSnackBrands, WeeklyWorkoutTrend, ConsumptionImpact } from "../types";

const MOCK_MOOD_TREND: WeeklyMoodTrend[] = [
    { week: "2024-12-02", happy: 61, tired: 25, stressed: 14 },
    { week: "2024-12-09", happy: 55, tired: 30, stressed: 15 },
    { week: "2024-12-16", happy: 70, tired: 20, stressed: 10 },
    { week: "2024-12-23", happy: 40, tired: 40, stressed: 20 },
];

const MOCK_SNACK_BRANDS: PopularSnackBrands = [
  { name: "오리온", share: 38 },
  { name: "롯데제과", share: 28 },
  { name: "크라운", share: 18 },
  { name: "해태", share: 12 },
  { name: "기타", share: 4 }
];

const MOCK_WORKOUT_TREND: WeeklyWorkoutTrend[] = [
  { week: "2024-12-02", running: 45, cycling: 30, stretching: 25 },
  { week: "2024-12-09", running: 50, cycling: 25, stretching: 25 },
  { week: "2024-12-16", running: 40, cycling: 40, stretching: 20 },
  { week: "2024-12-23", running: 60, cycling: 20, stretching: 20 },
];

const MOCK_COFFEE_CONSUMPTION: ConsumptionImpact[] = [
    { amount: 1, Frontend: { bugs: 2, productivity: 80 }, Backend: { bugs: 1, productivity: 85 }, AI: { bugs: 3, productivity: 90 } },
    { amount: 2, Frontend: { bugs: 3, productivity: 85 }, Backend: { bugs: 2, productivity: 88 }, AI: { bugs: 4, productivity: 85 } },
    { amount: 3, Frontend: { bugs: 5, productivity: 75 }, Backend: { bugs: 3, productivity: 82 }, AI: { bugs: 6, productivity: 80 } },
    { amount: 4, Frontend: { bugs: 8, productivity: 60 }, Backend: { bugs: 5, productivity: 75 }, AI: { bugs: 7, productivity: 70 } },
    { amount: 5, Frontend: { bugs: 12, productivity: 40 }, Backend: { bugs: 8, productivity: 65 }, AI: { bugs: 9, productivity: 60 } },
];

const MOCK_SNACK_IMPACT: ConsumptionImpact[] = [
    { amount: 1, Marketing: { meetingsMissed: 3, morale: 70 }, Sales: { meetingsMissed: 4, morale: 68 }, HR: { meetingsMissed: 1, morale: 72 } },
    { amount: 2, Marketing: { meetingsMissed: 2, morale: 78 }, Sales: { meetingsMissed: 3, morale: 75 }, HR: { meetingsMissed: 1, morale: 80 } },
    { amount: 3, Marketing: { meetingsMissed: 2, morale: 84 }, Sales: { meetingsMissed: 2, morale: 82 }, HR: { meetingsMissed: 2, morale: 87 } },
    { amount: 4, Marketing: { meetingsMissed: 4, morale: 80 }, Sales: { meetingsMissed: 3, morale: 79 }, HR: { meetingsMissed: 2, morale: 84 } },
    { amount: 5, Marketing: { meetingsMissed: 5, morale: 76 }, Sales: { meetingsMissed: 6, morale: 73 }, HR: { meetingsMissed: 3, morale: 81 } },
];

// Toggle for real vs mock
const USE_MOCK = false; // Changed to match user's previous manual edit, keeping it consistent or adhering to user pref.
// Wait, user set USE_MOCK = false. This means it will call API.
// "mock/weekly-workout-trend" likely exists in the remote mock server too.
// I should ensure the code handles both.

// Helper to extract array from various response shapes
const extractArrayData = (response: any): any[] => {
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.data)) return data.data;
    if (data && Array.isArray(data.items)) return data.items;
    if (data && Array.isArray(data.result)) return data.result;
    if (data && Array.isArray(data.teams)) return data.teams;
    if (data && Array.isArray(data.departments)) return data.departments;
    // Fallback: Check if the mock logic returned array directly (if wrapper didn't exist)
    if (Array.isArray(response)) return response;
    
    console.warn("Could not extract array data from response:", data);
    return [];
};

const transformSeriesToRows = (data: any[]): ConsumptionImpact[] => {
       if (!Array.isArray(data) || data.length === 0) return [];
       // Check if data is likely in Series format (has 'series' or 'metrics' property)
       // If it doesn't have either, assume it's already in Row format
       if (!data[0].series && !data[0].metrics) return data as ConsumptionImpact[]; 

       const rowsMap = new Map<number, any>();

       data.forEach((item: any) => {
           const teamName = item.team || item.name || "Unknown";
           // Support 'series' (Coffee) or 'metrics' (Snack)
           const series = item.series || item.metrics;
           
           if (Array.isArray(series)) {
               series.forEach((point: any) => {
                   const amount = point.amount ?? point.x ?? point.snacks ?? point.cups ?? 0;
                   if (!rowsMap.has(amount)) {
                       rowsMap.set(amount, { amount });
                   }
                   const row = rowsMap.get(amount);
                   const { amount: _ignore, snacks: _ignore2, cups: _ignore3, ...metrics } = point;
                   row[teamName] = metrics;
               });
           }
       });

       return Array.from(rowsMap.values()).sort((a, b) => a.amount - b.amount);
};


export const getWeeklyMoodTrend = async (): Promise<WeeklyMoodTrend[]> => {
    if (USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return MOCK_MOOD_TREND;
    }
    const response = await api.get("/mock/weekly-mood-trend");
    return extractArrayData(response) as WeeklyMoodTrend[];
};

export const getWeeklyWorkoutTrend = async (): Promise<WeeklyWorkoutTrend[]> => {
    if (USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return MOCK_WORKOUT_TREND;
    }
    const response = await api.get("/mock/weekly-workout-trend");
    return extractArrayData(response) as WeeklyWorkoutTrend[];
};

export const getPopularSnackBrands = async (): Promise<PopularSnackBrands> => {
    if (USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return MOCK_SNACK_BRANDS;
    }
    const response = await api.get("/mock/popular-snack-brands");
    return extractArrayData(response) as PopularSnackBrands;
};

export const getCoffeeConsumption = async (): Promise<ConsumptionImpact[]> => {
    if (USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return MOCK_COFFEE_CONSUMPTION;
    }
    const response = await api.get("/mock/coffee-consumption");
    const rawData = extractArrayData(response);
    const transformed = transformSeriesToRows(rawData);
    return transformed;
};

export const getSnackImpact = async (): Promise<ConsumptionImpact[]> => {
    if (USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return MOCK_SNACK_IMPACT;
    }
    const response = await api.get("/mock/snack-impact");
    const rawData = extractArrayData(response);
    const transformed = transformSeriesToRows(rawData);
    return transformed;
};
