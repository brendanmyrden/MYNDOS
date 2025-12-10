export const RAPHiSchema = {
  messages: [] as {
    id: string;
    content: string;
    createdAt: Date;
    module?: string;
  }[],
  logs: [] as { id: string; action: string; timestamp: Date }[],
};
