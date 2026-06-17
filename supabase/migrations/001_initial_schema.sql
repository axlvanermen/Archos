-- Archos – initial database schema
-- Run via: Supabase SQL editor (postgres role) or `supabase db reset`

-- ─── Extensions ──────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── updated_at trigger ──────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ─── Helper: current user's company_id ───────────────────────────────────────
CREATE OR REPLACE FUNCTION get_company_id()
RETURNS UUID LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT company_id FROM users WHERE id = auth.uid()
$$;

-- ─── companies ───────────────────────────────────────────────────────────────
CREATE TABLE companies (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                    TEXT NOT NULL,
  vat_number              TEXT,
  type                    TEXT NOT NULL DEFAULT 'aannemer',
  address                 TEXT,
  city                    TEXT,
  postal_code             TEXT,
  country                 TEXT NOT NULL DEFAULT 'BE',
  phone                   TEXT,
  email                   TEXT,
  website                 TEXT,
  logo_url                TEXT,
  primary_color           TEXT NOT NULL DEFAULT '#0F172A',
  secondary_color         TEXT NOT NULL DEFAULT '#334155',
  accent_color            TEXT NOT NULL DEFAULT '#C4943A',
  subscription_plan       TEXT NOT NULL DEFAULT 'free',
  subscription_expires_at TIMESTAMPTZ,
  onboarding_completed    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER companies_updated_at BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- ─── users (public profile extending auth.users) ─────────────────────────────
CREATE TABLE users (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  email      TEXT NOT NULL,
  full_name  TEXT NOT NULL DEFAULT '',
  role       TEXT NOT NULL DEFAULT 'worker',
  avatar_url TEXT,
  phone      TEXT,
  language   TEXT NOT NULL DEFAULT 'nl',
  is_active  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX users_company_id_idx ON users(company_id);

CREATE TRIGGER users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Auto-create public.users row on auth signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ─── clients ─────────────────────────────────────────────────────────────────
CREATE TABLE clients (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id     UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name           TEXT NOT NULL,
  vat_number     TEXT,
  contact_person TEXT,
  email          TEXT,
  phone          TEXT,
  address        TEXT,
  city           TEXT,
  postal_code    TEXT,
  country        TEXT NOT NULL DEFAULT 'BE',
  notes          TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX clients_company_id_idx ON clients(company_id);

CREATE TRIGGER clients_updated_at BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- ─── subcontractors ──────────────────────────────────────────────────────────
CREATE TABLE subcontractors (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id                  UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name                        TEXT NOT NULL,
  vat_number                  TEXT,
  specialty                   TEXT,
  contact_person              TEXT,
  email                       TEXT,
  phone                       TEXT,
  address                     TEXT,
  city                        TEXT,
  postal_code                 TEXT,
  country                     TEXT NOT NULL DEFAULT 'BE',
  hourly_rate                 NUMERIC(10,2),
  rating                      INTEGER CHECK (rating BETWEEN 1 AND 5),
  vca_expiry_date             DATE,
  rsz_attestation_expiry_date DATE,
  insurance_expiry_date       DATE,
  notes                       TEXT,
  created_at                  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at                  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX subcontractors_company_id_idx ON subcontractors(company_id);

CREATE TRIGGER subcontractors_updated_at BEFORE UPDATE ON subcontractors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE subcontractors ENABLE ROW LEVEL SECURITY;

-- ─── projects ────────────────────────────────────────────────────────────────
CREATE TABLE projects (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id     UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  client_id      UUID REFERENCES clients(id) ON DELETE SET NULL,
  name           TEXT NOT NULL,
  reference      TEXT,
  description    TEXT,
  status         TEXT NOT NULL DEFAULT 'aanvraag',
  address        TEXT,
  city           TEXT,
  postal_code    TEXT,
  start_date     DATE,
  end_date       DATE,
  budget         NUMERIC(12,2),
  total_quoted   NUMERIC(12,2),
  total_invoiced NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_paid     NUMERIC(12,2) NOT NULL DEFAULT 0,
  manager_id     UUID REFERENCES users(id) ON DELETE SET NULL,
  thumbnail_url  TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX projects_company_id_idx ON projects(company_id);
CREATE INDEX projects_client_id_idx  ON projects(client_id);
CREATE INDEX projects_status_idx     ON projects(status);

CREATE TRIGGER projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- ─── project_phases ──────────────────────────────────────────────────────────
CREATE TABLE project_phases (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date   DATE NOT NULL,
  status     TEXT NOT NULL DEFAULT 'gepland',
  progress   INTEGER NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX project_phases_project_id_idx ON project_phases(project_id);
CREATE INDEX project_phases_company_id_idx ON project_phases(company_id);

CREATE TRIGGER project_phases_updated_at BEFORE UPDATE ON project_phases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE project_phases ENABLE ROW LEVEL SECURITY;

-- ─── tasks ───────────────────────────────────────────────────────────────────
CREATE TABLE tasks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id      UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  project_id      UUID REFERENCES projects(id) ON DELETE SET NULL,
  title           TEXT NOT NULL,
  description     TEXT,
  status          TEXT NOT NULL DEFAULT 'todo',
  priority        TEXT NOT NULL DEFAULT 'medium',
  assignee_id     UUID REFERENCES users(id) ON DELETE SET NULL,
  due_date        DATE,
  completed_at    DATE,
  estimated_hours NUMERIC(6,2),
  actual_hours    NUMERIC(6,2),
  tags            TEXT[] NOT NULL DEFAULT '{}',
  created_by      UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX tasks_company_id_idx  ON tasks(company_id);
CREATE INDEX tasks_project_id_idx  ON tasks(project_id);
CREATE INDEX tasks_assignee_id_idx ON tasks(assignee_id);
CREATE INDEX tasks_status_idx      ON tasks(status);

CREATE TRIGGER tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- ─── quotes ──────────────────────────────────────────────────────────────────
CREATE TABLE quotes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id  UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  project_id  UUID REFERENCES projects(id) ON DELETE SET NULL,
  client_id   UUID REFERENCES clients(id) ON DELETE SET NULL,
  reference   TEXT NOT NULL,
  title       TEXT NOT NULL,
  description TEXT,
  status      TEXT NOT NULL DEFAULT 'draft',
  issue_date  DATE NOT NULL DEFAULT CURRENT_DATE,
  valid_until DATE,
  line_items  JSONB NOT NULL DEFAULT '[]',
  subtotal    NUMERIC(12,2) NOT NULL DEFAULT 0,
  vat_total   NUMERIC(12,2) NOT NULL DEFAULT 0,
  total       NUMERIC(12,2) NOT NULL DEFAULT 0,
  notes       TEXT,
  terms       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX quotes_company_id_idx ON quotes(company_id);
CREATE INDEX quotes_project_id_idx ON quotes(project_id);

CREATE TRIGGER quotes_updated_at BEFORE UPDATE ON quotes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- ─── contracts ───────────────────────────────────────────────────────────────
CREATE TABLE contracts (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id     UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  project_id     UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  client_id      UUID REFERENCES clients(id) ON DELETE SET NULL,
  quote_id       UUID REFERENCES quotes(id) ON DELETE SET NULL,
  reference      TEXT NOT NULL,
  title          TEXT NOT NULL,
  description    TEXT,
  status         TEXT NOT NULL DEFAULT 'draft',
  sign_date      DATE,
  start_date     DATE,
  end_date       DATE,
  contract_value NUMERIC(12,2) NOT NULL,
  payment_terms  TEXT,
  notes          TEXT,
  clauses        JSONB NOT NULL DEFAULT '[]',
  document_url   TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX contracts_company_id_idx ON contracts(company_id);
CREATE INDEX contracts_project_id_idx ON contracts(project_id);

CREATE TRIGGER contracts_updated_at BEFORE UPDATE ON contracts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

-- ─── invoices ────────────────────────────────────────────────────────────────
CREATE TABLE invoices (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id           UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  project_id           UUID REFERENCES projects(id) ON DELETE SET NULL,
  client_id            UUID REFERENCES clients(id) ON DELETE SET NULL,
  contract_id          UUID REFERENCES contracts(id) ON DELETE SET NULL,
  reference            TEXT NOT NULL,
  title                TEXT NOT NULL,
  status               TEXT NOT NULL DEFAULT 'draft',
  issue_date           DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date             DATE,
  payment_date         DATE,
  line_items           JSONB NOT NULL DEFAULT '[]',
  subtotal             NUMERIC(12,2) NOT NULL DEFAULT 0,
  vat_total            NUMERIC(12,2) NOT NULL DEFAULT 0,
  total                NUMERIC(12,2) NOT NULL DEFAULT 0,
  amount_paid          NUMERIC(12,2) NOT NULL DEFAULT 0,
  notes                TEXT,
  payment_terms        TEXT,
  bank_account         TEXT,
  structured_reference TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX invoices_company_id_idx ON invoices(company_id);
CREATE INDEX invoices_project_id_idx ON invoices(project_id);
CREATE INDEX invoices_status_idx     ON invoices(status);
CREATE INDEX invoices_due_date_idx   ON invoices(due_date);

CREATE TRIGGER invoices_updated_at BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- ─── site_diary_entries ──────────────────────────────────────────────────────
CREATE TABLE site_diary_entries (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id      UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  project_id      UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  date            DATE NOT NULL,
  author_id       UUID REFERENCES users(id) ON DELETE SET NULL,
  weather         TEXT,
  temperature     NUMERIC(4,1),
  workers_on_site INTEGER,
  work_performed  TEXT NOT NULL,
  materials_used  TEXT,
  equipment_used  TEXT,
  visitors        TEXT,
  incidents       TEXT,
  delays          TEXT,
  notes           TEXT,
  photo_urls      TEXT[] NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX site_diary_entries_project_id_idx ON site_diary_entries(project_id);
CREATE INDEX site_diary_entries_company_id_idx ON site_diary_entries(company_id);
CREATE INDEX site_diary_entries_date_idx       ON site_diary_entries(date);

CREATE TRIGGER site_diary_entries_updated_at BEFORE UPDATE ON site_diary_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE site_diary_entries ENABLE ROW LEVEL SECURITY;
