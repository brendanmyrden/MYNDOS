export const RAPHiSchema = {
  messages: [] as {
    id: string;
    content: string;
    createdAt: Date;
    module?: string;
  }[],
  logs: [] as { id: string; action: string; timestamp: Date }[],
};

export interface RAPHMessage {
  id: string;
  content: string;
  createdAt: Date;
  module?: string;
}

export interface RAPHLog {
  id: string;
  action: string;
  timestamp: Date;
}

export const raphiSchema: {
  messages: RAPHMessage[];
  logs: RAPHLog[];
} = {
  messages: [],
  logs: [],
};
