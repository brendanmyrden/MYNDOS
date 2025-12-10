export const CoreSchema = {
  user: {} as { id: string; name: string; email?: string },
  session: {} as { token: string; expiresAt: Date },
};
