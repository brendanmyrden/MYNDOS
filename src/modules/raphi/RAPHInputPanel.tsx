import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import "../../styles/cyberpunk.css";

type ListSetter = Dispatch<SetStateAction<string[]>>;

export default function RAPHInputPanel() {
  // Sleep
  const [bedTime, setBedTime] = useState("");
  const [wakeTime, setWakeTime] = useState("");

  // Dynamic lists
  const [foods, setFoods] = useState<string[]>([""]);
  const [drinks, setDrinks] = useState<string[]>([""]);
  const [supplements, setSupplements] = useState<string[]>([""]);

  // Add new input to a category
  const addField = (setter: ListSetter, list: string[]) => {
    setter([...list, ""]);
  };

  // Update an input
  const updateField = (setter: ListSetter, list: string[], index: number, value: string) => {
    const updated = [...list];
    updated[index] = value;
    setter(updated);
  };

  const handleSubmit = () => {
    const entry = {
      timestamp: new Date().toISOString(),
      sleep: {
        bedTime,
        wakeTime,
      },
      foods,
      drinks,
      supplements,
    };

    console.log("RAPH[i] entry:", entry);
    // TODO: Save to DB (local or Supabase)
  };

  return (
    <div className="raphi-shell">
      <div className="raphi-content">
        <div className="raphi-card">
          <div className="raphi-header">
            <div className="raphi-cube">
              <span>🏃‍♂️</span>
            </div>
            <div>
              <h2 className="raphi-title">RAPH[i]</h2>
              <p className="raphi-subtitle">Health Input Panel</p>
            </div>
          </div>

          <section className="raphi-section">
            <h3 className="raphi-section-title">Sleep</h3>
            <div className="raphi-grid">
              <div className="raphi-stack">
                <label className="raphi-label">Bed Time</label>
                <input
                  type="time"
                  className="raphi-input"
                  value={bedTime}
                  onChange={(e) => setBedTime(e.target.value)}
                />
              </div>
              <div className="raphi-stack">
                <label className="raphi-label">Wake Time</label>
                <input
                  type="time"
                  className="raphi-input"
                  value={wakeTime}
                  onChange={(e) => setWakeTime(e.target.value)}
                />
              </div>
            </div>
          </section>

          <section className="raphi-section">
            <h3 className="raphi-section-title">Nutrient Intake • Food</h3>
            <div className="raphi-stack">
              {foods.map((item, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder="Food item..."
                  className="raphi-input"
                  value={item}
                  onChange={(e) => updateField(setFoods, foods, index, e.target.value)}
                />
              ))}
            </div>
            <button
              onClick={() => addField(setFoods, foods)}
              className="raphi-btn-link"
            >
              + Add Food Item
            </button>
          </section>

          <section className="raphi-section">
            <h3 className="raphi-section-title">Nutrient Intake • Drinks</h3>
            <div className="raphi-stack">
              {drinks.map((item, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder="Drink item..."
                  className="raphi-input"
                  value={item}
                  onChange={(e) => updateField(setDrinks, drinks, index, e.target.value)}
                />
              ))}
            </div>
            <button
              onClick={() => addField(setDrinks, drinks)}
              className="raphi-btn-link"
            >
              + Add Drink Item
            </button>
          </section>

          <section className="raphi-section">
            <h3 className="raphi-section-title">Supplements</h3>
            <div className="raphi-stack">
              {supplements.map((item, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder="Supplement name..."
                  className="raphi-input"
                  value={item}
                  onChange={(e) => updateField(setSupplements, supplements, index, e.target.value)}
                />
              ))}
            </div>
            <button
              onClick={() => addField(setSupplements, supplements)}
              className="raphi-btn-link"
            >
              + Add Supplement
            </button>
          </section>

          <button
            onClick={handleSubmit}
            className="raphi-btn raphi-btn-primary raphi-btn-full"
          >
            Save Entry
          </button>
        </div>
      </div>
    </div>
  );
}
