import { useEffect, useState } from "react";
import { addNote, getNotes } from "./localStore";
import type { RaphNote } from "./types";

export default function RAPHInputPanel() {
  // Sleep
  const [bedTime, setBedTime] = useState("");
  const [wakeTime, setWakeTime] = useState("");

  // Dynamic lists
  const [foods, setFoods] = useState<string[]>([""]);
  const [drinks, setDrinks] = useState<string[]>([""]);
  const [supplements, setSupplements] = useState<string[]>([""]);

  // Notes
  const [noteDraft, setNoteDraft] = useState("");
  const [notes, setNotes] = useState<RaphNote[]>([]);

  useEffect(() => {
    setNotes(getNotes().slice().reverse());
  }, []);

  // Add new input to a category
  const addField = (setter: any, list: string[]) => {
    setter([...list, ""]);
  };

  // Update an input
  const updateField = (setter: any, list: string[], index: number, value: string) => {
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

  const handleSaveNote = () => {
    const content = noteDraft.trim();
    if (!content) return;

    const newNote: RaphNote = {
      id: crypto.randomUUID(),
      content,
      createdAt: new Date().toISOString(),
    };

    addNote(newNote);
    setNotes(prev => [newNote, ...prev]);
    setNoteDraft("");
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 rounded-2xl bg-neutral-900 border border-neutral-700 shadow-lg backdrop-blur-sm">
      <h2 className="text-3xl font-bold text-white tracking-wide mb-6">
        RAPH[i] • Health Input Panel
      </h2>

      {/* SLEEP SECTION */}
      <div className="mb-8">
        <h3 className="text-neutral-300 font-semibold text-lg mb-2">Sleep</h3>

        <label className="text-neutral-500 text-sm">Bed Time</label>
        <input
          type="time"
          className="w-full p-2 bg-neutral-800 rounded-lg text-white outline-none mt-1 mb-4"
          value={bedTime}
          onChange={(e) => setBedTime(e.target.value)}
        />

        <label className="text-neutral-500 text-sm">Wake Time</label>
        <input
          type="time"
          className="w-full p-2 bg-neutral-800 rounded-lg text-white outline-none mt-1"
          value={wakeTime}
          onChange={(e) => setWakeTime(e.target.value)}
        />
      </div>

      {/* FOOD SECTION */}
      <div className="mb-8">
        <h3 className="text-neutral-300 font-semibold text-lg mb-2">Nutrient Intake • Food</h3>

        {foods.map((item, index) => (
          <input
            key={index}
            type="text"
            placeholder="Food item..."
            className="w-full p-2 bg-neutral-800 rounded-lg text-white outline-none mt-2"
            value={item}
            onChange={(e) => updateField(setFoods, foods, index, e.target.value)}
          />
        ))}

        <button
          onClick={() => addField(setFoods, foods)}
          className="mt-3 text-sm text-purple-400 hover:text-purple-300 transition"
        >
          + Add Food Item
        </button>
      </div>

      {/* DRINK SECTION */}
      <div className="mb-8">
        <h3 className="text-neutral-300 font-semibold text-lg mb-2">Nutrient Intake • Drinks</h3>

        {drinks.map((item, index) => (
          <input
            key={index}
            type="text"
            placeholder="Drink item..."
            className="w-full p-2 bg-neutral-800 rounded-lg text-white outline-none mt-2"
            value={item}
            onChange={(e) => updateField(setDrinks, drinks, index, e.target.value)}
          />
        ))}

        <button
          onClick={() => addField(setDrinks, drinks)}
          className="mt-3 text-sm text-purple-400 hover:text-purple-300 transition"
        >
          + Add Drink Item
        </button>
      </div>

      {/* SUPPLEMENTS SECTION */}
      <div className="mb-8">
        <h3 className="text-neutral-300 font-semibold text-lg mb-2">Supplements</h3>

        {supplements.map((item, index) => (
          <input
            key={index}
            type="text"
            placeholder="Supplement name..."
            className="w-full p-2 bg-neutral-800 rounded-lg text-white outline-none mt-2"
            value={item}
            onChange={(e) => updateField(setSupplements, supplements, index, e.target.value)}
          />
        ))}

        <button
          onClick={() => addField(setSupplements, supplements)}
          className="mt-3 text-sm text-purple-400 hover:text-purple-300 transition"
        >
          + Add Supplement
        </button>
      </div>

      {/* SUBMIT */}
      <button
        onClick={handleSubmit}
        className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-bold tracking-wide transition"
      >
        Save Entry
      </button>

      {/* NOTES SECTION */}
      <div className="mt-10 border-t border-neutral-800 pt-8">
        <h3 className="text-neutral-300 font-semibold text-lg mb-2">Notes</h3>

        <textarea
          className="w-full min-h-[120px] p-3 bg-neutral-800 rounded-lg text-white outline-none"
          placeholder="Write a quick note about today..."
          value={noteDraft}
          onChange={(e) => setNoteDraft(e.target.value)}
        />

        <button
          onClick={handleSaveNote}
          className="mt-3 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-white text-sm font-semibold transition"
        >
          Save Note
        </button>

        <div className="mt-6 space-y-3">
          {notes.length === 0 ? (
            <p className="text-sm text-neutral-500">No notes saved yet.</p>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className="rounded-lg border border-neutral-800 bg-neutral-900/70 p-3 text-sm text-neutral-200"
              >
                <p className="whitespace-pre-wrap">{note.content}</p>
                <p className="mt-2 text-xs text-neutral-500">
                  {new Date(note.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
