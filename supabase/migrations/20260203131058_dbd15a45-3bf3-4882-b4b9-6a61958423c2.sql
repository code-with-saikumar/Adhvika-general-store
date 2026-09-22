-- Add is_approved column to reviews table for admin moderation
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS is_approved boolean NOT NULL DEFAULT false;

-- Enable realtime for reviews table
ALTER PUBLICATION supabase_realtime ADD TABLE public.reviews;