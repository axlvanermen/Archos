-- Archos initial schema: companies, users, clients, subcontractors,
-- projects, quotes, contracts, invoices, tasks, site diary entries.
-- Mirrors src/types/index.ts.

create extension if not exists "pgcrypto";

-- ─── Enums ──────────────────────────────────────────────────────────────────

create type company_type as enum (
  'aannemer', 'onderaannemer', 'architect', 'ingenieur',
  'leverancier', 'opdrachtgever', 'overheid', 'andere'
);

create type subscription_plan as enum ('free', 'starter', 'professional', 'enterprise');

create type user_role as enum (
  'owner', 'admin', 'project_manager', 'foreman', 'worker', 'accountant'
);

create type project_status as enum (
  'prospectie', 'offerte', 'in_afwachting', 'goedgekeurd',
  'in_uitvoering', 'oplevering', 'voltooid', 'gefactureerd', 'geannuleerd'
);

create type quote_status as enum ('draft', 'sent', 'accepted', 'rejected', 'expired');

create type contract_status as enum (
  'draft', 'sent', 'signed', 'active', 'completed', 'cancelled'
);

create type invoice_status as enum (
  'draft', 'sent', 'paid', 'overdue', 'cancelled', 'credit_note'
);

create type task_status as enum ('todo', 'in_progress', 'review', 'done', 'cancelled');
create type task_priority as enum ('low', 'medium', 'high', 'urgent');

create type weather_type as enum ('sunny', 'cloudy', 'rainy', 'windy', 'snowy', 'foggy');

-- ─── updated_at trigger helper ─────────────────────────────────────────────

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ─── companies ──────────────────────────────────────────────────────────────

create table companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  vat_number text,
  type company_type not null default 'aannemer',
  address text,
  city text,
  postal_code text,
  country text not null default 'BE',
  phone text,
  email text,
  website text,
  logo_url text,
  primary_color text,
  secondary_color text,
  accent_color text,
  subscription_plan subscription_plan not null default 'free',
  subscription_expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger companies_set_updated_at before update on companies
  for each row execute function set_updated_at();

-- ─── users (app profile, separate from auth.users) ─────────────────────────
-- Note: id is NOT a foreign key to auth.users because pending team invites
-- (see StepMedewerkers) are inserted before the invitee has an auth account.

create table users (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  email text not null,
  full_name text not null,
  role user_role not null default 'worker',
  avatar_url text,
  phone text,
  language text not null default 'nl' check (language in ('nl', 'fr', 'en')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id, email)
);

create index users_company_id_idx on users(company_id);

create trigger users_set_updated_at before update on users
  for each row execute function set_updated_at();

-- Helper to read the caller's company_id without recursive RLS evaluation.
create or replace function current_company_id()
returns uuid
language sql
security definer
set search_path = public
stable
as $$
  select company_id from users where id = auth.uid() limit 1;
$$;

-- Helper to read the caller's role, used for admin-only actions.
create or replace function current_user_role()
returns user_role
language sql
security definer
set search_path = public
stable
as $$
  select role from users where id = auth.uid() limit 1;
$$;

-- ─── clients ────────────────────────────────────────────────────────────────

create table clients (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  name text not null,
  vat_number text,
  contact_person text,
  email text,
  phone text,
  address text,
  city text,
  postal_code text,
  country text not null default 'BE',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index clients_company_id_idx on clients(company_id);

create trigger clients_set_updated_at before update on clients
  for each row execute function set_updated_at();

-- ─── subcontractors ─────────────────────────────────────────────────────────
-- vca/rsz/insurance expiry columns are included now so the upcoming
-- compliance-warning UI (module 2) has a place to read from.

create table subcontractors (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  name text not null,
  vat_number text,
  specialty text,
  contact_person text,
  email text,
  phone text,
  address text,
  city text,
  postal_code text,
  country text not null default 'BE',
  hourly_rate numeric(10, 2),
  rating numeric(2, 1) check (rating >= 0 and rating <= 5),
  vca_expiry_date date,
  rsz_attestation_expiry_date date,
  insurance_expiry_date date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index subcontractors_company_id_idx on subcontractors(company_id);

create trigger subcontractors_set_updated_at before update on subcontractors
  for each row execute function set_updated_at();

-- ─── projects ───────────────────────────────────────────────────────────────

create table projects (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  client_id uuid references clients(id) on delete set null,
  name text not null,
  reference text,
  description text,
  status project_status not null default 'prospectie',
  address text,
  city text,
  postal_code text,
  start_date date,
  end_date date,
  budget numeric(12, 2),
  total_quoted numeric(12, 2),
  total_invoiced numeric(12, 2),
  total_paid numeric(12, 2),
  manager_id uuid references users(id) on delete set null,
  thumbnail_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index projects_company_id_idx on projects(company_id);
create index projects_client_id_idx on projects(client_id);
create index projects_status_idx on projects(status);

create trigger projects_set_updated_at before update on projects
  for each row execute function set_updated_at();

-- ─── quotes ─────────────────────────────────────────────────────────────────

create table quotes (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  project_id uuid references projects(id) on delete set null,
  client_id uuid references clients(id) on delete set null,
  reference text not null,
  title text not null,
  description text,
  status quote_status not null default 'draft',
  issue_date date not null default current_date,
  valid_until date,
  line_items jsonb not null default '[]',
  subtotal numeric(12, 2) not null default 0,
  vat_total numeric(12, 2) not null default 0,
  total numeric(12, 2) not null default 0,
  notes text,
  terms text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id, reference)
);

create index quotes_company_id_idx on quotes(company_id);
create index quotes_project_id_idx on quotes(project_id);

create trigger quotes_set_updated_at before update on quotes
  for each row execute function set_updated_at();

-- ─── contracts ──────────────────────────────────────────────────────────────

create table contracts (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  project_id uuid not null references projects(id) on delete cascade,
  client_id uuid references clients(id) on delete set null,
  quote_id uuid references quotes(id) on delete set null,
  reference text not null,
  title text not null,
  description text,
  status contract_status not null default 'draft',
  sign_date date,
  start_date date,
  end_date date,
  contract_value numeric(12, 2) not null default 0,
  payment_terms text,
  notes text,
  document_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id, reference)
);

create index contracts_company_id_idx on contracts(company_id);
create index contracts_project_id_idx on contracts(project_id);

create trigger contracts_set_updated_at before update on contracts
  for each row execute function set_updated_at();

-- ─── invoices ───────────────────────────────────────────────────────────────

create table invoices (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  project_id uuid references projects(id) on delete set null,
  client_id uuid references clients(id) on delete set null,
  contract_id uuid references contracts(id) on delete set null,
  reference text not null,
  title text not null,
  status invoice_status not null default 'draft',
  issue_date date not null default current_date,
  due_date date,
  payment_date date,
  line_items jsonb not null default '[]',
  subtotal numeric(12, 2) not null default 0,
  vat_total numeric(12, 2) not null default 0,
  total numeric(12, 2) not null default 0,
  amount_paid numeric(12, 2) not null default 0,
  notes text,
  payment_terms text,
  bank_account text,
  structured_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id, reference)
);

