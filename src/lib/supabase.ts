import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function createSupabase(): SupabaseClient | null {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as
    | string
    | undefined;
  if (!url || !key) return null;

  try {
    // Keep only the origin, so a pasted "/rest/v1/" or a trailing slash can't break requests.
    return createClient(new URL(url.trim()).origin, key.trim());
  } catch {
    // JSON.stringify makes hidden problems visible: quotes, spaces, a missing "https://".
    console.error(
      `VITE_SUPABASE_URL is not a valid URL: ${JSON.stringify(url)}. ` +
        "It should look like https://your-project-ref.supabase.co",
    );
    return null;
  }
}

export const supabase = createSupabase();
