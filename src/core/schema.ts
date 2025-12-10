export const CoreSchema = {
  user: {} as { id: string; name: string; email?: string },
  session: {} as { token: string; expiresAt: Date },
};

export interface User {
  id: string;
  name: string;
  email?: string;
}

export interface Session {
  token: string;
  expiresAt: Date;
}

export const coreSchema: {
  user: User | null;
  session: Session | null;
} = {
  user: null,
  session: null,
};
