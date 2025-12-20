import type { DashboardSummary } from "./dashboard.types";

export const mockDashboard: DashboardSummary = {
    focusTimeMs: 2 * 60 * 60 * 1000,
    breakTimeMs: 30 * 60 * 1000, 
    netTimeMs: 90 * 60 * 1000,

    tasks: [
        {
            id: "1",
            label: "Design Dashboard",
            completedCount: 3,
            targetCount: 5,
            completed: false,
            subtasks: [
                {
                    id: "1a",
                    label: "Layout",
                    completed: true,
                },
                {
                    id: "1b",
                    label: "Styling",
                    completed: false,
                },
            ],
        },
    ],
};