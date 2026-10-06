/* ============================================================
   YAS Help Desk — Ratings API
   Public endpoint for customer feedback submissions
   ============================================================ */

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('[Ratings API] Missing Supabase credentials');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const path = req.url?.split('?')[0] || '';

    // POST /api/ratings - Create new rating
    if (path === '' && req.method === 'POST') {
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
    }

    // GET /api/ratings - Get all ratings (authenticated only)
    else if (path === '' && req.method === 'GET') {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const token = authHeader.substring(7);

      // Simple token validation (in production, use proper JWT verification)
      if (!token || token.length < 10) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      console.log('[Ratings API] GET request - fetching all ratings');

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

    // GET /api/ratings/stats - Get rating statistics
    else if (path === '/stats' && req.method === 'GET') {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const token = authHeader.substring(7);

      if (!token || token.length < 10) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      console.log('[Ratings API] GET stats request');

      const { data: ratings, error } = await supabase
        .from('ratings')
        .select('rating');

      if (error) {
        console.error('[Ratings API] Stats error:', error);
        return res.status(500).json({ error: 'Failed to fetch stats', details: error.message });
      }

      // Calculate statistics
      const total = ratings?.length || 0;
      const sum = ratings?.reduce((acc, r) => acc + r.rating, 0) || 0;
      const average = total > 0 ? (sum / total).toFixed(2) : 0;

      const distribution = {
        5: ratings?.filter(r => r.rating === 5).length || 0,
        4: ratings?.filter(r => r.rating === 4).length || 0,
        3: ratings?.filter(r => r.rating === 3).length || 0,
        2: ratings?.filter(r => r.rating === 2).length || 0,
        1: ratings?.filter(r => r.rating === 1).length || 0
      };

      const stats = {
        total,
        average: parseFloat(average),
        distribution,
        satisfaction_rate: total > 0 ? ((distribution[4] + distribution[5]) / total * 100).toFixed(1) : 0
      };

      console.log('[Ratings API] Stats calculated:', stats);

      res.status(200).json({
        success: true,
        data: stats
      });
    }

    else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('[Ratings API] Error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
