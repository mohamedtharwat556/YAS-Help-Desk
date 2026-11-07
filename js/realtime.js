// Real-time Updates using Supabase Realtime
// Using CDN instead of import to avoid build errors

// Supabase Realtime will be initialized when needed
let supabase = null;

// Initialize Supabase client from global CDN
function initSupabase() {
  if (!supabase && window.supabase) {
    supabase = window.supabase.createClient(
      window.SUPABASE_URL,
      window.SUPABASE_ANON_KEY
    );
  }
  return supabase;
}

// Subscribe to ticket updates
export function subscribeToTicketUpdates(ticketId, callback) {
  const client = initSupabase();
  if (!client) return null;

  const channel = client
    .channel(`ticket:${ticketId}`)
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'tickets', filter: `id=eq.${ticketId}` }, (payload) => {
      callback(payload.new);
    })
    .subscribe();

  return channel;
}

// Subscribe to all tickets (for dashboard)
export function subscribeToAllTickets(callback) {
  const client = initSupabase();
  if (!client) return null;

  const channel = client
    .channel('tickets')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'tickets' }, (payload) => {
      callback(payload);
    })
    .subscribe();

  return channel;
}

// Subscribe to customer updates
export function subscribeToCustomerUpdates(customerId, callback) {
  const client = initSupabase();
  if (!client) return null;

  const channel = client
    .channel(`customer:${customerId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'customers', filter: `id=eq.${customerId}` }, (payload) => {
      callback(payload.new);
    })
    .subscribe();

  return channel;
}

// Unsubscribe from channel
export function unsubscribe(channel) {
  if (channel && supabase) {
    supabase.removeChannel(channel);
  }
}
