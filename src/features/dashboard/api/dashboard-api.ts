import { api } from "@/lib/axios";
import { WeeklyMoodTrend, PopularSnackBrands, WeeklyWorkoutTrend } from "../types";

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

// Toggle for real vs mock
const USE_MOCK = false; // Changed to match user's previous manual edit, keeping it consistent or adhering to user pref.
// Wait, user set USE_MOCK = false. This means it will call API.
// "mock/weekly-workout-trend" likely exists in the remote mock server too.
// I should ensure the code handles both.

export const getWeeklyMoodTrend = async (): Promise<WeeklyMoodTrend[]> => {
    if (USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return MOCK_MOOD_TREND;
    }
    const response = await api.get("/mock/weekly-mood-trend");
    return response.data;
};

export const getWeeklyWorkoutTrend = async (): Promise<WeeklyWorkoutTrend[]> => {
    if (USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return MOCK_WORKOUT_TREND;
    }
    const response = await api.get("/mock/weekly-workout-trend");
    return response.data;
};

export const getPopularSnackBrands = async (): Promise<PopularSnackBrands> => {
    if (USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return MOCK_SNACK_BRANDS;
    }
    const response = await api.get("/mock/popular-snack-brands");
    return response.data;
};
