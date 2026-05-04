// Entities for Numbers / Stars / Signs

export interface NumberInsight {
  id: string;
  source: "numerology" | "astrology" | "signs";
  title: string;
  meaning: string;
  createdAt: Date;
}

export interface StarMapEntry {
  id: string;
  chartType: string;
  date: Date;
  notes?: string;
}

export interface SignPattern {
  id: string;
  label: string;
  context?: string;
  confidence?: "low" | "medium" | "high";
}

export const numbersStarsSignsSchema: {
  insights: NumberInsight[];
  starMap: StarMapEntry[];
  signPatterns: SignPattern[];
} = {
  insights: [],
  starMap: [],
  signPatterns: [],
};
