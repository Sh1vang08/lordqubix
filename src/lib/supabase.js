import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error(
    "Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY — set them in .env " +
      "(see .env.example) and in Vercel's Environment Variables."
  );
}

/**
 * Single client for the whole app. Anonymous visitors read through RLS's
 * public-read policies; once signed in (admin panel only), the same client
 * carries the session and RLS grants write access to authenticated users.
 */
export const supabase = createClient(url, anonKey);
