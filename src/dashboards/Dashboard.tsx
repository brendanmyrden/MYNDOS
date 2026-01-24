import { useState, useRef, useEffect } from "react";
import type { DashboardSummary } from "./dashboard.types";

interface EditableTextProps {
  value: string | number;
  onSave: (value: string | number) => void;
  displayValue?: string;
  className?: string;
  style?: React.CSSProperties;
}

function EditableText({ value, onSave, displayValue, className, style }: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(String(value));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditValue(String(value));
  };

  const handleBlur = () => {
    setIsEditing(false);
    const numValue = Number(editValue);
    if (!isNaN(numValue) && numValue >= 0) {
      onSave(numValue);
    } else if (editValue.trim() !== "") {
      onSave(editValue.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleBlur();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setEditValue(String(value));
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={className}
        style={{
          ...style,
          border: "1px solid #4A90E2",
          borderRadius: "4px",
          padding: "2px 6px",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          color: "#EDEDED",
          minWidth: "60px",
        }}
      />
    );
  }

  return (
    <span
      onDoubleClick={handleDoubleClick}
      style={{
        cursor: "text",
        userSelect: "none",
        ...style,
      }}
      className={className}
      title="Double-click to edit"
    >
      {displayValue ?? value}
    </span>
  );
}

export function Dashboard({ data: initialData }: { data: DashboardSummary }) {
  const [data, setData] = useState<DashboardSummary>(initialData);

  const updateFocusTime = (value: string | number) => {
    const minutes = typeof value === "string" ? parseFloat(value) || 0 : value;
    setData((prev) => ({
      ...prev,
      focusTimeMs: minutes * 60000,
      netTimeMs: minutes * 60000 - prev.breakTimeMs,
    }));
  };

  const updateBreakTime = (value: string | number) => {
    const minutes = typeof value === "string" ? parseFloat(value) || 0 : value;
    setData((prev) => ({
      ...prev,
      breakTimeMs: minutes * 60000,
      netTimeMs: prev.focusTimeMs - minutes * 60000,
    }));
  };

  const updateNetTime = (value: string | number) => {
    const minutes = typeof value === "string" ? parseFloat(value) || 0 : value;
    setData((prev) => ({
      ...prev,
      netTimeMs: minutes * 60000,
    }));
  };

  const updateTaskLabel = (taskId: string, label: string) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.id === taskId ? { ...task, label } : task
      ),
    }));
  };

  const updateTaskCompletedCount = (taskId: string, count: number) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.id === taskId ? { ...task, completedCount: count } : task
      ),
    }));
  };

  const updateTaskTargetCount = (taskId: string, count: number) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.id === taskId ? { ...task, targetCount: count } : task
      ),
    }));
  };

  const updateSubtaskLabel = (taskId: string, subtaskId: string, label: string) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks: task.subtasks?.map((sub) =>
                sub.id === subtaskId ? { ...sub, label } : sub
              ),
            }
          : task
      ),
    }));
  };

  return (
    <div className="dashboard" style={{ marginTop: "24px" }}>
      <h2>Dashboard</h2>

      <section style={{ marginBottom: "24px" }}>
        <h3>Time</h3>
        <p>
          Focus: <EditableText value={data.focusTimeMs / 60000} onSave={updateFocusTime} /> min
        </p>
        <p>
          Break: <EditableText value={data.breakTimeMs / 60000} onSave={updateBreakTime} /> min
        </p>
        <p>
          <strong>
            Net: <EditableText value={data.netTimeMs / 60000} onSave={updateNetTime} /> min
          </strong>
        </p>
      </section>

      <section>
        <h3>Tasks</h3>
        {data.tasks.map((task) => {
          const percent = task.targetCount
            ? Math.round((task.completedCount / task.targetCount) * 100)
            : 0;

          return (
            <div
              key={task.id}
              className="task-card"
              style={{
                marginBottom: "16px",
                padding: "12px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "8px",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
              }}
            >
              <strong>
                <EditableText
                  value={task.label}
                  onSave={(value) => updateTaskLabel(task.id, String(value))}
                />
              </strong>
              <div style={{ marginTop: "8px" }}>
                <EditableText
                  value={task.completedCount}
                  onSave={(value) => updateTaskCompletedCount(task.id, Number(value))}
                />
                /
                <EditableText
                  value={task.targetCount ?? 0}
                  onSave={(value) => updateTaskTargetCount(task.id, Number(value))}
                />{" "}
                ({percent}%)
              </div>

              {/* Render subtasks only if they exist */}
              {task.subtasks && task.subtasks.length > 0 && (
                <ul className="subtasks" style={{ marginTop: "8px", paddingLeft: "20px" }}>
                  {task.subtasks.map((sub) => (
                    <li key={sub.id} className="subtask" style={{ marginBottom: "4px" }}>
                      <EditableText
                        value={sub.label}
                        onSave={(value) => updateSubtaskLabel(task.id, sub.id, String(value))}
                      />{" "}
                      {sub.completed ? "✅" : "❌"}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
}  