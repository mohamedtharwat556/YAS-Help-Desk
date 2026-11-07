// Real-time Updates using Supabase Realtime
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// Subscribe to ticket updates
export function subscribeToTicketUpdates(ticketId, callback) {
  const channel = supabase
    .channel(`ticket:${ticketId}`)
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'tickets', filter: `id=eq.${ticketId}` }, (payload) => {
      callback(payload.new);
    })
    .subscribe();

  return channel;
}

// Subscribe to all tickets (for dashboard)
export function subscribeToAllTickets(callback) {
  const channel = supabase
    .channel('tickets')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'tickets' }, (payload) => {
      callback(payload);
    })
    .subscribe();

  return channel;
}

// Subscribe to customer updates
export function subscribeToCustomerUpdates(customerId, callback) {
  const channel = supabase
    .channel(`customer:${customerId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'customers', filter: `id=eq.${customerId}` }, (payload) => {
      callback(payload.new);
    })
    .subscribe();

  return channel;
}

// Unsubscribe from channel
export function unsubscribe(channel) {
  if (channel) {
    supabase.removeChannel(channel);
  }
}
