
export interface PrayerEntry {
  farz: boolean;
  sunnat: boolean;
  nafil: boolean;
}

export interface QuranProgress {
  surah: string;
  status: 'In Process' | 'Completed' | '';
}

export interface CustomItem {
  name: string;
  completed: boolean;
}

export interface VisualTrackerDay {
  fasting: boolean;
  prayers: boolean[]; // 5 dots
  tarawih: boolean;
  quran: boolean;
  zikr: boolean;
  sadaqah: boolean;
}

export interface DailyData {
  date: string;
  fastingDay: number;
  fasting: boolean;
  quran: {
    recitation: QuranProgress;
    memorization: QuranProgress;
  };
  prayers: {
    fajr: PrayerEntry;
    zohar: PrayerEntry;
    asr: PrayerEntry;
    magrib: PrayerEntry;
    ishan: PrayerEntry;
    tarawih: PrayerEntry;
    witr: PrayerEntry;
    tahajjud: PrayerEntry;
  };
  extraPrayers: CustomItem[];
  health: {
    water: number; // 0-8
    sleep: string;
    skincare: { morning: boolean; night: boolean };
    exercise: boolean;
    selfcare: boolean;
  };
  goodDeeds: {
    zikr: boolean;
    names99: boolean;
    charity: boolean;
    custom: CustomItem[];
  };
  goals: { text: string; achieved: boolean }[];
  gratefulFor: string;
  mood: 'happy' | 'neutral' | 'sad' | null;
  notes: string;
}

export type AppView = 'intro' | 'landing' | 'planner' | 'tracker' | 'counter' | 'quran-log' | 'names-99' | 'eid' | 'secret-duas' | 'recommended-duas' | 'ramadan-specials' | 'visual-tracker' | 'alarm' | 'memories';
