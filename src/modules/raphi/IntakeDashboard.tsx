import { useState, useEffect, useRef } from "react";
import type { IntakeLogEntry, Ingredient, Supplement } from "./types";
import {
  getIntakeForDate,
  getIntakeLog,
  getIngredients,
  getSupplements,
  addIntakeEntry,
  updateIntakeEntry,
  deleteIntakeEntry,
  saveIngredient,
  saveSupplement,
  getCategories,
  saveCategory,
  deleteCategory,
} from "./store";

const DEFAULT_CATEGORIES = ["Food", "Drink", "Supplements"];
export default function IntakeDashboard() {
  const [entries, setEntries] = useState<IntakeLogEntry[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [itemDetails, setItemDetails] = useState<Ingredient | Supplement | null>(null);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [itemSearchQuery, setItemSearchQuery] = useState("");
  const [showItemResults, setShowItemResults] = useState(false);
  const itemSearchRef = useRef<HTMLDivElement>(null);
  const [entryFilter, setEntryFilter] = useState<"today" | "all">("all");
  const [viewMode, setViewMode] = useState<"log" | "items">("log");
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [managerItem, setManagerItem] = useState<Ingredient | Supplement | null>(null);
  const [managerItemType, setManagerItemType] = useState<"ingredient" | "supplement" | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "ingredient" | "supplement">("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [formData, setFormData] = useState({
    date: "",
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
      const [nextEntries, nextIngredients, nextSupplements, nextCategories] = await Promise.all([
        entryFilter === "all" ? getIntakeLog() : getIntakeForDate(today),
        getIngredients(),
        getSupplements(),
        getCategories(),
      ]);

      if (!active) return;
      setEntries(nextEntries);
      setIngredients(nextIngredients);
      setSupplements(nextSupplements);
      if (nextCategories.length === 0) {
        await Promise.all(DEFAULT_CATEGORIES.map((name) => saveCategory(name)));
        setCategories(DEFAULT_CATEGORIES);
      } else {
        setCategories(nextCategories);
      }
      setFormData((prev) => ({ ...prev, date: prev.date || today }));
    })();

    return () => {
      active = false;
    };
  }, [entryFilter]);

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

  const formatConvertedAmount = (amount: number, unit: string): string | null => {
    const normalized = unit.toLowerCase();
    const conversions: Record<string, { unit: string; factor: number }> = {
      g: { unit: "oz", factor: 0.03527396 },
      oz: { unit: "g", factor: 28.349523 },
      mg: { unit: "mcg", factor: 1000 },
      mcg: { unit: "mg", factor: 0.001 },
      ml: { unit: "oz", factor: 0.033814 },
      l: { unit: "ml", factor: 1000 },
    };
    const conversion = conversions[normalized];
    if (!conversion) return null;
    const converted = amount * conversion.factor;
    const formatted = converted >= 10 ? converted.toFixed(1) : converted.toFixed(2);
    return `${formatted} ${conversion.unit}`;
  };

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
    if (isModalOpen) {
      handleCloseForm();
      return;
    }
    setEditingEntryId(null);
    setFormData((prev) => ({ ...prev, date: prev.date || getTodayDate() }));
    setIsModalOpen(true);
  };

  const handleCloseForm = () => {
    setIsModalOpen(false);
    setIsAddingCategory(false);
    setNewCategoryName("");
    setItemSearchQuery("");
    setShowItemResults(false);
    setItemDetails(null);
    setEditingEntryId(null);
    setFormData({
      date: getTodayDate(),
      category: "Food",
      itemId: "",
      amount: "",
      unit: "",
      notes: "",
    });
  };

  const handleAddCategory = async () => {
    if (newCategoryName.trim() && !categories.includes(newCategoryName.trim())) {
      const nextCategory = newCategoryName.trim();
      setCategories([...categories, nextCategory]);
      await saveCategory(nextCategory);
      setFormData((prev) => ({ ...prev, category: nextCategory }));
      setNewCategoryName("");
      setIsAddingCategory(false);
    }
  };

  const handleCategoryChange = (value: string) => {
    if (value === "+") {
      setIsAddingCategory(true);
    } else {
      setIsAddingCategory(false);
      setItemSearchQuery("");
      setShowItemResults(false);
      setItemDetails(null);
      setFormData((prev) => ({ ...prev, category: value, itemId: "", unit: "" }));
    }
  };

  const handleItemSearch = (query: string) => {
    setItemSearchQuery(query);
    setShowItemResults(query.length > 0);
    if (query.length === 0) {
      setItemDetails(null);
      setFormData((prev) => ({ ...prev, itemId: "", unit: "" }));
    }
  };

  const handleSelectItem = (item: Ingredient | Supplement) => {
    setFormData((prev) => ({ ...prev, itemId: item.id, unit: item.unit }));
    setItemSearchQuery(item.name);
    setShowItemResults(false);
    setItemDetails(item);
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
      setItemDetails(newSupplement);
      setFormData((prev) => ({ ...prev, itemId: newId, unit: newSupplement.unit }));
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
      setItemDetails(newIngredient);
      setFormData((prev) => ({ ...prev, itemId: newId, unit: newIngredient.unit }));
    }

    setItemSearchQuery(itemSearchQuery.trim());
    setShowItemResults(false);
  };

  const handleSaveItemDetails = async () => {
    if (!itemDetails) return;
    if (formData.category === "Supplements") {
      const updated = itemDetails as Supplement;
      await saveSupplement(updated);
      setSupplements((prev) => prev.filter((item) => item.id !== updated.id).concat(updated));
    } else {
      const updated = itemDetails as Ingredient;
      await saveIngredient(updated);
      setIngredients((prev) => prev.filter((item) => item.id !== updated.id).concat(updated));
    }
  };

  const handleEditEntry = (entry: IntakeLogEntry) => {
    const itemType = entry.itemType;
    const item = itemType === "supplement"
      ? supplements.find((supplement) => supplement.id === entry.itemId)
      : ingredients.find((ingredient) => ingredient.id === entry.itemId);
    setEditingEntryId(entry.id);
    setItemDetails(item ?? null);
    setFormData({
      date: entry.date,
      category: entry.category ?? "Food",
      itemId: entry.itemId,
      amount: String(entry.amount),
      unit: entry.unit,
      notes: entry.notes ?? "",
    });
    setItemSearchQuery(item?.name ?? "");
    setShowItemResults(false);
    setIsModalOpen(true);
  };

  const handleDeleteEntry = async (entryId: string) => {
    await deleteIntakeEntry(entryId);
    setEntries((prev) => prev.filter((entry) => entry.id !== entryId));
  };

  const handleSubmit = async () => {
    if (!formData.itemId || !formData.amount) {
      alert("Please fill in all required fields");
      return;
    }

    const itemType = formData.category === "Supplements" ? "supplement" : "ingredient";
    const unit = formData.unit || (itemType === "supplement" ? "mg" : "g");

    const entryPayload: IntakeLogEntry = {
      id: editingEntryId ?? Date.now().toString(),
      date: formData.date || getTodayDate(),
      itemType: itemType,
      itemId: formData.itemId,
      category: formData.category,
      amount: parseFloat(formData.amount) || 0,
      unit: unit,
      notes: formData.notes || undefined,
    };

    if (editingEntryId) {
      await updateIntakeEntry(entryPayload);
      setEntries((prev) => prev.map((entry) => (entry.id === editingEntryId ? entryPayload : entry)));
    } else {
      await addIntakeEntry(entryPayload);
      setEntries((prev) => [...prev, entryPayload]);
    }
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

  const sortedEntries = [...entries].sort((a, b) => b.date.localeCompare(a.date));
  const filteredEntries = sortedEntries.filter((entry) => {
    const entryCategory = entry.category ?? "Food";
    if (filterType !== "all" && entry.itemType !== filterType) return false;
    if (filterCategory !== "all" && entryCategory !== filterCategory) return false;
    if (entryFilter === "all") {
      if (filterStartDate && entry.date < filterStartDate) return false;
      if (filterEndDate && entry.date > filterEndDate) return false;
    }
    if (!searchQuery.trim()) return true;
    const query = searchQuery.trim().toLowerCase();
    const name = getItemName(entry.itemId, entry.itemType).toLowerCase();
    const notes = entry.notes?.toLowerCase() ?? "";
    return name.includes(query) || notes.includes(query);
  });

  return (
    <div className="raphi-dashboard">
      {viewMode === "log" ? (
        <>
          <div className="raphi-row raphi-row-between">
            <h2 className="raphi-section-title">
              {entryFilter === "today" ? "Today's Intake" : "All Intake Entries"}
            </h2>
            <div className="raphi-inline">
              <button
                onClick={() => setEntryFilter("today")}
                className={`raphi-btn raphi-btn-sm ${entryFilter === "today" ? "raphi-btn-primary" : "raphi-btn-ghost"}`}
              >
                Today
              </button>
              <button
                onClick={() => setEntryFilter("all")}
                className={`raphi-btn raphi-btn-sm ${entryFilter === "all" ? "raphi-btn-primary" : "raphi-btn-ghost"}`}
              >
                All Entries
              </button>
              <button
                onClick={handleAddEntry}
                className={`raphi-btn ${isModalOpen ? "raphi-btn-ghost" : "raphi-btn-primary"}`}
              >
                {isModalOpen ? "Cancel" : "Nutrient Intake Entry"}
              </button>
            </div>
          </div>

          {entryFilter === "all" && (
            <div className="raphi-form">
              <div className="raphi-form-grid">
                <div className="raphi-stack">
                  <label className="raphi-label">Search</label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search items or notes..."
                    className="raphi-input"
                  />
                </div>
                <div className="raphi-stack">
                  <label className="raphi-label">From</label>
                  <input
                    type="date"
                    value={filterStartDate}
                    onChange={(e) => setFilterStartDate(e.target.value)}
                    className="raphi-input"
                  />
                </div>
                <div className="raphi-stack">
                  <label className="raphi-label">To</label>
                  <input
                    type="date"
                    value={filterEndDate}
                    onChange={(e) => setFilterEndDate(e.target.value)}
                    className="raphi-input"
                  />
                </div>
                <div className="raphi-stack">
                  <label className="raphi-label">Type</label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as "all" | "ingredient" | "supplement")}
                    className="raphi-select"
                  >
                    <option value="all">All</option>
                    <option value="ingredient">Ingredient</option>
                    <option value="supplement">Supplement</option>
                  </select>
                </div>
                <div className="raphi-stack">
                  <label className="raphi-label">Category</label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="raphi-select"
                  >
                    <option value="all">All</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {isModalOpen && (
            <div className="raphi-form">
              <h3 className="raphi-section-title">
                {editingEntryId ? "Edit Nutrient Entry" : "Nutrient Intake Entry"}
              </h3>

              <div className="raphi-form-grid">
                <div className="raphi-stack">
                  <label className="raphi-label">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                    className="raphi-input"
                    tabIndex={1}
                  />
                </div>
                <div className="raphi-stack">
                  <label className="raphi-label">Category</label>
                  {!isAddingCategory ? (
                    <select
                      value={formData.category}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      tabIndex={2}
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
                    tabIndex={3}
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
                    onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
                    placeholder="0"
                    tabIndex={4}
                    className="raphi-input"
                  />
                </div>

                <div className="raphi-stack">
                  <label className="raphi-label">Unit</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData((prev) => ({ ...prev, unit: e.target.value }))}
                    placeholder={formData.category === "Supplements" ? "mg" : "g"}
                    tabIndex={5}
                    className="raphi-input"
                  />
                </div>

                <div className="raphi-stack">
                  <label className="raphi-label">Notes</label>
                  <input
                    type="text"
                    value={formData.notes}
                    onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                    placeholder="Optional notes..."
                    tabIndex={6}
                    className="raphi-input"
                  />
                </div>
              </div>

              {itemDetails && (
                <div className="raphi-stack">
                  <h4 className="raphi-section-title">Item Details</h4>
                  {formData.category === "Supplements" ? (
                    <div className="raphi-form-grid">
                      <div className="raphi-stack">
                        <label className="raphi-label">Dose</label>
                        <input
                          type="number"
                          value={(itemDetails as Supplement).dose}
                          onChange={(e) =>
                            setItemDetails({
                              ...(itemDetails as Supplement),
                              dose: Number(e.target.value || 0),
                            })
                          }
                          className="raphi-input"
                        />
                      </div>
                      <div className="raphi-stack">
                        <label className="raphi-label">Unit</label>
                        <input
                          type="text"
                          value={(itemDetails as Supplement).unit}
                          onChange={(e) => {
                            const nextUnit = e.target.value;
                            setItemDetails({
                              ...(itemDetails as Supplement),
                              unit: nextUnit,
                            });
                            setFormData((prev) => ({ ...prev, unit: nextUnit }));
                          }}
                          className="raphi-input"
                        />
                      </div>
                      <div className="raphi-stack">
                        <label className="raphi-label">Type</label>
                        <input
                          type="text"
                          value={(itemDetails as Supplement).type ?? ""}
                          onChange={(e) =>
                            setItemDetails({
                              ...(itemDetails as Supplement),
                              type: e.target.value,
                            })
                          }
                          placeholder="Capsule, powder..."
                          className="raphi-input"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="raphi-form-grid">
                      <div className="raphi-stack">
                        <label className="raphi-label">Calories</label>
                        <input
                          type="number"
                          value={(itemDetails as Ingredient).calories}
                          onChange={(e) =>
                            setItemDetails({
                              ...(itemDetails as Ingredient),
                              calories: Number(e.target.value || 0),
                            })
                          }
                          className="raphi-input"
                        />
                      </div>
                      <div className="raphi-stack">
                        <label className="raphi-label">Protein</label>
                        <input
                          type="number"
                          value={(itemDetails as Ingredient).protein}
                          onChange={(e) =>
                            setItemDetails({
                              ...(itemDetails as Ingredient),
                              protein: Number(e.target.value || 0),
                            })
                          }
                          className="raphi-input"
                        />
                      </div>
                      <div className="raphi-stack">
                        <label className="raphi-label">Carbs</label>
                        <input
                          type="number"
                          value={(itemDetails as Ingredient).carbs}
                          onChange={(e) =>
                            setItemDetails({
                              ...(itemDetails as Ingredient),
                              carbs: Number(e.target.value || 0),
                            })
                          }
                          className="raphi-input"
                        />
                      </div>
                      <div className="raphi-stack">
                        <label className="raphi-label">Fat</label>
                        <input
                          type="number"
                          value={(itemDetails as Ingredient).fat}
                          onChange={(e) =>
                            setItemDetails({
                              ...(itemDetails as Ingredient),
                              fat: Number(e.target.value || 0),
                            })
                          }
                          className="raphi-input"
                        />
                      </div>
                      <div className="raphi-stack">
                        <label className="raphi-label">Serving Size</label>
                        <input
                          type="number"
                          value={(itemDetails as Ingredient).servingSize}
                          onChange={(e) =>
                            setItemDetails({
                              ...(itemDetails as Ingredient),
                              servingSize: Number(e.target.value || 0),
                            })
                          }
                          className="raphi-input"
                        />
                      </div>
                      <div className="raphi-stack">
                        <label className="raphi-label">Unit</label>
                        <input
                          type="text"
                          value={(itemDetails as Ingredient).unit}
                          onChange={(e) => {
                            const nextUnit = e.target.value;
                            setItemDetails({
                              ...(itemDetails as Ingredient),
                              unit: nextUnit,
                            });
                            setFormData((prev) => ({ ...prev, unit: nextUnit }));
                          }}
                          className="raphi-input"
                        />
                      </div>
                      <div className="raphi-stack">
                        <label className="raphi-label">Brand</label>
                        <input
                          type="text"
                          value={(itemDetails as Ingredient).brand ?? ""}
                          onChange={(e) =>
                            setItemDetails({
                              ...(itemDetails as Ingredient),
                              brand: e.target.value,
                            })
                          }
                          placeholder="Optional brand"
                          className="raphi-input"
                        />
                      </div>
                    </div>
                  )}

                  <div className="raphi-actions">
                    <button onClick={handleSaveItemDetails} className="raphi-btn raphi-btn-ghost">
                      Save Item Details
                    </button>
                  </div>
                </div>
              )}

              <div className="raphi-actions">
                <button onClick={handleCloseForm} className="raphi-btn raphi-btn-ghost">
                  Cancel
                </button>
                <button onClick={handleSubmit} className="raphi-btn raphi-btn-primary">
                  {editingEntryId ? "Update Entry" : "Add Entry"}
                </button>
              </div>
            </div>
          )}

          {filteredEntries.length === 0 ? (
            <p className="raphi-muted">
              {entryFilter === "all" ? "No entries yet" : "No entries for today"}
            </p>
          ) : (
            <div className="raphi-stack">
              {filteredEntries.map((entry) => {
                const converted = formatConvertedAmount(entry.amount, entry.unit);
                return (
                  <div key={entry.id} className="raphi-entry">
                    <button
                      className="raphi-entry-delete"
                      onClick={() => handleDeleteEntry(entry.id)}
                      aria-label="Delete entry"
                    >
                      ×
                    </button>
                    <button
                      className="raphi-entry-edit"
                      onClick={() => handleEditEntry(entry)}
                    >
                      edit
                    </button>
                    <div className="raphi-stack">
                      <div className="raphi-row">
                        <span className="raphi-entry-type">{entry.itemType}</span>
                        <span className="raphi-entry-name">
                          {getItemName(entry.itemId, entry.itemType)}
                        </span>
                      </div>
                      {entryFilter === "all" && <div className="raphi-muted">{entry.date}</div>}
                      <div className="raphi-muted">{entry.category ?? "Food"}</div>
                      <div>
                        {entry.amount} {entry.unit}
                      </div>
                      {converted && <div className="raphi-muted">{converted}</div>}
                      {entry.notes && <div className="raphi-note">{entry.notes}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <div className="raphi-stack">
          <div className="raphi-row raphi-row-between">
            <h2 className="raphi-section-title">Items Manager</h2>
            <div className="raphi-inline">
              <span className="raphi-muted">Manage categories, foods, drinks, supplements</span>
            </div>
          </div>

          <section className="raphi-section">
            <h3 className="raphi-section-title">Categories</h3>
            <div className="raphi-form-grid">
              <div className="raphi-stack">
                <label className="raphi-label">New Category</label>
                <div className="raphi-inline">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Add category..."
                    className="raphi-input"
                  />
                  <button onClick={handleAddCategory} className="raphi-btn raphi-btn-primary raphi-btn-sm">
                    Add
                  </button>
                </div>
              </div>
            </div>
            <div className="raphi-stack">
              {categories.map((cat) => (
                <div key={cat} className="raphi-entry">
                  <button
                    className="raphi-entry-delete"
                    onClick={() => {
                      deleteCategory(cat);
                      setCategories((prev) => prev.filter((item) => item !== cat));
                    }}
                    aria-label="Delete category"
                  >
                    ×
                  </button>
                  <div className="raphi-entry-name">{cat}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="raphi-section">
            <h3 className="raphi-section-title">Ingredients</h3>
            <div className="raphi-stack">
              {ingredients.map((item) => (
                <div key={item.id} className="raphi-entry">
                  <div className="raphi-row raphi-row-between">
                    <div className="raphi-entry-name">{item.name}</div>
                    <button
                      className="raphi-btn raphi-btn-ghost raphi-btn-sm"
                      onClick={() => {
                        setManagerItem(item);
                        setManagerItemType("ingredient");
                      }}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="raphi-section">
            <h3 className="raphi-section-title">Supplements</h3>
            <div className="raphi-stack">
              {supplements.map((item) => (
                <div key={item.id} className="raphi-entry">
                  <div className="raphi-row raphi-row-between">
                    <div className="raphi-entry-name">{item.name}</div>
                    <button
                      className="raphi-btn raphi-btn-ghost raphi-btn-sm"
                      onClick={() => {
                        setManagerItem(item);
                        setManagerItemType("supplement");
                      }}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {managerItem && managerItemType && (
            <section className="raphi-form">
              <h3 className="raphi-section-title">Edit {managerItemType}</h3>
              {managerItemType === "ingredient" ? (
                <div className="raphi-form-grid">
                  <div className="raphi-stack">
                    <label className="raphi-label">Name</label>
                    <input
                      type="text"
                      value={(managerItem as Ingredient).name}
                      onChange={(e) =>
                        setManagerItem({ ...(managerItem as Ingredient), name: e.target.value })
                      }
                      className="raphi-input"
                    />
                  </div>
                  <div className="raphi-stack">
                    <label className="raphi-label">Calories</label>
                    <input
                      type="number"
                      value={(managerItem as Ingredient).calories}
                      onChange={(e) =>
                        setManagerItem({
                          ...(managerItem as Ingredient),
                          calories: Number(e.target.value || 0),
                        })
                      }
                      className="raphi-input"
                    />
                  </div>
                  <div className="raphi-stack">
                    <label className="raphi-label">Protein</label>
                    <input
                      type="number"
                      value={(managerItem as Ingredient).protein}
                      onChange={(e) =>
                        setManagerItem({
                          ...(managerItem as Ingredient),
                          protein: Number(e.target.value || 0),
                        })
                      }
                      className="raphi-input"
                    />
                  </div>
                  <div className="raphi-stack">
                    <label className="raphi-label">Carbs</label>
                    <input
                      type="number"
                      value={(managerItem as Ingredient).carbs}
                      onChange={(e) =>
                        setManagerItem({
                          ...(managerItem as Ingredient),
                          carbs: Number(e.target.value || 0),
                        })
                      }
                      className="raphi-input"
                    />
                  </div>
                  <div className="raphi-stack">
                    <label className="raphi-label">Fat</label>
                    <input
                      type="number"
                      value={(managerItem as Ingredient).fat}
                      onChange={(e) =>
                        setManagerItem({
                          ...(managerItem as Ingredient),
                          fat: Number(e.target.value || 0),
                        })
                      }
                      className="raphi-input"
                    />
                  </div>
                  <div className="raphi-stack">
                    <label className="raphi-label">Serving Size</label>
                    <input
                      type="number"
                      value={(managerItem as Ingredient).servingSize}
                      onChange={(e) =>
                        setManagerItem({
                          ...(managerItem as Ingredient),
                          servingSize: Number(e.target.value || 0),
                        })
                      }
                      className="raphi-input"
                    />
                  </div>
                  <div className="raphi-stack">
                    <label className="raphi-label">Unit</label>
                    <input
                      type="text"
                      value={(managerItem as Ingredient).unit}
                      onChange={(e) =>
                        setManagerItem({ ...(managerItem as Ingredient), unit: e.target.value })
                      }
                      className="raphi-input"
                    />
                  </div>
                  <div className="raphi-stack">
                    <label className="raphi-label">Brand</label>
                    <input
                      type="text"
                      value={(managerItem as Ingredient).brand ?? ""}
                      onChange={(e) =>
                        setManagerItem({ ...(managerItem as Ingredient), brand: e.target.value })
                      }
                      className="raphi-input"
                    />
                  </div>
                </div>
              ) : (
                <div className="raphi-form-grid">
                  <div className="raphi-stack">
                    <label className="raphi-label">Name</label>
                    <input
                      type="text"
                      value={(managerItem as Supplement).name}
                      onChange={(e) =>
                        setManagerItem({ ...(managerItem as Supplement), name: e.target.value })
                      }
                      className="raphi-input"
                    />
                  </div>
                  <div className="raphi-stack">
                    <label className="raphi-label">Dose</label>
                    <input
                      type="number"
                      value={(managerItem as Supplement).dose}
                      onChange={(e) =>
                        setManagerItem({
                          ...(managerItem as Supplement),
                          dose: Number(e.target.value || 0),
                        })
                      }
                      className="raphi-input"
                    />
                  </div>
                  <div className="raphi-stack">
                    <label className="raphi-label">Unit</label>
                    <input
                      type="text"
                      value={(managerItem as Supplement).unit}
                      onChange={(e) =>
                        setManagerItem({ ...(managerItem as Supplement), unit: e.target.value })
                      }
                      className="raphi-input"
                    />
                  </div>
                  <div className="raphi-stack">
                    <label className="raphi-label">Type</label>
                    <input
                      type="text"
                      value={(managerItem as Supplement).type ?? ""}
                      onChange={(e) =>
                        setManagerItem({ ...(managerItem as Supplement), type: e.target.value })
                      }
                      className="raphi-input"
                    />
                  </div>
                </div>
              )}

              <div className="raphi-actions">
                <button
                  onClick={() => {
                    setManagerItem(null);
                    setManagerItemType(null);
                  }}
                  className="raphi-btn raphi-btn-ghost"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (!managerItem || !managerItemType) return;
                    if (managerItemType === "ingredient") {
                      await saveIngredient(managerItem as Ingredient);
                      setIngredients((prev) =>
                        prev.map((item) => (item.id === managerItem.id ? (managerItem as Ingredient) : item))
                      );
                    } else {
                      await saveSupplement(managerItem as Supplement);
                      setSupplements((prev) =>
                        prev.map((item) => (item.id === managerItem.id ? (managerItem as Supplement) : item))
                      );
                    }
                    setManagerItem(null);
                    setManagerItemType(null);
                  }}
                  className="raphi-btn raphi-btn-primary"
                >
                  Save Changes
                </button>
              </div>
            </section>
          )}
        </div>
      )}

      <div className="raphi-bottom-bar">
        <button
          onClick={() => setViewMode(viewMode === "log" ? "items" : "log")}
          className="raphi-btn raphi-btn-primary raphi-btn-full"
        >
          {viewMode === "log" ? "Manage Items" : "Back to Log"}
        </button>
      </div>
    </div>
  );
}
