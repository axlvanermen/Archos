-- Archos demo seed
-- Run this in the Supabase SQL editor AFTER signing up via the app.
-- It creates demo data and links it to your account.

DO $$
DECLARE
  v_user_id   UUID;
  v_company   UUID := gen_random_uuid();

  -- clients
  v_cl1 UUID := gen_random_uuid();
  v_cl2 UUID := gen_random_uuid();
  v_cl3 UUID := gen_random_uuid();
  v_cl4 UUID := gen_random_uuid();
  v_cl5 UUID := gen_random_uuid();
  v_cl6 UUID := gen_random_uuid();

  -- subcontractors
  v_sc1 UUID := gen_random_uuid();
  v_sc2 UUID := gen_random_uuid();
  v_sc3 UUID := gen_random_uuid();
  v_sc4 UUID := gen_random_uuid();
  v_sc5 UUID := gen_random_uuid();
  v_sc6 UUID := gen_random_uuid();
  v_sc7 UUID := gen_random_uuid();
  v_sc8 UUID := gen_random_uuid();

  -- projects
  v_pr1 UUID := gen_random_uuid();
  v_pr2 UUID := gen_random_uuid();
  v_pr3 UUID := gen_random_uuid();
  v_pr4 UUID := gen_random_uuid();
  v_pr5 UUID := gen_random_uuid();
  v_pr6 UUID := gen_random_uuid();

