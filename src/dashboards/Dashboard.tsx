import type { DashboardSummary } from "./dashboard.types";

export function Dashboard({ data }: { data: DashboardSummary }) {
    return (
        <div className="dashboard">
          <h2>Dashboard</h2>
    
          <section>
            <h3>Time</h3>
            <p>Focus: {data.focusTimeMs / 60000} min</p>
            <p>Break: {data.breakTimeMs / 60000} min</p>
            <p>
              <strong>Net: {data.netTimeMs / 60000} min</strong>
            </p>
          </section>
    
          <section>
            <h3>Tasks</h3>
            {data.tasks.map(task => {
              const percent = task.targetCount
                ? Math.round((task.completedCount / task.targetCount) * 100)
                : 0;
    
              return (
                <div key={task.id} className="task-card">
                  <strong>{task.label}</strong>
                  <div>
                    {task.completedCount}/{task.targetCount ?? 0} ({percent}%)
                  </div>

                  {/* Render subtasks only if they exist */}
                  {task.subtasks && task.subtasks.length > 0 && (
                    <ul className="subtasks">
                      {task.subtasks.map(sub => (
                        <li key={sub.id} className="subtask">
                          {sub.label} {sub.completed ? "✅" : "❌"}
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