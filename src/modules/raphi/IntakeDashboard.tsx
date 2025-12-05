import { useState, useEffect } from "react";
import type { IntakeLogEntry, Ingredient, Supplement } from "./types";
import { getIntakeForDate, getIngredients, getSupplements } from "./localStore";

export default function IntakeDashboard() {
  const [entries, setEntries] = useState<IntakeLogEntry[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [supplements, setSupplements] = useState<Supplement[]>([]);

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  
/* eslint-disable react-hooks/set-state-in-effect */

  useEffect(() => {
    const today = getTodayDate();
  
    const nextEntries = getIntakeForDate(today);
    const nextIngredients = getIngredients();
    const nextSupplements = getSupplements();
  
    setEntries(nextEntries);
    setIngredients(nextIngredients);
    setSupplements(nextSupplements);
  }, []);

  // Helper to get item name by ID and type
  const getItemName = (itemId: string, itemType: "ingredient" | "supplement"): string => {
    if (itemType === "ingredient") {
      const ingredient = ingredients.find((i) => i.id === itemId);
      return ingredient?.name || "Unknown Ingredient";
    } else {
      const supplement = supplements.find((s) => s.id === itemId);
      return supplement?.name || "Unknown Supplement";
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ color: "#EDEDED", margin: 0 }}>Today's Intake</h2>
        <button
          style={{
            padding: "8px 16px",
            backgroundColor: "#4A4A4A",
            color: "#EDEDED",
            border: "1px solid #666",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Add Intake Entry
        </button>
      </div>

      {entries.length === 0 ? (
        <p style={{ color: "#EDEDED", opacity: 0.7 }}>No entries for today</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {entries.map((entry) => (
            <div
              key={entry.id}
              style={{
                padding: "12px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "4px",
                backgroundColor: "rgba(255, 255, 255, 0.02)",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <span
                    style={{
                      color: "#EDEDED",
                      fontSize: "12px",
                      textTransform: "uppercase",
                      opacity: 0.7,
                    }}
                  >
                    {entry.itemType}
                  </span>
                  <span style={{ color: "#EDEDED", fontWeight: "500" }}>
                    {getItemName(entry.itemId, entry.itemType)}
                  </span>
                </div>
                <div style={{ color: "#EDEDED", opacity: 0.9 }}>
                  {entry.amount} {entry.unit}
                </div>
                {entry.notes && (
                  <div style={{ color: "#EDEDED", opacity: 0.7, fontSize: "14px", marginTop: "4px" }}>
                    {entry.notes}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

