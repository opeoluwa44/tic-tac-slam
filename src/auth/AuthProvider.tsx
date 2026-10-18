import { useEffect, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { AuthContext } from "./context";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(supabase !== null);

  useEffect(() => {
    if (!supabase) return;
    // Fires once with any saved session on startup, then on every sign-in or sign-out.
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const ensureSession = async (): Promise<User> => {
    if (!supabase)
      throw new Error("Online play is not available in this build");
    const { data } = await supabase.auth.getSession();
    if (data.session) return data.session.user;
    const { data: created, error } = await supabase.auth.signInAnonymously();
    if (error || !created.user)
      throw error ?? new Error("Could not start a guest session");
    return created.user;
  };

  return (
    <AuthContext.Provider
      value={{
        enabled: supabase !== null,
        loading,
        user,
        member: user !== null && !user.is_anonymous,
        ensureSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
