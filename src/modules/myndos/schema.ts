// Entities for MYND OS

// Represents a core concept in the MYND OS knowledge base
export interface Concept {
  id: string; // Unique identifier
  name: string; // Name of the concept
  description?: string; // Optional description providing more detail
  relatedIds?: string[]; // Optional array of IDs linking to related concepts
}

// Represents a user affirmation, typically used for mindset or focus
export interface Affirmation {
  id: string; // Unique identifier
  text: string; // The affirmation text
  dateCreated: Date; // Timestamp when the affirmation was created
  notes?: string; // Optional notes about context or usage
}

// Represents a task or actionable item tracked in MYND OS
export interface Task {
  id: string; // Unique identifier
  title: string; // Task title or name
  completed: boolean; // Whether the task is done or pending
  dueDate?: Date; // Optional due date for the task
  priority?: "low" | "medium" | "high"; // Optional priority for task management
  notes?: string; // Optional notes or instructions
}

// Represents a relationship or connection between two entities in MYND OS
export interface Connection {
  fromId: string; // ID of the source entity (e.g., Concept or Task)
  toId: string; // ID of the target entity
  type: string; // Type of connection, e.g., "related", "dependsOn", "supports"
  description?: string; // Optional explanation of the connection
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
