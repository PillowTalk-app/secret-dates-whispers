-- Create memory matches system
CREATE TABLE memory_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_a_id UUID NOT NULL,
  post_b_id UUID NOT NULL,
  confidence_score DECIMAL(3,2) NOT NULL DEFAULT 0.0,
  match_type TEXT NOT NULL CHECK (match_type IN ('face_match', 'name_match', 'hybrid')),
  detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'both_opted_in', 'declined', 'expired')),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
  shared_person_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table to track user opt-ins for memory matches
CREATE TABLE memory_match_opt_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES memory_matches(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  post_id UUID NOT NULL,
  opted_in BOOLEAN NOT NULL DEFAULT FALSE,
  opted_in_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table to track comparison sessions when both users opt in
CREATE TABLE memory_comparisons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES memory_matches(id) ON DELETE CASCADE,
  user_a_id UUID NOT NULL,
  user_b_id UUID NOT NULL,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_a_reaction TEXT CHECK (user_a_reaction IN ('helpful', 'eye_opening', 'concerning', null)),
  user_b_reaction TEXT CHECK (user_b_reaction IN ('helpful', 'eye_opening', 'concerning', null)),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_memory_matches_posts ON memory_matches(post_a_id, post_b_id);
CREATE INDEX idx_memory_matches_status ON memory_matches(status);
CREATE INDEX idx_memory_matches_expires ON memory_matches(expires_at);
CREATE INDEX idx_memory_match_opt_ins_user ON memory_match_opt_ins(user_id);
CREATE INDEX idx_memory_match_opt_ins_match ON memory_match_opt_ins(match_id);

-- Enable RLS
ALTER TABLE memory_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_match_opt_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_comparisons ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own memory matches" ON memory_matches
  FOR SELECT USING (
    post_a_id IN (SELECT id FROM posts WHERE user_id = auth.uid()) OR
    post_b_id IN (SELECT id FROM posts WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can view their own opt-ins" ON memory_match_opt_ins
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can view their own comparisons" ON memory_comparisons
  FOR ALL USING (user_a_id = auth.uid() OR user_b_id = auth.uid());