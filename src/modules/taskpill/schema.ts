export const taskpillSchema = {
  tasks: [] as {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    dueDate?: Date;
  }[],
  projects: [] as { id: string; name: string; taskIds: string[] }[],
};
