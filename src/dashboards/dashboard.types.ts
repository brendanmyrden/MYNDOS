export type SessionType = "focus" | "break" | "admin" | "recovery";

export interface Session {
    id: string;
    label: string;
    type: SessionType;
    durationMs: number;
}

export interface Subtask {
    id: string;
    label: string;
    completed: boolean;
}

export interface Task {
    id: string;
    label: string;
    completedCount: number;
    targetCount?: number;
    completed?: boolean;
    subtasks?: Subtask[];
}

export interface DashboardSummary {
    focusTimeMs: number;
    breakTimeMs: number;
    netTimeMs: number;
    tasks: Task[];
}