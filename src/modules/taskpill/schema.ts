// Entities for TASK PILLS
export interface TaskPill {
  id: string;
  label: string;
  color: string; // e.g. "#FFAA00" or "blue"
  createdAt: Date;
  linkedTaskIds?: string[]; // optional relationship to tasks in MYND OS
}

export const taskPillsSchema: {
  pills: TaskPill[];
} = {
  pills: [],
};
