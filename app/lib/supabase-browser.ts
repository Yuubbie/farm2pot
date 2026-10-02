"use client";

import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function createClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a mock client that throws helpful errors
    return {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signUp: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
        signInWithPassword: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
        signOut: () => Promise.resolve({ error: { message: "Supabase not configured" } }),
        resetPasswordForEmail: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
        updateUser: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
      },
      from: () => ({
        select: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
        insert: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
        update: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
        delete: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
        eq: function() { return this; },
        single: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
        order: function() { return this; },
      }),
    } as any;
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}