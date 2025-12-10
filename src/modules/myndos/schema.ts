export const myndosSchema = {
  concepts: [] as {
    id: string;
    name: string;
    description?: string;
    relatedIds?: string[];
  }[],
  affirmations: [] as { id: string; text: string; dateCreated: Date }[],
  tasks: [] as {
    id: string;
    title: string;
    completed: boolean;
    dueDate?: Date;
  }[],
  connections: [] as { fromId: string; toId: string; type: string }[],
};
