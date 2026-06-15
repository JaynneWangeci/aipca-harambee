-- Campaigns table
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  goal_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  raised_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Donations table
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id),
  donor_name TEXT NOT NULL DEFAULT 'Anonymous',
  amount NUMERIC(12, 2) NOT NULL,
  method TEXT NOT NULL CHECK (method IN ('mpesa', 'bank')),
  phone_masked TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  mpesa_receipt TEXT,
  checkout_request_id TEXT UNIQUE,
  message TEXT,
  result_desc TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for idempotent lookups
CREATE INDEX idx_donations_checkout_request ON donations (checkout_request_id);
CREATE INDEX idx_donations_campaign ON donations (campaign_id);
CREATE INDEX idx_donations_status ON donations (status);

-- Enable Realtime on donations
ALTER PUBLICATION supabase_realtime ADD TABLE donations;

-- Function to atomically increment campaign raised_amount
CREATE OR REPLACE FUNCTION increment_campaign_raised(
  campaign_id UUID,
  inc_amount NUMERIC
) RETURNS void AS $$
BEGIN
  UPDATE campaigns
  SET raised_amount = raised_amount + inc_amount
  WHERE id = campaign_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Seed the development fund campaign
INSERT INTO campaigns (title, slug, goal_amount, raised_amount)
VALUES ('Development Fund', 'development-fund', 5000000, 842500)
ON CONFLICT (slug) DO NOTHING;

-- Payment queue for transactional outbox / rate-limited processing
CREATE TABLE payment_queue (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  processed_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'done', 'failed')),
  payload JSONB NOT NULL,
  phone_normalized TEXT NOT NULL,
  attempt INT NOT NULL DEFAULT 0,
  error TEXT
);

CREATE INDEX idx_payment_queue_status ON payment_queue (status, created_at);
CREATE INDEX idx_payment_queue_phone ON payment_queue (phone_normalized);
