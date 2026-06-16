// ─── Enums ───────────────────────────────────────────────────────────────────

export enum ProjectStatus {
  Prospectie = 'prospectie',
  Offerte = 'offerte',
  InAfwachting = 'in_afwachting',
  Goedgekeurd = 'goedgekeurd',
  InUitvoering = 'in_uitvoering',
  Oplevering = 'oplevering',
  Voltooid = 'voltooid',
  Gefactureerd = 'gefactureerd',
  Geannuleerd = 'geannuleerd',
}

export enum UserRole {
  Owner = 'owner',
  Admin = 'admin',
  ProjectManager = 'project_manager',
  Foreman = 'foreman',
  Worker = 'worker',
  Accountant = 'accountant',
}

export enum CompanyType {
  Aannemer = 'aannemer',
  Onderaannemer = 'onderaannemer',
  Architect = 'architect',
  Ingenieur = 'ingenieur',
  Leverancier = 'leverancier',
  Opdrachtgever = 'opdrachtgever',
  Overheid = 'overheid',
  Andere = 'andere',
}

export enum SubscriptionPlan {
  Free = 'free',
  Starter = 'starter',
  Professional = 'professional',
  Enterprise = 'enterprise',
}

// ─── Domain Types ─────────────────────────────────────────────────────────────

export interface Company {
  id: string
  name: string
  vat_number: string | null
  type: CompanyType
  address: string | null
  city: string | null
  postal_code: string | null
  country: string
  phone: string | null
  email: string | null
  website: string | null
  logo_url: string | null
  primary_color: string | null
  secondary_color: string | null
  accent_color: string | null
  subscription_plan: SubscriptionPlan
  subscription_expires_at: string | null
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  company_id: string
  email: string
  full_name: string
  role: UserRole
  avatar_url: string | null
  phone: string | null
  language: 'nl' | 'fr' | 'en'
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Client {
  id: string
  company_id: string
  name: string
  vat_number: string | null
  contact_person: string | null
  email: string | null
  phone: string | null
  address: string | null
  city: string | null
  postal_code: string | null
  country: string
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Subcontractor {
  id: string
  company_id: string
  name: string
  vat_number: string | null
  specialty: string | null
  contact_person: string | null
  email: string | null
  phone: string | null
  address: string | null
  city: string | null
  postal_code: string | null
  country: string
  hourly_rate: number | null
  rating: number | null
  vca_expiry_date: string | null
  rsz_attestation_expiry_date: string | null
  insurance_expiry_date: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  company_id: string
  client_id: string | null
  name: string
  reference: string | null
  description: string | null
  status: ProjectStatus
  address: string | null
  city: string | null
  postal_code: string | null
  start_date: string | null
  end_date: string | null
  budget: number | null
  total_quoted: number | null
  total_invoiced: number | null
  total_paid: number | null
  manager_id: string | null
  thumbnail_url: string | null
  created_at: string
  updated_at: string
  // Relations
  client?: Client
  manager?: User
}

export interface QuoteLineItem {
  id: string
  description: string
  quantity: number
  unit: string
  unit_price: number
  vat_rate: number
  total_ex_vat: number
  total_inc_vat: number
  sort_order: number
}

export interface Quote {
  id: string
  company_id: string
  project_id: string | null
  client_id: string | null
  reference: string
  title: string
  description: string | null
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'
  issue_date: string
  valid_until: string | null
  line_items: QuoteLineItem[]
  subtotal: number
  vat_total: number
  total: number
  notes: string | null
  terms: string | null
  created_at: string
  updated_at: string
  // Relations
  project?: Project
  client?: Client
}

export interface Contract {
  id: string
  company_id: string
  project_id: string
  client_id: string | null
  quote_id: string | null
  reference: string
  title: string
  description: string | null
  status: 'draft' | 'sent' | 'signed' | 'active' | 'completed' | 'cancelled'
  sign_date: string | null
  start_date: string | null
  end_date: string | null
  contract_value: number
  payment_terms: string | null
  notes: string | null
  document_url: string | null
  created_at: string
  updated_at: string
  // Relations
  project?: Project
  client?: Client
  quote?: Quote
}

export interface InvoiceLineItem {
  id: string
  description: string
  quantity: number
  unit: string
  unit_price: number
  vat_rate: number
  total_ex_vat: number
  total_inc_vat: number
  sort_order: number
}

export interface Invoice {
  id: string
  company_id: string
  project_id: string | null
  client_id: string | null
  contract_id: string | null
  reference: string
  title: string
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled' | 'credit_note'
  issue_date: string
  due_date: string | null
  payment_date: string | null
  line_items: InvoiceLineItem[]
  subtotal: number
  vat_total: number
  total: number
  amount_paid: number
  notes: string | null
  payment_terms: string | null
  bank_account: string | null
  structured_reference: string | null
  created_at: string
  updated_at: string
  // Relations
  project?: Project
  client?: Client
}

export interface Task {
  id: string
  company_id: string
  project_id: string | null
  title: string
  description: string | null
  status: 'todo' | 'in_progress' | 'review' | 'done' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assignee_id: string | null
  due_date: string | null
  completed_at: string | null
  estimated_hours: number | null
  actual_hours: number | null
  tags: string[]
  created_by: string
  created_at: string
  updated_at: string
  // Relations
  project?: Project
  assignee?: User
}

export interface SiteDiaryEntry {
  id: string
  company_id: string
  project_id: string
  date: string
  author_id: string
  weather: 'sunny' | 'cloudy' | 'rainy' | 'windy' | 'snowy' | 'foggy' | null
  temperature: number | null
  workers_on_site: number | null
  work_performed: string
  materials_used: string | null
  equipment_used: string | null
  visitors: string | null
  incidents: string | null
  delays: string | null
  notes: string | null
  photo_urls: string[]
  created_at: string
  updated_at: string
  // Relations
  project?: Project
  author?: User
}
