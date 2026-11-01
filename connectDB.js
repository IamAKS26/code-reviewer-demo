// supabase.js: Supabase client and auth helpers (no keys stored in this file)
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./config.js";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Supabase is not configured. Copy config.example.js to config.js and fill it in.");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Turn raw Supabase errors into safe, user-facing messages.
function friendlyError(error) {
  const msg = (error?.message || "").toLowerCase();
  if (msg.includes("invalid login credentials")) return "Incorrect email or password.";
  if (msg.includes("email not confirmed")) return "Please confirm your email before logging in.";
  if (msg.includes("rate limit") || error?.status === 429) return "Too many attempts. Please try again later.";
  if (msg.includes("failed to fetch") || msg.includes("network")) return "Network error. Check your connection.";
  return "Something went wrong. Please try again.";
}

export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(friendlyError(error));
  return data.user;
}

export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: window.location.origin + "/login.html" },
  });
  if (error) throw new Error(friendlyError(error));
  return data.user;
}

export async function resetPassword(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + "/reset-password.html",
  });
  if (error) throw new Error(friendlyError(error));
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(friendlyError(error));
}

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}