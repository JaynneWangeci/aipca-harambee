import { createClient } from "@supabase/supabase-js";

function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  return url;
}

function getSupabaseAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY");
  return key;
}

function getServiceKey(): string {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
  return key;
}

let client: ReturnType<typeof createClient> | null = null;
let serviceClient: ReturnType<typeof createClient> | null = null;

export function getSupabase() {
  if (!client) {
    client = createClient(getSupabaseUrl(), getSupabaseAnonKey());
  }
  return client;
}

export function getServiceSupabase() {
  if (!serviceClient) {
    serviceClient = createClient(getSupabaseUrl(), getServiceKey());
  }
  return serviceClient;
}
