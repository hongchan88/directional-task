export interface WeeklyMoodTrend {
  week: string; // e.g., "2024-12-02"
  happy: number;
  tired: number;
  stressed: number;
}

export interface SnackBrandShare {
  name: string;
  share: number;
}

export type PopularSnackBrands = SnackBrandShare[];
