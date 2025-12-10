// Entities for MYND OS

export interface Concept {
  id: string;
  name: string;
  description?: string;
  relatedIds?: string[];
}

export interface Affirmation {
  id: string;
  text: string;
  dateCreated: Date;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: Date;
}

export interface Connection {
  fromId: string;
  toId: string;
  type: string;
}

export const myndosSchema: {
  concepts: Concept[];
  affirmations: Affirmation[];
  tasks: Task[];
  connections: Connection[];
} = {
  concepts: [],
  affirmations: [],
  tasks: [],
  connections: [],
};
