import { getServiceSupabase } from "./supabase";

interface QueueItem {
  amount: number;
  phone: string;
  donor_name?: string;
  message?: string;
}

function normalizePhone(phone: string): string {
  return phone.replace(/^0+/, "254").replace(/^\+/, "");
}

export async function enqueueStkPush(item: QueueItem): Promise<number> {
  const supabase = getServiceSupabase();
  const result = await supabase
    .from("payment_queue")
    .insert({
      payload: item,
      phone_normalized: normalizePhone(item.phone),
    } as never)
    .select("id")
    .single()
    .then((r) => r.data as { id: number } | null);

  if (!result) throw new Error("Failed to enqueue payment");
  return result.id;
}

export async function dequeueBatch(limit = 10) {
  const supabase = getServiceSupabase();

  const items = await supabase
    .from("payment_queue")
    .update({ status: "processing" } as never)
    .eq("status", "queued")
    .order("created_at", { ascending: true })
    .limit(limit)
    .select()
    .then((r) => r.data as unknown as QueueItem[] | null);

  return items || [];
}

export async function markDone(id: number) {
  const supabase = getServiceSupabase();
  await supabase
    .from("payment_queue")
    .update({ status: "done", processed_at: new Date().toISOString() } as never)
    .eq("id", id);
}

export async function markFailed(id: number, error: string) {
  const supabase = getServiceSupabase();
  await supabase
    .from("payment_queue")
    .update({
      status: "failed",
      error,
      processed_at: new Date().toISOString(),
    } as never)
    .eq("id", id);
}
