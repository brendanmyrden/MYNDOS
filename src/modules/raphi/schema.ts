// Entities for RAPHI

// Represents a single message in RAPH module
export interface RAPHMessage {
  id: string; // Unique identifier for the message
  content: string; // Text content of the message
  createdAt: Date; // Timestamp when the message was created
  module?: string; // Optional module source of the message
  notes?: string; // Optional additional notes
}

// Represents an action log entry in RAPH module
export interface RAPHLog {
  id: string; // Unique identifier for the log entry
  action: string; // Description of the action performed
  timestamp: Date; // Timestamp when the action occurred
  details?: string; // Optional additional details
}

// The main schema object for the RAPH module
export const raphiSchema: {
  messages: RAPHMessage[];
  logs: RAPHLog[];
} = {
  messages: [], // Array of messages recorded in the module
  logs: [], // Array of action logs for auditing or tracking
};
