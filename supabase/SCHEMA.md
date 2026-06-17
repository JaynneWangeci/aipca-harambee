# AIPCA Harambee — Database Schema

## Overview
PostgreSQL database managed via Supabase. All tables live in the `public` schema.
Env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.

## Tables

### `campaigns`
Fundraising campaigns. The primary campaign is "Development Fund".

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK, auto-generated |
| title | TEXT | e.g. "Development Fund" |
| slug | TEXT | UNIQUE, url-friendly (e.g. "development-fund") |
| goal_amount | NUMERIC(12,2) | Target amount in KES |
| raised_amount | NUMERIC(12,2) | Currently raised, updated via `increment_campaign_raised()` |
| created_at | TIMESTAMPTZ | |

**Seed:** Development Fund, goal 5,000,000, raised 842,500

### `donations`
Every completed and pending donation via M-Pesa or Equity.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| campaign_id | UUID | FK → campaigns.id |
| donor_name | TEXT | Default "Anonymous" |
| amount | NUMERIC(12,2) | |
| method | TEXT | 'mpesa' or 'bank' |
| phone_masked | TEXT | Masked as 07XX***XXX |
| status | TEXT | 'pending', 'completed', 'failed' |
| mpesa_receipt | TEXT | M-Pesa transaction ID |
| checkout_request_id | TEXT | UNIQUE, Daraja/Jenga session ID (idempotency key) |
| message | TEXT | Optional donor message |
| result_desc | TEXT | Raw result from payment provider |
| receipt_number | TEXT | Generated on completion: AIPCA-YYMMDD-XXXX |
| is_anonymous | BOOLEAN | Default false |
| completed_at | TIMESTAMPTZ | Set on completion |
| provider_ref | TEXT | Provider reference code |
| honored_member_id | UUID | FK → committee_members.id (give in honor of) |
| created_at | TIMESTAMPTZ | |

**Indexes:** checkout_request_id, campaign_id, status, honored_member_id
**RLS:** Public can SELECT where status = 'completed'

### `committee_members`
Board of officials displayed on the leadership page.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| name | TEXT | Full name |
| role | TEXT | e.g. "Treasurer" |
| group_name | TEXT | 'Executive', 'Women\'s Council', 'Men\'s Council', 'Development Committee' |
| display_order | INT | Sort order |
| photo_url | TEXT | Null (initials-avatar fallback) |
| is_active | BOOLEAN | Default true |
| created_at | TIMESTAMPTZ | |

**RLS:** Public SELECT where is_active = true
**Seeded:** 14 officials (Dadson Mbogo, Jeremiah Kimani, et al.)

### `payment_queue`
Transactional outbox for rate-limiting STK push requests.

| Column | Type | Notes |
|--------|------|-------|
| id | BIGSERIAL | PK |
| created_at | TIMESTAMPTZ | |
| processed_at | TIMESTAMPTZ | |
| status | TEXT | 'queued', 'processing', 'done', 'failed' |
| payload | JSONB | Request payload |
| phone_normalized | TEXT | Normalized phone for rate-limiting |
| attempt | INT | Retry counter |
| error | TEXT | Error message |

### `pledges`
Promise-to-pay, settled manually by admin.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| campaign_id | UUID | FK → campaigns.id |
| donor_name | TEXT | Default "Anonymous" |
| amount | NUMERIC(12,2) | Pledged amount |
| phone_masked | TEXT | Masked |
| email | TEXT | Optional |
| message | TEXT | Optional |
| honored_member_id | UUID | FK → committee_members.id |
| status | TEXT | 'pending', 'partially_fulfilled', 'fulfilled', 'cancelled' |
| fulfilled_amount | NUMERIC(12,2) | How much of the pledge has been paid |
| notes | TEXT | Admin notes |
| created_at | TIMESTAMPTZ | |
| fulfilled_at | TIMESTAMPTZ | |

**Indexes:** campaign_id, status, honored_member_id

### `donation_phone_lookup`
Encrypted phone numbers for reconciliation (service-role only).

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| donation_id | UUID | FK → donations.id |
| phone_encrypted | TEXT | Base64-encoded phone |
| created_at | TIMESTAMPTZ | |

### `campaign_ledger_exports`
Tracks generated CSV exports.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| campaign_id | UUID | FK → campaigns.id |
| generated_at | TIMESTAMPTZ | |
| file_url | TEXT | Link to exported file (future) |

### `admin_users`
Authenticated admin dashboard users.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| email | TEXT | UNIQUE |
| password_hash | TEXT | bcrypt hash |
| name | TEXT | |
| role | TEXT | 'admin' or 'superadmin' |
| created_at | TIMESTAMPTZ | |
| last_login_at | TIMESTAMPTZ | |

**RLS:** No public access (service-role only)

## Functions

### `increment_campaign_raised(campaign_id UUID, inc_amount NUMERIC)`
Atomically increments the `raised_amount` on a campaign. Used by callbacks after successful payment confirmation. SECURITY DEFINER.

## Realtime
The `donations` table is subscribed to `supabase_realtime` for live donor wall updates on the fund page.

## Migrations
- `supabase/migration.sql` — v1: core tables (campaigns, donations, payment_queue)
- `supabase/migration-v2.sql` — v2: committee_members, donation_phone_lookup, campaign_ledger_exports, donations new columns + RLS
- `supabase/migration-v3.sql` — v3: admin_users, pledges, honored_member_id on donations + RLS

Apply in order via Supabase SQL editor.
