-- ============================================================
-- v3 migration: admin_users, pledges, honored_member on donations
-- ============================================================

-- Admin users for the secure dashboard
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'superadmin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_login_at TIMESTAMPTZ
);

-- Pledges (promise to pay, settled manually by admin)
CREATE TABLE IF NOT EXISTS pledges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id),
  donor_name TEXT NOT NULL DEFAULT 'Anonymous',
  amount NUMERIC(12, 2) NOT NULL,
  phone_masked TEXT,
  email TEXT,
  message TEXT,
  honored_member_id UUID REFERENCES committee_members(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'partially_fulfilled', 'fulfilled', 'cancelled')),
  fulfilled_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  fulfilled_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_pledges_campaign ON pledges (campaign_id);
CREATE INDEX IF NOT EXISTS idx_pledges_status ON pledges (status);
CREATE INDEX IF NOT EXISTS idx_pledges_honored_member ON pledges (honored_member_id);

-- Add honored_member_id to donations
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='donations' AND column_name='honored_member_id'
  ) THEN
    ALTER TABLE donations ADD COLUMN honored_member_id UUID REFERENCES committee_members(id);
  END IF;
END $$;
CREATE INDEX IF NOT EXISTS idx_donations_honored_member ON donations (honored_member_id);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pledges ENABLE ROW LEVEL SECURITY;

-- Public can insert pledges
CREATE POLICY pledges_insert ON pledges FOR INSERT WITH CHECK (true);
-- Only service-role can read/update pledges
CREATE POLICY pledges_admin ON pledges FOR ALL USING (false);

-- No public access to admin_users
CREATE POLICY admin_users_no_access ON admin_users FOR ALL USING (false);
