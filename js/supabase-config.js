// ============================================================
// YAS Help Desk - Supabase Direct Configuration
// ============================================================

'use strict';

const SUPABASE_CONFIG = {
  url: 'https://dqepsuecouvnvozcnjth.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxZXBzdWVjb3V2bnZvemNuanRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4MTg2NzQsImV4cCI6MjEwNTM5NDY3NH0.wwP_8ITnKaks3y1ZT0Yde_4tW_71VlhVEqne2-pYovE'
};

// Initialize Supabase client
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  SUPABASE_CONFIG.url,
  SUPABASE_CONFIG.anonKey
);

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { supabase, SUPABASE_CONFIG };
} else {
  window.SUPABASE_CONFIG = SUPABASE_CONFIG;
  window.supabase = supabase;
}