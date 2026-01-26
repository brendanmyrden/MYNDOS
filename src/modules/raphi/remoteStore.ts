import type { Ingredient, Supplement, IntakeLogEntry } from "./types";
import { requireSupabase } from "../../services/supabaseClient";

type IngredientRow = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving_size: number;
  unit: string;
  micros: Record<string, number> | null;
  brand: string | null;
};

type SupplementRow = {
  id: string;
  name: string;
  dose: number;
  unit: string;
  micros: Record<string, number> | null;
  type: string | null;
};

type IntakeRow = {
  id: string;
  date: string;
  item_type: "ingredient" | "supplement";
  item_id: string;
  amount: number;
  unit: string;
  notes: string | null;
  photo_url: string | null;
};

const INGREDIENTS_TABLE = "raphi_ingredients";
const SUPPLEMENTS_TABLE = "raphi_supplements";
const INTAKE_TABLE = "raphi_intake_log";

function mapIngredientRow(row: IngredientRow): Ingredient {
  return {
    id: row.id,
    name: row.name,
    calories: Number(row.calories ?? 0),
    protein: Number(row.protein ?? 0),
    carbs: Number(row.carbs ?? 0),
    fat: Number(row.fat ?? 0),
    micros: row.micros ?? undefined,
    brand: row.brand ?? undefined,
    servingSize: Number(row.serving_size ?? 0),
    unit: row.unit,
  };
}

function mapIngredientToRow(item: Ingredient): IngredientRow {
  return {
    id: item.id,
    name: item.name,
    calories: item.calories,
    protein: item.protein,
    carbs: item.carbs,
    fat: item.fat,
    serving_size: item.servingSize,
    unit: item.unit,
    micros: item.micros ?? null,
    brand: item.brand ?? null,
  };
}

function mapSupplementRow(row: SupplementRow): Supplement {
  return {
    id: row.id,
    name: row.name,
    dose: Number(row.dose ?? 0),
    unit: row.unit,
    micros: row.micros ?? undefined,
    type: row.type ?? undefined,
  };
}

function mapSupplementToRow(item: Supplement): SupplementRow {
  return {
    id: item.id,
    name: item.name,
    dose: item.dose,
    unit: item.unit,
    micros: item.micros ?? null,
    type: item.type ?? null,
  };
}

function mapIntakeRow(row: IntakeRow): IntakeLogEntry {
  return {
    id: row.id,
    date: row.date,
    itemType: row.item_type,
    itemId: row.item_id,
    amount: Number(row.amount ?? 0),
    unit: row.unit,
    notes: row.notes ?? undefined,
    photoUrl: row.photo_url ?? undefined,
  };
}

function mapIntakeToRow(entry: IntakeLogEntry): IntakeRow {
  return {
    id: entry.id,
    date: entry.date,
    item_type: entry.itemType,
    item_id: entry.itemId,
    amount: entry.amount,
    unit: entry.unit,
    notes: entry.notes ?? null,
    photo_url: entry.photoUrl ?? null,
  };
}

export async function getIngredients(): Promise<Ingredient[]> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from(INGREDIENTS_TABLE)
    .select("*")
    .order("name", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapIngredientRow);
}

export async function saveIngredient(item: Ingredient): Promise<void> {
  const supabase = requireSupabase();
  const { error } = await supabase
    .from(INGREDIENTS_TABLE)
    .upsert(mapIngredientToRow(item), { onConflict: "id" });
  if (error) throw error;
}

export async function getSupplements(): Promise<Supplement[]> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from(SUPPLEMENTS_TABLE)
    .select("*")
    .order("name", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapSupplementRow);
}

export async function saveSupplement(item: Supplement): Promise<void> {
  const supabase = requireSupabase();
  const { error } = await supabase
    .from(SUPPLEMENTS_TABLE)
    .upsert(mapSupplementToRow(item), { onConflict: "id" });
  if (error) throw error;
}

export async function getIntakeLog(): Promise<IntakeLogEntry[]> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from(INTAKE_TABLE)
    .select("*")
    .order("date", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapIntakeRow);
}

export async function addIntakeEntry(entry: IntakeLogEntry): Promise<void> {
  const supabase = requireSupabase();
  const { error } = await supabase.from(INTAKE_TABLE).insert(mapIntakeToRow(entry));
  if (error) throw error;
}

export async function getIntakeForDate(date: string): Promise<IntakeLogEntry[]> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from(INTAKE_TABLE)
    .select("*")
    .eq("date", date)
    .order("id", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapIntakeRow);
}
