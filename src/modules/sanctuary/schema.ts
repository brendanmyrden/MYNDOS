// Represents a predefined environmental setup or preset
export interface EnvironmentPreset {
  id: string; // Unique identifier
  name: string; // Name of the preset, e.g., "Morning Focus"
  settings: Record<string, unknown>; // Arbitrary key/value settings for the environment, e.g., lighting, sound, temperature
  description?: string; // Optional description of the preset
  createdAt?: Date; // Optional creation timestamp
  updatedAt?: Date; // Optional last updated timestamp
}

// Represents a recorded mood setting at a point in time
export interface MoodSetting {
  id: string; // Unique identifier
  mood: string; // Name of mood, e.g., "calm", "anxious", "energized"
  intensity: number; // Intensity of the mood, scale 0-10
  notes?: string; // Optional notes about the mood
  timestamp?: Date; // Optional timestamp when mood was recorded
}

// Represents a session using a specific environment preset
export interface Session {
  id: string; // Unique identifier
  presetId: string; // The EnvironmentPreset used in this session
  startedAt: Date; // Timestamp for when the session started
  endedAt?: Date; // Optional timestamp for when the session ended
  moodLogs?: MoodSetting[]; // Optional list of moods recorded during the session
  notes?: string; // Optional notes about the session
}
// Represents a single recorded emotional state or entry
export interface EmotionEntry {
  id: string; // Unique identifier
  timestamp: Date; // When the emotion was recorded
  emotion: string; // e.g., "happy", "anxious"
  intensity: number; // Scale 0-10
  notes?: string; // Optional notes about the context
}

// Represents the neurochemical state of the user at a given time
export interface NeurochemState {
  id: string; // Unique identifier
  timestamp: Date; // When measured or logged
  dopamine?: number; // Optional neurochemical levels
  serotonin?: number;
  norepinephrine?: number;
  gaba?: number;
  glutamate?: number;
  notes?: string; // Optional notes about state
}

// Represents a regulation technique or intervention applied
export interface RegulationTechnique {
  id: string; // Unique identifier
  name: string; // Technique name, e.g., "deep breathing"
  description?: string; // How it works or steps
  appliedAt: Date; // When it was used
  effectiveness?: number; // User-rated effectiveness 0-10
  notes?: string; // Optional notes
}

export const sanctuarySchema: {
  presets: EnvironmentPreset[];
  moods: MoodSetting[];
  sessions: Session[];
} = {
  presets: [],
  moods: [],
  sessions: [],
};
