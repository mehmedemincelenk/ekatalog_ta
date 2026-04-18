import { supabase } from '../../lib/supabase';

/**
 * verifyStorePin: Securely validates a PIN using a server-side RPC function.
 * This approach ensures that:
 * 1. The 'admin_pin' column is NEVER exposed to the public API.
 * 2. Verification logic (including rate limiting) happens inside the database.
 * 3. The client only receives a boolean result.
 */
export async function verifyStorePin(slug: string, pin: string): Promise<boolean> {
  if (!slug || !pin) return false;

  try {
    // Calling a Postgres function (RPC) instead of querying the table directly
    const { data, error } = await supabase.rpc('check_store_pin', {
      input_slug: slug,
      input_pin: pin
    });

    if (error) {
      console.error('Auth RPC Error:', error.message);
      return false;
    }

    return !!data; // Returns true if function found a match
  } catch (err) {
    console.error('PIN verification failed:', err);
    return false;
  }
}