create index invoices_company_id_idx on invoices(company_id);
create index invoices_project_id_idx on invoices(project_id);
create index invoices_status_idx on invoices(status);

create trigger invoices_set_updated_at before update on invoices
  for each row execute function set_updated_at();

-- ─── tasks ──────────────────────────────────────────────────────────────────

create table tasks (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  project_id uuid references projects(id) on delete cascade,
  title text not null,
  description text,
  status task_status not null default 'todo',
  priority task_priority not null default 'medium',
  assignee_id uuid references users(id) on delete set null,
  due_date date,
  completed_at timestamptz,
  estimated_hours numeric(6, 2),
  actual_hours numeric(6, 2),
  tags text[] not null default '{}',
  created_by uuid not null references users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index tasks_company_id_idx on tasks(company_id);
create index tasks_project_id_idx on tasks(project_id);
create index tasks_assignee_id_idx on tasks(assignee_id);

create trigger tasks_set_updated_at before update on tasks
  for each row execute function set_updated_at();

-- ─── site_diary_entries ─────────────────────────────────────────────────────

create table site_diary_entries (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  project_id uuid not null references projects(id) on delete cascade,
  date date not null default current_date,
  author_id uuid not null references users(id) on delete set null,
  weather weather_type,
  temperature numeric(4, 1),
  workers_on_site integer,
  work_performed text not null,
  materials_used text,
  equipment_used text,
  visitors text,
  incidents text,
  delays text,
  notes text,
  photo_urls text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index site_diary_entries_company_id_idx on site_diary_entries(company_id);
create index site_diary_entries_project_id_idx on site_diary_entries(project_id);

create trigger site_diary_entries_set_updated_at before update on site_diary_entries
  for each row execute function set_updated_at();

-- ─── Row Level Security ─────────────────────────────────────────────────────

alter table companies enable row level security;
alter table users enable row level security;
alter table clients enable row level security;
alter table subcontractors enable row level security;
alter table projects enable row level security;
alter table quotes enable row level security;
alter table contracts enable row level security;
alter table invoices enable row level security;
alter table tasks enable row level security;
alter table site_diary_entries enable row level security;

-- companies: any signed-in user may create the company they're onboarding
-- into; afterwards only members of that company may read/update it.
create policy companies_insert on companies
  for insert with check (auth.uid() is not null);

create policy companies_select on companies
  for select using (id = current_company_id());

create policy companies_update on companies
  for update using (id = current_company_id());

create policy companies_delete on companies
  for delete using (id = current_company_id() and current_user_role() = 'owner');

-- users: self-registration (id = auth.uid()) or invited by an existing
-- member of the same company (no auth account yet, so id is not auth.uid()).
create policy users_insert on users
  for insert with check (
    id = auth.uid() or company_id = current_company_id()
  );

create policy users_select on users
  for select using (company_id = current_company_id() or id = auth.uid());

create policy users_update on users
  for update using (id = auth.uid() or company_id = current_company_id());

create policy users_delete on users
  for delete using (
    company_id = current_company_id() and current_user_role() in ('owner', 'admin')
  );

-- Remaining tables: standard company-scoped access for any member.
create policy clients_all on clients
  for all using (company_id = current_company_id())
  with check (company_id = current_company_id());

create policy subcontractors_all on subcontractors
  for all using (company_id = current_company_id())
  with check (company_id = current_company_id());

create policy projects_all on projects
  for all using (company_id = current_company_id())
  with check (company_id = current_company_id());

create policy quotes_all on quotes
  for all using (company_id = current_company_id())
  with check (company_id = current_company_id());

create policy contracts_all on contracts
  for all using (company_id = current_company_id())
  with check (company_id = current_company_id());

create policy invoices_all on invoices
  for all using (company_id = current_company_id())
  with check (company_id = current_company_id());

create policy tasks_all on tasks
  for all using (company_id = current_company_id())
  with check (company_id = current_company_id());

create policy site_diary_entries_all on site_diary_entries
  for all using (company_id = current_company_id())
  with check (company_id = current_company_id());
