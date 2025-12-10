// Entities for PROMPTRAC
export interface Prompt {
  id: string;
  text: string;
  usedAt?: Date;
}

export interface PromptHistory {
  promptId: string;
  response: string;
  timestamp: Date;
}

export const prompttracSchema: {
  prompts: Prompt[];
  history: PromptHistory[];
} = {
  prompts: [],
  history: [],
};
