-- Archos – Row Level Security policies
-- Every table is restricted to the current user's company via get_company_id().

-- ─── companies ───────────────────────────────────────────────────────────────
CREATE POLICY "View own company"
  ON companies FOR SELECT USING (id = get_company_id());

CREATE POLICY "Update own company"
  ON companies FOR UPDATE USING (id = get_company_id());

CREATE POLICY "Insert company (onboarding)"
  ON companies FOR INSERT WITH CHECK (true);

-- ─── users ───────────────────────────────────────────────────────────────────
CREATE POLICY "View own profile and teammates"
  ON users FOR SELECT USING (id = auth.uid() OR company_id = get_company_id());

CREATE POLICY "Insert own profile"
  ON users FOR INSERT WITH CHECK (id = auth.uid());

CREATE POLICY "Update own profile"
  ON users FOR UPDATE USING (id = auth.uid());

-- ─── clients ─────────────────────────────────────────────────────────────────
CREATE POLICY "View own clients"      ON clients FOR SELECT USING (company_id = get_company_id());
CREATE POLICY "Insert own clients"    ON clients FOR INSERT WITH CHECK (company_id = get_company_id());
CREATE POLICY "Update own clients"    ON clients FOR UPDATE USING (company_id = get_company_id());
CREATE POLICY "Delete own clients"    ON clients FOR DELETE USING (company_id = get_company_id());

-- ─── subcontractors ──────────────────────────────────────────────────────────
CREATE POLICY "View own subcontractors"   ON subcontractors FOR SELECT USING (company_id = get_company_id());
CREATE POLICY "Insert own subcontractors" ON subcontractors FOR INSERT WITH CHECK (company_id = get_company_id());
CREATE POLICY "Update own subcontractors" ON subcontractors FOR UPDATE USING (company_id = get_company_id());
CREATE POLICY "Delete own subcontractors" ON subcontractors FOR DELETE USING (company_id = get_company_id());

-- ─── projects ────────────────────────────────────────────────────────────────
CREATE POLICY "View own projects"   ON projects FOR SELECT USING (company_id = get_company_id());
CREATE POLICY "Insert own projects" ON projects FOR INSERT WITH CHECK (company_id = get_company_id());
CREATE POLICY "Update own projects" ON projects FOR UPDATE USING (company_id = get_company_id());
CREATE POLICY "Delete own projects" ON projects FOR DELETE USING (company_id = get_company_id());

-- ─── project_phases ──────────────────────────────────────────────────────────
CREATE POLICY "View own phases"   ON project_phases FOR SELECT USING (company_id = get_company_id());
CREATE POLICY "Insert own phases" ON project_phases FOR INSERT WITH CHECK (company_id = get_company_id());
CREATE POLICY "Update own phases" ON project_phases FOR UPDATE USING (company_id = get_company_id());
CREATE POLICY "Delete own phases" ON project_phases FOR DELETE USING (company_id = get_company_id());

-- ─── tasks ───────────────────────────────────────────────────────────────────
CREATE POLICY "View own tasks"   ON tasks FOR SELECT USING (company_id = get_company_id());
CREATE POLICY "Insert own tasks" ON tasks FOR INSERT WITH CHECK (company_id = get_company_id());
CREATE POLICY "Update own tasks" ON tasks FOR UPDATE USING (company_id = get_company_id());
CREATE POLICY "Delete own tasks" ON tasks FOR DELETE USING (company_id = get_company_id());

-- ─── quotes ──────────────────────────────────────────────────────────────────
CREATE POLICY "View own quotes"   ON quotes FOR SELECT USING (company_id = get_company_id());
CREATE POLICY "Insert own quotes" ON quotes FOR INSERT WITH CHECK (company_id = get_company_id());
CREATE POLICY "Update own quotes" ON quotes FOR UPDATE USING (company_id = get_company_id());
CREATE POLICY "Delete own quotes" ON quotes FOR DELETE USING (company_id = get_company_id());

-- ─── contracts ───────────────────────────────────────────────────────────────
CREATE POLICY "View own contracts"   ON contracts FOR SELECT USING (company_id = get_company_id());
CREATE POLICY "Insert own contracts" ON contracts FOR INSERT WITH CHECK (company_id = get_company_id());
CREATE POLICY "Update own contracts" ON contracts FOR UPDATE USING (company_id = get_company_id());
CREATE POLICY "Delete own contracts" ON contracts FOR DELETE USING (company_id = get_company_id());

-- ─── invoices ────────────────────────────────────────────────────────────────
CREATE POLICY "View own invoices"   ON invoices FOR SELECT USING (company_id = get_company_id());
CREATE POLICY "Insert own invoices" ON invoices FOR INSERT WITH CHECK (company_id = get_company_id());
CREATE POLICY "Update own invoices" ON invoices FOR UPDATE USING (company_id = get_company_id());
CREATE POLICY "Delete own invoices" ON invoices FOR DELETE USING (company_id = get_company_id());

-- ─── site_diary_entries ──────────────────────────────────────────────────────
CREATE POLICY "View own diary entries"   ON site_diary_entries FOR SELECT USING (company_id = get_company_id());
CREATE POLICY "Insert own diary entries" ON site_diary_entries FOR INSERT WITH CHECK (company_id = get_company_id());
CREATE POLICY "Update own diary entries" ON site_diary_entries FOR UPDATE USING (company_id = get_company_id());
CREATE POLICY "Delete own diary entries" ON site_diary_entries FOR DELETE USING (company_id = get_company_id());
