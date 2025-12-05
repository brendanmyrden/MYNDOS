export interface Ingredient {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  micros?: Record<string, number>; // optional micronutrients
  brand?: string;
  servingSize: number;
  unit: string; // "g", "ml", etc.
}

export interface Supplement {
  id: string;
  name: string;
  dose: number; 
  unit: string; // "mg", "capsule", etc.
  micros?: Record<string, number>; // vitamins/minerals per dose
  type?: string; // capsule, powder, drink
}

export interface IntakeLogEntry {
  id: string;
  date: string; // YYYY-MM-DD
  itemType: "ingredient" | "supplement";
  itemId: string;
  amount: number;
  unit: string;
  notes?: string;
  photoUrl?: string; // for future camera integration
}

