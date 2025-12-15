export interface WeeklyMoodTrend {
  week: string; // e.g., "2024-12-02"
  happy: number;
  tired: number;
  stressed: number;
}

// ... previous content ...
export interface SnackBrandShare {
  name: string;
  share: number;
}

export type PopularSnackBrands = SnackBrandShare[];

export interface WeeklyWorkoutTrend {
  week: string; // e.g., "2024-12-02"
  running: number;
  cycling: number;
  stretching: number;
}

export interface TeamStats {
  bugs?: number;
  meetingMissed?: number;
  productivity?: number;
  morale?: number;
}

export interface ConsumptionImpact {
  amount: number; // X-axis value
  Frontend: TeamStats;
  Backend: TeamStats;
  AI: TeamStats;
}
