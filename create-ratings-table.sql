-- Create ratings table for customer feedback
CREATE TABLE IF NOT EXISTS ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  ticket_number VARCHAR(50) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_ratings_ticket_id ON ratings(ticket_id);
CREATE INDEX IF NOT EXISTS idx_ratings_ticket_number ON ratings(ticket_number);
CREATE INDEX IF NOT EXISTS idx_ratings_created_at ON ratings(created_at DESC);

-- Enable Row Level Security
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert ratings (for public submissions)
CREATE POLICY "Anyone can insert ratings" ON ratings
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow authenticated users to read all ratings
CREATE POLICY "Authenticated users can read ratings" ON ratings
  FOR SELECT
  TO authenticated
  USING (true);

-- Add comments
COMMENT ON TABLE ratings IS 'Customer satisfaction ratings for support tickets';
COMMENT ON COLUMN ratings.rating IS 'Rating from 1 to 5 stars';
COMMENT ON COLUMN ratings.comment IS 'Optional customer feedback comment';
