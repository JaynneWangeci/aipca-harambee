-- ============================================================
-- v2 migration: committee_members, phone_lookup, ledger_exports
-- ============================================================

-- Committee members (board / harambee leadership)
CREATE TABLE IF NOT EXISTS committee_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  group_name TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  photo_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Encrypted phone lookup (restricted — never in public queries)
CREATE TABLE IF NOT EXISTS donation_phone_lookup (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donation_id UUID NOT NULL REFERENCES donations(id) ON DELETE CASCADE,
  phone_encrypted TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_dphone_lookup_donation ON donation_phone_lookup (donation_id);

-- Ledger export records for treasurer reconciliation
CREATE TABLE IF NOT EXISTS campaign_ledger_exports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id),
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  file_url TEXT
);
CREATE INDEX idx_ledger_campaign ON campaign_ledger_exports (campaign_id);

-- Add columns to donations table (safe: IF NOT EXISTS for columns is done via DO)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='donations' AND column_name='receipt_number') THEN
    ALTER TABLE donations ADD COLUMN receipt_number TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='donations' AND column_name='is_anonymous') THEN
    ALTER TABLE donations ADD COLUMN is_anonymous BOOLEAN NOT NULL DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='donations' AND column_name='completed_at') THEN
    ALTER TABLE donations ADD COLUMN completed_at TIMESTAMPTZ;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='donations' AND column_name='provider_ref') THEN
    ALTER TABLE donations ADD COLUMN provider_ref TEXT;
  END IF;
END $$;

-- RLS: public can SELECT completed donations (limited fields) and committee_members
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE committee_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_ledger_exports ENABLE ROW LEVEL SECURITY;
ALTER TABLE donation_phone_lookup ENABLE ROW LEVEL SECURITY;

-- Donations: public can only see completed ones with limited fields
CREATE POLICY donations_select_completed ON donations
  FOR SELECT
  USING (status = 'completed');

-- Committee members: public read-only
CREATE POLICY committee_members_select ON committee_members
  FOR SELECT
  USING (is_active = true);

-- Ledger exports: public read-only for transparency
CREATE POLICY ledger_select ON campaign_ledger_exports
  FOR SELECT
  USING (true);

-- Phone lookup: only service-role via backend
CREATE POLICY phone_lookup_service ON donation_phone_lookup
  USING (false);

-- Seed committee members
INSERT INTO committee_members (name, role, group_name, display_order) VALUES
  ('Dadson Mbogo', 'Chairman', 'Executive', 1),
  ('Jeremiah Kimani', 'Vice Chairman', 'Executive', 2),
  ('Kariuki Nderitu', 'General Secretary', 'Executive', 3),
  ('Joseph Kamande', 'Vice General Secretary', 'Executive', 4),
  ('Johnson Kamau', 'Treasurer', 'Executive', 5),
  ('George Kibia', 'Vice Treasurer', 'Executive', 6),
  ('Magdalene Wageni', 'Chairlady', 'Women''s Council', 7),
  ('Alice Kuhunya', 'Vice Chairlady', 'Women''s Council', 8),
  ('Tiffany Kimani', 'Women Council Secretary', 'Women''s Council', 9),
  ('Esther Mbugua', 'Women Council Treasurer', 'Women''s Council', 10),
  ('Gilbert Wachira', 'Men Council Chairman', 'Men''s Council', 11),
  ('Sam Ndiang''ui', 'Development Chairman', 'Development Committee', 12),
  ('Wilson Thirikwa', 'Development Secretary', 'Development Committee', 13),
  ('Maria Goretti Njenga', 'Development Treasurer', 'Development Committee', 14)
ON CONFLICT DO NOTHING;
