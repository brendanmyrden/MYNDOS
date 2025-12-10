export const syyrSchema = {
  scripts: [] as { id: string; name: string; content: string }[],
  executions: [] as {
    id: string;
    scriptId: string;
    timestamp: Date;
    result?: string;
  }[],
};
