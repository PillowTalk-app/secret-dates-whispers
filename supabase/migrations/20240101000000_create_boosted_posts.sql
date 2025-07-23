-- Create boosted_posts table to track paid post boosts
CREATE TABLE public.boosted_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_session_id TEXT UNIQUE,
  amount INTEGER NOT NULL DEFAULT 299, -- $2.99 in cents
  currency TEXT DEFAULT 'usd',
  boost_start TIMESTAMPTZ NOT NULL DEFAULT now(),
  boost_end TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '48 hours'),
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'expired', 'cancelled'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row-Level Security
ALTER TABLE public.boosted_posts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "select_own_boosted_posts" ON public.boosted_posts
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "insert_boosted_posts" ON public.boosted_posts
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "update_boosted_posts" ON public.boosted_posts
  FOR UPDATE
  USING (true);

-- Create index for efficient queries
CREATE INDEX idx_boosted_posts_post_id ON public.boosted_posts(post_id);
CREATE INDEX idx_boosted_posts_boost_end ON public.boosted_posts(boost_end);
CREATE INDEX idx_boosted_posts_status ON public.boosted_posts(status);

-- Create function to automatically expire boosts
CREATE OR REPLACE FUNCTION expire_old_boosts()
RETURNS void AS $$
BEGIN
  UPDATE public.boosted_posts 
  SET status = 'expired', updated_at = now()
  WHERE boost_end < now() AND status = 'active';
END;
$$ LANGUAGE plpgsql;