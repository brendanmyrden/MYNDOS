export const prompttracSchema = {
  prompts: [] as { id: string; text: string; usedAt?: Date }[],
  history: [] as { promptId: string; response: string; timestamp: Date }[],
};
