import type { Ingredient, Supplement, IntakeLogEntry } from "./types";
import * as localStore from "./localStore";
import * as remoteStore from "./remoteStore";
import { isSupabaseConfigured } from "../../services/supabaseClient";

const useRemote = isSupabaseConfigured;

export const storageMode = useRemote ? "supabase" : "local";

async function withFallback<T>(remoteCall: () => Promise<T>, localCall: () => T): Promise<T> {
  if (!useRemote) return localCall();
  try {
    return await remoteCall();
  } catch (error) {
    console.error("Supabase error, falling back to local storage:", error);
    return localCall();
  }
}

export async function getIngredients(): Promise<Ingredient[]> {
  return withFallback(() => remoteStore.getIngredients(), () => localStore.getIngredients());
}

export async function saveIngredient(item: Ingredient): Promise<void> {
  if (!useRemote) {
    localStore.saveIngredient(item);
    return;
  }
  try {
    await remoteStore.saveIngredient(item);
  } catch (error) {
    console.error("Supabase error, falling back to local storage:", error);
    localStore.saveIngredient(item);
  }
}

export async function getSupplements(): Promise<Supplement[]> {
  return withFallback(() => remoteStore.getSupplements(), () => localStore.getSupplements());
}

export async function saveSupplement(item: Supplement): Promise<void> {
  if (!useRemote) {
    localStore.saveSupplement(item);
    return;
  }
  try {
    await remoteStore.saveSupplement(item);
  } catch (error) {
    console.error("Supabase error, falling back to local storage:", error);
    localStore.saveSupplement(item);
  }
}

export async function getIntakeLog(): Promise<IntakeLogEntry[]> {
  return withFallback(() => remoteStore.getIntakeLog(), () => localStore.getIntakeLog());
}

export async function addIntakeEntry(entry: IntakeLogEntry): Promise<void> {
  if (!useRemote) {
    localStore.addIntakeEntry(entry);
    return;
  }
  try {
    await remoteStore.addIntakeEntry(entry);
  } catch (error) {
    console.error("Supabase error, falling back to local storage:", error);
    localStore.addIntakeEntry(entry);
  }
}

export async function getIntakeForDate(date: string): Promise<IntakeLogEntry[]> {
  return withFallback(() => remoteStore.getIntakeForDate(date), () => localStore.getIntakeForDate(date));
}
