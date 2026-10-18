import { createContext, useContext } from "react";
import type { User } from "@supabase/supabase-js";

export type AuthValue = {
  enabled: boolean; // false if Supabase isn't configured
  loading: boolean; // true until we know whether a session exists
  user: User | null;
  member: boolean; // a real account, as opposed to an anonymous guest session
  ensureSession: () => Promise<User>; // returns the current user, creating a guest session if needed
};

export const AuthContext = createContext<AuthValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
