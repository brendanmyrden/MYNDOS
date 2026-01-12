import type { Ingredient, Supplement, IntakeLogEntry, RaphNote } from "./types";

// --- Keys ---
const INGREDIENTS_KEY = "raphi_ingredients";
const SUPPLEMENTS_KEY = "raphi_supplements";
const INTAKE_LOG_KEY = "raphi_intake_log";
const NOTES_KEY = "raphi_notes";

// --- Helpers ---
function loadArray<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveArray<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

// --- Ingredients ---
export function getIngredients(): Ingredient[] {
  return loadArray<Ingredient>(INGREDIENTS_KEY);
}

export function saveIngredient(item: Ingredient) {
  const list = getIngredients();
  const updated = list.filter(i => i.id !== item.id);
  updated.push(item);
  saveArray(INGREDIENTS_KEY, updated);
}

// --- Supplements ---
export function getSupplements(): Supplement[] {
  return loadArray<Supplement>(SUPPLEMENTS_KEY);
}

export function saveSupplement(item: Supplement) {
  const list = getSupplements();
  const updated = list.filter(i => i.id !== item.id);
  updated.push(item);
  saveArray(SUPPLEMENTS_KEY, updated);
}

// --- Intake Logs ---
export function getIntakeLog(): IntakeLogEntry[] {
  return loadArray<IntakeLogEntry>(INTAKE_LOG_KEY);
}

export function addIntakeEntry(entry: IntakeLogEntry) {
  const list = getIntakeLog();
  list.push(entry);
  saveArray(INTAKE_LOG_KEY, list);
}

export function getIntakeForDate(date: string): IntakeLogEntry[] {
  return getIntakeLog().filter(e => e.date === date);
}

// --- Notes ---
export function getNotes(): RaphNote[] {
  return loadArray<RaphNote>(NOTES_KEY);
}

export function addNote(note: RaphNote) {
  const list = getNotes();
  list.push(note);
  saveArray(NOTES_KEY, list);
}
