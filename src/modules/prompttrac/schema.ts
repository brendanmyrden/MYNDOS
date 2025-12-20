// Entities for PROMPTRAC

// Represents a single prompt in the system
export interface Prompt {
  id: string; // Unique identifier for the prompt
  text: string; // The text content of the prompt
  usedAt?: Date; // Optional timestamp of the last time this prompt was used
  tags?: string[]; // Optional array of tags for categorization or search
  createdAt?: Date; // Optional timestamp when the prompt was created
  notes?: string; // Optional notes or context about the prompt
}

// Represents a history entry of a prompt being used and its response
export interface PromptHistory {
  promptId: string; // ID of the associated prompt
  response: string; // Response generated or recorded for this prompt
  timestamp: Date; // When the prompt was executed or the response was recorded
  userId?: string; // Optional: which user executed the prompt
  notes?: string; // Optional additional notes about this usage
}

// Main schema object for PromptTrac module
export const prompttracSchema: {
  prompts: Prompt[];
  history: PromptHistory[];
} = {
  prompts: [], // Array of all prompts in the system
  history: [], // Array of historical prompt executions and responses
};
