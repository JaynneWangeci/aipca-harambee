import { createClient } from "@supabase/supabase-js";

let client: ReturnType<typeof createClient> | null = null;
let serviceClient: ReturnType<typeof createClient> | null = null;

function getSupabaseUrl(): string | null {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || null;
}

function getSupabaseAnonKey(): string | null {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || null;
}

function getServiceKey(): string | null {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || null;
}

export function getSupabase() {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  if (!url || !key) return null;
  if (!client) {
    client = createClient(url, key);
  }
  return client;
}

export function getServiceSupabase() {
  const url = getSupabaseUrl();
  const key = getServiceKey();
  if (!url || !key) return null;
  if (!serviceClient) {
    serviceClient = createClient(url, key);
  }
  return serviceClient;
}
