import { useState, useEffect, useRef } from "react";
import type { IntakeLogEntry, Ingredient, Supplement } from "./types";
import {
  getIntakeForDate,
  getIngredients,
  getSupplements,
  addIntakeEntry,
  saveIngredient,
  saveSupplement,
} from "./store";

const DEFAULT_CATEGORIES = ["Food", "Drink", "Supplements"];
const CATEGORIES_KEY = "raphi_categories";

export default function IntakeDashboard() {
  const [entries, setEntries] = useState<IntakeLogEntry[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [categories, setCategories] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(CATEGORIES_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_CATEGORIES;
    } catch {
      return DEFAULT_CATEGORIES;
    }
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [itemSearchQuery, setItemSearchQuery] = useState("");
  const [showItemResults, setShowItemResults] = useState(false);
  const itemSearchRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    category: "Food",
    itemId: "",
    amount: "",
    unit: "",
    notes: "",
  });

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
    let active = true;

    (async () => {
      const today = getTodayDate();
      const [nextEntries, nextIngredients, nextSupplements] = await Promise.all([
        getIntakeForDate(today),
        getIngredients(),
        getSupplements(),
      ]);

      if (!active) return;
      setEntries(nextEntries);
      setIngredients(nextIngredients);
      setSupplements(nextSupplements);
    })();

    return () => {
      active = false;
    };
  }, []);

  // Close item search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (itemSearchRef.current && !itemSearchRef.current.contains(event.target as Node)) {
        setShowItemResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Save categories to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    } catch (error) {
      console.error("Failed to save categories:", error);
    }
  }, [categories]);

  // Helper to get item name by ID and type
  const getItemName = (itemId: string, itemType: "ingredient" | "supplement"): string => {
    if (itemType === "ingredient") {
      const ingredient = ingredients.find((i) => i.id === itemId);
      return ingredient?.name || "Unknown Ingredient";
    }
    const supplement = supplements.find((s) => s.id === itemId);
    return supplement?.name || "Unknown Supplement";
  };

  const handleAddEntry = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleCloseForm = () => {
    setIsModalOpen(false);
    setIsAddingCategory(false);
    setNewCategoryName("");
    setItemSearchQuery("");
    setShowItemResults(false);
    setFormData({
      category: "Food",
      itemId: "",
      amount: "",
      unit: "",
      notes: "",
    });
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim() && !categories.includes(newCategoryName.trim())) {
      setCategories([...categories, newCategoryName.trim()]);
      setFormData({ ...formData, category: newCategoryName.trim() });
      setNewCategoryName("");
      setIsAddingCategory(false);
    }
  };

  const handleCategoryChange = (value: string) => {
    if (value === "+") {
      setIsAddingCategory(true);
    } else {
      setIsAddingCategory(false);
      setFormData({ ...formData, category: value, itemId: "" });
    }
  };

  const handleItemSearch = (query: string) => {
    setItemSearchQuery(query);
    setShowItemResults(query.length > 0);
    if (query.length === 0) {
      setFormData({ ...formData, itemId: "" });
    }
  };

  const handleSelectItem = (item: Ingredient | Supplement) => {
    setFormData({ ...formData, itemId: item.id });
    setItemSearchQuery(item.name);
    setShowItemResults(false);
  };

  const handleCreateNewItem = async () => {
    if (!itemSearchQuery.trim()) return;

    const itemType = formData.category === "Supplements" ? "supplement" : "ingredient";
    const newId = Date.now().toString();

    if (itemType === "supplement") {
      const newSupplement: Supplement = {
        id: newId,
        name: itemSearchQuery.trim(),
        dose: 0,
        unit: "mg",
      };
      await saveSupplement(newSupplement);
      setSupplements((prev) => [...prev, newSupplement]);
    } else {
      const newIngredient: Ingredient = {
        id: newId,
        name: itemSearchQuery.trim(),
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        servingSize: 0,
        unit: "g",
      };
      await saveIngredient(newIngredient);
      setIngredients((prev) => [...prev, newIngredient]);
    }

    setFormData({ ...formData, itemId: newId });
    setItemSearchQuery(itemSearchQuery.trim());
    setShowItemResults(false);
  };

  const handleSubmit = async () => {
    if (!formData.itemId || !formData.amount) {
      alert("Please fill in all required fields");
      return;
    }

    const itemType = formData.category === "Supplements" ? "supplement" : "ingredient";
    const unit = formData.unit || (itemType === "supplement" ? "mg" : "g");

    const newEntry: IntakeLogEntry = {
      id: Date.now().toString(),
      date: getTodayDate(),
      itemType: itemType,
      itemId: formData.itemId,
      amount: parseFloat(formData.amount) || 0,
      unit: unit,
      notes: formData.notes || undefined,
    };

    await addIntakeEntry(newEntry);
    setEntries((prev) => [...prev, newEntry]);
    handleCloseForm();
  };

  const getAvailableItems = () => {
    if (formData.category === "Supplements") {
      return supplements;
    }
    return ingredients;
  };

  const availableItems = getAvailableItems();
  const filteredItems = availableItems.filter((item) =>
    item.name.toLowerCase().includes(itemSearchQuery.toLowerCase())
  );

  const hasExactMatch = availableItems.some(
    (item) => item.name.toLowerCase() === itemSearchQuery.toLowerCase()
  );
  const showCreateOption = itemSearchQuery.trim().length > 0 && !hasExactMatch && !formData.itemId;

  return (
    <div className="raphi-dashboard">
      <div className="raphi-row raphi-row-between">
        <h2 className="raphi-section-title">Today's Intake</h2>
        <button
          onClick={handleAddEntry}
          className={`raphi-btn ${isModalOpen ? "raphi-btn-ghost" : "raphi-btn-primary"}`}
        >
          {isModalOpen ? "Cancel" : "Nutrient Intake Entry"}
        </button>
      </div>

      {isModalOpen && (
        <div className="raphi-form">
          <h3 className="raphi-section-title">Nutrient Intake Entry</h3>

          <div className="raphi-form-grid">
            <div className="raphi-stack">
              <label className="raphi-label">Category</label>
              {!isAddingCategory ? (
                <select
                  value={formData.category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  tabIndex={1}
                  className="raphi-select"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="+">+ Add Category</option>
                </select>
              ) : (
                <div className="raphi-stack">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAddCategory();
                      } else if (e.key === "Escape") {
                        setIsAddingCategory(false);
                        setNewCategoryName("");
                      }
                    }}
                    placeholder="Enter category name..."
                    autoFocus
                    className="raphi-input"
                  />
                  <div className="raphi-inline">
                    <button onClick={handleAddCategory} className="raphi-btn raphi-btn-primary raphi-btn-sm">
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setIsAddingCategory(false);
                        setNewCategoryName("");
                      }}
                      className="raphi-btn raphi-btn-ghost raphi-btn-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div ref={itemSearchRef} className="raphi-stack raphi-item-search">
              <label className="raphi-label">Item</label>
              <input
                type="text"
                value={itemSearchQuery}
                onChange={(e) => handleItemSearch(e.target.value)}
                onFocus={() => setShowItemResults(itemSearchQuery.length > 0)}
                placeholder="Search or type to create..."
                tabIndex={2}
                className="raphi-input"
              />
              {showItemResults && (
                <div className="raphi-dropdown">
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleSelectItem(item)}
                        className="raphi-dropdown-item"
                      >
                        {item.name}
                      </div>
                    ))
                  ) : (
                    <div className="raphi-dropdown-item raphi-muted">No items found</div>
                  )}
                  {showCreateOption && (
                    <div
                      onClick={handleCreateNewItem}
                      className="raphi-dropdown-item raphi-dropdown-create"
                    >
                      + Create "{itemSearchQuery.trim()}"
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="raphi-stack">
              <label className="raphi-label">Amount</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0"
                tabIndex={3}
                className="raphi-input"
              />
            </div>

            <div className="raphi-stack">
              <label className="raphi-label">Notes</label>
              <input
                type="text"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Optional notes..."
                tabIndex={4}
                className="raphi-input"
              />
            </div>
          </div>

          <div className="raphi-actions">
            <button onClick={handleCloseForm} className="raphi-btn raphi-btn-ghost">
              Cancel
            </button>
            <button onClick={handleSubmit} className="raphi-btn raphi-btn-primary">
              Add Entry
            </button>
          </div>
        </div>
      )}

      {entries.length === 0 ? (
        <p className="raphi-muted">No entries for today</p>
      ) : (
        <div className="raphi-stack">
          {entries.map((entry) => (
            <div key={entry.id} className="raphi-entry">
              <div className="raphi-stack">
                <div className="raphi-row">
                  <span className="raphi-entry-type">{entry.itemType}</span>
                  <span className="raphi-entry-name">
                    {getItemName(entry.itemId, entry.itemType)}
                  </span>
                </div>
                <div>
                  {entry.amount} {entry.unit}
                </div>
                {entry.notes && <div className="raphi-note">{entry.notes}</div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
