export type HabitState = 'done' | 'failed' | null;

export type WeatherType = 'sun' | 'cloud' | 'rain' | 'snow' | 'storm' | null;

export interface DailyLog {
  brief: string;
  fieldReport: string;
  habits: Record<string, HabitState>; // habitId -> state
  weather?: {
    type: WeatherType;
    temp: string;
  };
}

export interface Habit {
  id: string;
  name: string;
}

export interface AppData {
  logs: Record<string, DailyLog>; // YYYY-MM-DD -> DailyLog
  habits: Habit[];
  projectLog: string;
}

export interface CalendarDay {
  date: Date;
  dateString: string; // YYYY-MM-DD
  dayName: string; // MON, TUE
  dayNumber: string; // 01, 02
}