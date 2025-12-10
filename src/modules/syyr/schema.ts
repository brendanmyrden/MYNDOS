// Entities for SYYR

export interface Sequence {
  id: string;
  name: string;
  description?: string;
  stepIds: string[]; // references SYYR steps
}

export interface Step {
  id: string;
  sequenceId: string;
  instruction: string;
  createdAt: Date;
  completed?: boolean;
}

export interface Rule {
  id: string;
  name: string;
  condition: string; // e.g., "if task.completed === true"
  action: string; // e.g., "trigger next sequence"
}

export interface Output {
  id: string;
  sequenceId: string;
  result: string;
  timestamp: Date;
}

export const syyrSchema: {
  sequences: Sequence[];
  steps: Step[];
  rules: Rule[];
  outputs: Output[];
} = {
  sequences: [],
  steps: [],
  rules: [],
  outputs: [],
};
