// Ratings endpoint (no auth required) - Public feedback submission
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://dqepsuecouvnvozcnjth.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxZXBzdWVjb3V2bnZvemNuanRoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTgxODY3NCwiZXhwIjoyMTA1Mzk0Njc0fQ.yn1zGz8RIbyPKTkjw8YwTZr5cnTvyvd4Tp5COv046HE';

let supabase;
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
}

module.exports = async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (!supabase) {
    console.error('[Ratings API] Supabase not configured');
    return res.status(500).json({ error: 'Database not configured' });
  }

  try {
    console.log('[Ratings API] Request:', { method: req.method, url: req.url });

    // POST /api/ratings - Create new rating
    if (req.method === 'POST') {
      console.log('[Ratings API] POST request received');

      const { ticket_id, ticket_number, customer_name, rating, comment } = req.body || {};

      // Validate required fields
      if (!ticket_number || !customer_name || !rating) {
        console.error('[Ratings API] Missing required fields:', { ticket_number, customer_name, rating });
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Validate rating range
      if (rating < 1 || rating > 5) {
        console.error('[Ratings API] Invalid rating:', rating);
        return res.status(400).json({ error: 'Rating must be between 1 and 5' });
      }

      console.log('[Ratings API] Creating rating:', {
        ticket_number,
        customer_name,
        rating,
        has_comment: !!comment
      });

      // Check if rating already exists for this ticket
      const { data: existingRating, error: checkError } = await supabase
        .from('ratings')
        .select('*')
        .eq('ticket_number', ticket_number)
        .single();

      if (existingRating) {
        console.log('[Ratings API] Rating already exists for ticket:', ticket_number);
        return res.status(400).json({ error: 'Rating already submitted for this ticket' });
      }

      // Insert rating
      const { data: ratingData, error: ratingError } = await supabase
        .from('ratings')
        .insert({
          ticket_id: ticket_id || null,
          ticket_number: ticket_number,
          customer_name: customer_name,
          rating: rating,
          comment: comment || null
        })
        .select()
        .single();

      if (ratingError) {
        console.error('[Ratings API] Insert error:', ratingError);
        return res.status(500).json({ error: 'Failed to save rating', details: ratingError.message });
      }

      console.log('[Ratings API] Rating saved successfully:', ratingData.id);

      res.status(201).json({
        success: true,
        message: 'Rating saved successfully',
        data: ratingData
      });
    } else if (req.method === 'GET') {
      // GET /api/ratings?ticket_number=XXX - Get rating for a specific ticket
      // GET /api/ratings - Get all ratings (authenticated)
      const { ticket_number } = req.query;

      if (ticket_number) {
        console.log('[Ratings API] Fetching rating for ticket:', ticket_number);

        const { data: rating, error } = await supabase
          .from('ratings')
          .select('*')
          .eq('ticket_number', ticket_number)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('[Ratings API] Fetch error:', error);
          return res.status(500).json({ error: 'Failed to fetch rating', details: error.message });
        }

        res.status(200).json({
          success: true,
          data: rating || null
        });
      } else {
        // Get all ratings (requires auth)
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return res.status(401).json({ error: 'Unauthorized' });
        }

        const token = authHeader.substring(7);

        if (!token || token.length < 10) {
          return res.status(401).json({ error: 'Invalid token' });
        }

        console.log('[Ratings API] Fetching all ratings');

        const { data: ratings, error } = await supabase
          .from('ratings')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100);

        if (error) {
          console.error('[Ratings API] Fetch error:', error);
          return res.status(500).json({ error: 'Failed to fetch ratings', details: error.message });
        }

        console.log('[Ratings API] Fetched ratings count:', ratings?.length || 0);

        res.status(200).json({
          success: true,
          data: ratings || []
        });
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('[Ratings API] Error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