BEGIN
  -- ── Resolve current user ──────────────────────────────────────────────────
  SELECT id INTO v_user_id FROM public.users ORDER BY created_at ASC LIMIT 1;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'No user found. Sign up via the app first, then run this seed.';
  END IF;

  -- ── Company ───────────────────────────────────────────────────────────────
  INSERT INTO companies (id, name, vat_number, type, address, city, postal_code, phone, email, website,
    primary_color, secondary_color, accent_color, subscription_plan, onboarding_completed)
  VALUES (v_company, 'Bouwbedrijf Archos BVBA', 'BE 0123.456.789', 'aannemer',
    'Industrielaan 42', 'Gent', '9000', '09 234 56 78', 'info@archos.be', 'https://www.archos.be',
    '#0F172A', '#334155', '#C4943A', 'professional', TRUE);

  -- Link current user to company as owner
  UPDATE public.users
  SET company_id = v_company, role = 'owner', full_name = COALESCE(NULLIF(full_name, ''), 'Jan Peeters')
  WHERE id = v_user_id;

  -- ── Clients ───────────────────────────────────────────────────────────────
  INSERT INTO clients (id, company_id, name, vat_number, contact_person, email, phone, city, postal_code) VALUES
    (v_cl1, v_company, 'Familie De Groote',    NULL,              'Marc De Groote',    'marc@degroote.be',          '050 11 22 33', 'Knokke-Heist', '8300'),
    (v_cl2, v_company, 'Immo Invest NV',       'BE0456789123',    'Dirk Claes',        'info@immoinvest.be',        '011 44 55 66', 'Hasselt',      '3500'),
    (v_cl3, v_company, 'Stad Gent',            'BE0207451227',    'Liesbet Janssens',  'projecten@gent.be',         '09 266 77 88', 'Gent',         '9000'),
    (v_cl4, v_company, 'Dhr. Bogaert',         NULL,              'Patrick Bogaert',   'pbogaert@telenet.be',       '016 33 44 55', 'Leuven',       '3000'),
    (v_cl5, v_company, 'Brugge Invest',        'BE0890123456',    'Sophie Vermeersch', 's.vermeersch@brugge-inv.be','050 66 77 88', 'Brugge',       '8000'),
    (v_cl6, v_company, 'Logistiek BV',         'BE0678912345',    'Tom Aerts',         'tom@logistiek.be',          '03 777 88 99', 'Antwerpen',    '2030');

  -- ── Subcontractors ────────────────────────────────────────────────────────
  INSERT INTO subcontractors (id, company_id, name, vat_number, specialty, contact_person, email, phone, city,
    hourly_rate, rating, vca_expiry_date, rsz_attestation_expiry_date) VALUES
    (v_sc1, v_company, 'Elektro Peeters BVBA',   'BE0123456789', 'Elektriciteit', 'Jan Peeters',      'info@elektropeeters.be',      '011 22 33 44', 'Hasselt',  48, 4, '2027-03-15', '2026-09-01'),
    (v_sc2, v_company, 'Sanitair Devos',          'BE0234567891', 'Loodgieterij',  'Marc Devos',       'marc@sanitairdevos.be',       '03 456 78 90', 'Antwerpen',52, 5, '2026-07-10', '2026-12-01'),
    (v_sc3, v_company, 'Dakwerken Van Acker',     'BE0345678912', 'Dakwerken',     'Steven Van Acker', 'info@dakwerkenvanacker.be',   '09 333 22 11', 'Gent',     45, 4, '2026-06-20', '2027-01-15'),
    (v_sc4, v_company, 'Schilderwerken Maes',     'BE0456789123', 'Schilderwerken','Lieve Maes',       'lieve@schilderwerkenmaes.be', '050 11 22 33', 'Brugge',   38, 3, NULL,         '2026-10-10'),
    (v_sc5, v_company, 'Metselwerken Goris',      'BE0567891234', 'Metselwerk',    'Bert Goris',       'bert@metselwerkengoris.be',   '015 44 55 66', 'Mechelen', 42, 4, '2026-08-01', '2026-06-25'),
    (v_sc6, v_company, 'Vloerwerken Janssens',    'BE0678912345', 'Andere',        'Kris Janssens',    'kris@vloerwerkenjanssens.be', '016 77 88 99', 'Leuven',   40, 5, '2026-12-31', '2027-02-28'),
    (v_sc7, v_company, 'Elektro Smets',           'BE0789123456', 'Elektriciteit', 'Wouter Smets',     'wouter@elektrosmets.be',      '011 99 88 77', 'Genk',     50, 3, '2025-12-01', '2026-11-01'),
    (v_sc8, v_company, 'Dakwerken Hermans',       'BE0891234567', 'Dakwerken',     'Tom Hermans',      'tom@dakwerkenhermans.be',     '02 345 67 89', 'Brussel',  47, 4, '2026-07-05', '2026-06-30');

  -- ── Projects ──────────────────────────────────────────────────────────────
  INSERT INTO projects (id, company_id, client_id, name, reference, status, address, city, postal_code,
    start_date, end_date, budget, total_quoted, total_invoiced, total_paid, manager_id) VALUES
    (v_pr1, v_company, v_cl1, 'Villa Knokke',            'PRJ-2025-001', 'in_uitvoering', 'Zeedijk 145',          'Knokke-Heist', '8300', '2025-01-10', '2025-06-30', 380000, 380000, 116704.50, 116704.50, v_user_id),
    (v_pr2, v_company, v_cl2, 'Kantoorgebouw Hasselt',   'PRJ-2025-002', 'in_uitvoering', 'Kempische Steenweg 310','Hasselt',     '3500', '2025-01-20', '2026-06-30', 1250000,1250000,297539.00, 0,         v_user_id),
    (v_pr3, v_company, v_cl3, 'Appartement Gent',        'PRJ-2025-003', 'gewonnen',      'Korenmarkt 9',         'Gent',         '9000', '2025-03-01', '2026-03-31', 620000, 620000, 4611.56,   4611.56,   v_user_id),
    (v_pr4, v_company, v_cl4, 'Woning Leuven',           'PRJ-2025-004', 'in_uitvoering', 'Tiensestraat 87',      'Leuven',       '3000', '2025-02-15', '2025-12-31', 285000, 285000, 91234.00,  20000,     v_user_id),
    (v_pr5, v_company, v_cl5, 'Residentie Brugge',       'PRJ-2024-018', 'afgerond',      'Smedenstraat 22',      'Brugge',       '8000', '2024-08-01', '2025-05-31', 890000, 890000, 339405.00, 339405.00, v_user_id),
    (v_pr6, v_company, v_cl6, 'Magazijn Antwerpen',      'PRJ-2025-005', 'verloren',      'Noorderlaan 150',      'Antwerpen',    '2030', '2025-04-01', '2025-10-31', 145000, 145000, 0,         0,         v_user_id);

  -- ── Project phases ────────────────────────────────────────────────────────
  INSERT INTO project_phases (project_id, company_id, name, start_date, end_date, status, progress, sort_order) VALUES
    -- Villa Knokke
    (v_pr1, v_company, 'Voorbereiding & vergunningen', '2025-01-10', '2025-02-10', 'voltooid',  100, 1),
    (v_pr1, v_company, 'Ruwbouw',                      '2025-02-05', '2025-04-10', 'voltooid',  100, 2),
    (v_pr1, v_company, 'Technieken',                   '2025-04-05', '2025-05-20', 'lopend',     65, 3),
    (v_pr1, v_company, 'Afwerking',                    '2025-05-15', '2025-06-20', 'gepland',     0, 4),
    (v_pr1, v_company, 'Oplevering',                   '2025-06-20', '2025-06-30', 'gepland',     0, 5),
    -- Kantoorgebouw Hasselt
    (v_pr2, v_company, 'Studiewerk & vergunningen',    '2025-01-20', '2025-03-15', 'voltooid',  100, 1),
    (v_pr2, v_company, 'Funderingswerken',             '2025-03-10', '2025-05-01', 'voltooid',  100, 2),
    (v_pr2, v_company, 'Ruwbouw & betonwerk',          '2025-04-20', '2025-09-30', 'lopend',     40, 3),
    (v_pr2, v_company, 'Technieken & isolatie',        '2025-09-01', '2026-02-28', 'gepland',     0, 4),
    (v_pr2, v_company, 'Afwerking & oplevering',       '2026-02-01', '2026-06-30', 'gepland',     0, 5),
    -- Appartement Gent
    (v_pr3, v_company, 'Ontwerp & vergunningen',       '2025-03-01', '2025-05-15', 'voltooid',  100, 1),
    (v_pr3, v_company, 'Sloopwerken',                  '2025-05-20', '2025-06-30', 'lopend',     20, 2),
    (v_pr3, v_company, 'Ruwbouw',                      '2025-07-01', '2025-11-30', 'gepland',     0, 3),
    (v_pr3, v_company, 'Afwerking',                    '2025-11-15', '2026-02-28', 'gepland',     0, 4),
    (v_pr3, v_company, 'Oplevering',                   '2026-03-01', '2026-03-31', 'gepland',     0, 5),
    -- Woning Leuven
    (v_pr4, v_company, 'Voorbereiding',                '2025-02-15', '2025-03-15', 'voltooid',  100, 1),
    (v_pr4, v_company, 'Ruwbouw',                      '2025-03-10', '2025-06-30', 'lopend',     55, 2),
    (v_pr4, v_company, 'Dakwerken',                    '2025-06-15', '2025-08-15', 'gepland',     0, 3),
    (v_pr4, v_company, 'Technieken & afwerking',       '2025-08-01', '2025-11-30', 'gepland',     0, 4),
    (v_pr4, v_company, 'Oplevering',                   '2025-12-01', '2025-12-31', 'gepland',     0, 5),
    -- Residentie Brugge
    (v_pr5, v_company, 'Voorbereiding',                '2024-08-01', '2024-09-15', 'voltooid',  100, 1),
    (v_pr5, v_company, 'Ruwbouw',                      '2024-09-10', '2025-01-15', 'voltooid',  100, 2),
    (v_pr5, v_company, 'Technieken',                   '2025-01-10', '2025-03-31', 'voltooid',  100, 3),
    (v_pr5, v_company, 'Afwerking',                    '2025-03-20', '2025-05-15', 'voltooid',  100, 4),
    (v_pr5, v_company, 'Oplevering',                   '2025-05-20', '2025-05-31', 'voltooid',  100, 5);

  -- ── Contracts ─────────────────────────────────────────────────────────────
  INSERT INTO contracts (company_id, project_id, client_id, reference, title, status,
    sign_date, start_date, end_date, contract_value, payment_terms) VALUES
    (v_company, v_pr1, v_cl1, 'CONTR-2025-001', 'Aannemingsovereenkomst Villa Knokke',        'active',    '2025-01-08', '2025-01-10', '2025-06-30', 380000,  '30% bij start, 40% bij ruwbouw, 30% bij oplevering'),
    (v_company, v_pr2, v_cl2, 'CONTR-2025-002', 'Aannemingsovereenkomst Kantoorgebouw Hasselt','signed',    '2025-01-28', '2025-01-20', '2026-06-30', 1250000, '15% bij start, maandelijkse vorderingsstaten'),
    (v_company, v_pr3, v_cl3, 'CONTR-2025-003', 'Aannemingsovereenkomst Appartement Gent',    'sent',      NULL,         '2025-03-01', '2026-03-31', 620000,  '20% bij start, 60% in fasen, 20% bij oplevering'),
    (v_company, v_pr4, v_cl4, 'CONTR-2025-004', 'Aannemingsovereenkomst Woning Leuven',       'draft',     NULL,         '2025-02-15', '2025-12-31', 285000,  '30% voorschot, 70% bij oplevering'),
    (v_company, v_pr5, v_cl5, 'CONTR-2024-018', 'Aannemingsovereenkomst Residentie Brugge',   'completed', '2024-08-20', '2024-08-01', '2025-05-31', 890000,  'Maandelijkse vorderingsstaten'),
    (v_company, v_pr6, v_cl6, 'CONTR-2025-005', 'Aannemingsovereenkomst Magazijn Antwerpen',  'cancelled', NULL,         '2025-04-01', '2025-10-31', 145000,  '50% voorschot, 50% bij oplevering');

  -- ── Invoices ──────────────────────────────────────────────────────────────
  INSERT INTO invoices (company_id, project_id, client_id, reference, title, status,
    issue_date, due_date, payment_date, subtotal, vat_total, total, amount_paid,
    payment_terms, bank_account) VALUES
    (v_company, v_pr1, v_cl1, 'FACT-2025-001', 'Factuur - ruwbouw en materiaalkosten',           'paid',       '2025-01-15', '2025-02-14', '2025-02-10', 96450.00,  20254.50, 116704.50, 116704.50, '30 dagen na factuur',                    'BE71 0961 2345 6769'),
    (v_company, v_pr2, v_cl2, 'FACT-2025-002', 'Factuur - ruwbouw, technieken en installaties',  'sent',       '2025-04-01', '2025-05-01', NULL,         257250.00, 54022.50, 311272.50, 0,         'Maandelijkse vorderingsstaat',           'BE71 0961 2345 6769'),
    (v_company, v_pr3, v_cl3, 'FACT-2025-003', 'Factuur - renovatiewerken fase 1',               'sent',       '2025-05-15', '2025-06-14', NULL,         4351.00,   260.56,   4611.56,   0,         '30 dagen na factuur',                    'BE71 0961 2345 6769'),
    (v_company, v_pr4, v_cl4, 'FACT-2025-004', 'Factuur - ruwbouw en dakwerken',                 'overdue',    '2025-03-15', '2025-04-14', NULL,         75400.00,  15834.00, 91234.00,  20000.00,  '30 dagen na factuur',                    'BE71 0961 2345 6769'),
    (v_company, v_pr5, v_cl5, 'FACT-2025-005', 'Factuur - ruwbouw fase 2 en liftinstallatie',   'draft',      '2025-06-01', '2025-07-01', NULL,         280500.00, 58905.00, 339405.00, 0,         'Maandelijkse vorderingsstaat',           'BE71 0961 2345 6769'),
    (v_company, v_pr6, v_cl6, 'FACT-2025-006', 'Factuur - voorbereidende werken',                'cancelled',  '2025-04-10', '2025-05-10', NULL,         15600.00,  3276.00,  18876.00,  0,         '30 dagen na factuur',                    'BE71 0961 2345 6769'),
    (v_company, v_pr1, v_cl1, 'FACT-2025-007-CN','Creditnota - correctie materiaalkosten',       'credit_note','2025-03-01', NULL,          NULL,        -3200.00,  -672.00,  -3872.00,  0,         NULL,                                     'BE71 0961 2345 6769');

  -- ── Tasks ─────────────────────────────────────────────────────────────────
  INSERT INTO tasks (company_id, project_id, title, status, priority, due_date, estimated_hours, tags, created_by) VALUES
    (v_company, v_pr1, 'Oplevering coördineren met architect',         'todo',        'urgent', '2025-06-20', 4,  ARRAY['oplevering','coördinatie'],    v_user_id),
    (v_company, v_pr1, 'Schilderwerken kelder controleren',            'in_progress', 'high',   '2025-05-28', 2,  ARRAY['controle','afwerking'],         v_user_id),
    (v_company, v_pr1, 'Eindschoonmaak inplannen',                     'todo',        'medium', '2025-06-15', 3,  ARRAY['planning'],                     v_user_id),
    (v_company, v_pr2, 'HVAC-inspectie plannen',                       'todo',        'high',   '2025-06-17', 3,  ARRAY['inspectie','technieken'],       v_user_id),
    (v_company, v_pr2, 'Betonkwaliteitsrapport opmaken',               'in_progress', 'medium', '2025-06-10', 5,  ARRAY['rapport','ruwbouw'],            v_user_id),
    (v_company, v_pr2, 'Werfvergadering week 24',                      'done',        'medium', '2025-06-13', 2,  ARRAY['vergadering'],                  v_user_id),
    (v_company, v_pr3, 'Sloopvergunning opvolgen',                     'in_progress', 'high',   '2025-06-19', 4,  ARRAY['vergunning','administratie'],   v_user_id),
    (v_company, v_pr3, 'Bestelling schrijnwerk plaatsen',              'todo',        'medium', '2025-07-01', 2,  ARRAY['bestelling','schrijnwerk'],     v_user_id),
    (v_company, v_pr4, 'Betonstort fase 2 plannen',                    'todo',        'high',   '2025-06-18', 6,  ARRAY['ruwbouw','planning'],           v_user_id),
    (v_company, v_pr4, 'Ruwbouw afronding controleren',                'review',      'medium', '2025-06-20', 3,  ARRAY['controle','ruwbouw'],           v_user_id),
    (v_company, v_pr4, 'Factuur opvragen RSZ-attest onderaannemer',    'todo',        'low',    '2025-06-30', 1,  ARRAY['administratie','compliance'],   v_user_id),
    (v_company, v_pr5, 'Eindoplevering documentatie archiveren',       'done',        'medium', '2025-06-01', 4,  ARRAY['archief','oplevering'],         v_user_id),
    (v_company, v_pr5, 'Garantiedossier versturen naar klant',         'done',        'high',   '2025-06-05', 2,  ARRAY['garantie','klant'],             v_user_id),
    (v_company, NULL,  'Nieuwe offerte Residentie Mechelen opmaken',   'todo',        'medium', '2025-06-25', 8,  ARRAY['offerte'],                      v_user_id),
    (v_company, NULL,  'VCA-attest Elektro Smets vernieuwen',          'todo',        'urgent', '2025-06-20', 1,  ARRAY['compliance','vca'],             v_user_id),
    (v_company, NULL,  'Maandrapport mei 2025 finaliseren',            'in_progress', 'medium', '2025-06-16', 3,  ARRAY['rapport','administratie'],      v_user_id);

  RAISE NOTICE 'Archos demo seed voltooid. Company ID: %', v_company;
END;
$$;
