import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Menu,
  X,
  HardHat,
  FolderKanban,
  FileText,
  Receipt,
  Calendar,
  BookOpen,
  Users,
  Building2,
  Thermometer,
  Zap,
  Droplets,
  Hammer,
  Paintbrush,
  Wrench,
  Star,
  Check,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Animation helpers
// ---------------------------------------------------------------------------

function useFadeUp(delay = 0) {
  const reduced = useReducedMotion();
  return {
    initial: reduced ? { opacity: 1 } : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.5, delay, ease: 'easeOut' },
  };
}

function useFadeIn(delay = 0) {
  const reduced = useReducedMotion();
  return {
    initial: reduced ? { opacity: 1 } : { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.45, delay, ease: 'easeOut' },
  };
}

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------

function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Functies', href: '#functies' },
    { label: 'Prijzen', href: '#prijzen' },
    { label: 'Over ons', href: '#over-ons' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-1">
            <span className="text-xl font-extrabold tracking-tight text-[#0F172A]">
              ARCHOS
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#C4943A] mt-0.5" />
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[#334155] hover:text-[#0F172A] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="/login"
              className="px-4 py-2 text-sm font-medium text-[#0F172A] border border-[#0F172A] rounded-lg hover:bg-[#0F172A] hover:text-white transition-colors"
            >
              Inloggen
            </a>
            <a
              href="/register"
              className="px-4 py-2 text-sm font-medium text-white bg-[#C4943A] rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Gratis proberen
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-[#0F172A]"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu openen"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <nav className="flex flex-col px-4 py-4 gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-[#334155] hover:text-[#0F172A] transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
              <a
                href="/login"
                className="px-4 py-2 text-sm font-medium text-center text-[#0F172A] border border-[#0F172A] rounded-lg"
              >
                Inloggen
              </a>
              <a
                href="/register"
                className="px-4 py-2 text-sm font-medium text-center text-white bg-[#C4943A] rounded-lg"
              >
                Gratis proberen
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

// ---------------------------------------------------------------------------
// Hero dashboard mockup
// ---------------------------------------------------------------------------

function DashboardMockup() {
  const projects = [
    {
      name: 'Renovatie Gentsebaan 14',
      status: 'Actief',
      color: 'bg-emerald-500',
      progress: 72,
    },
    {
      name: 'Nieuwbouw Kortrijk Noord',
      status: 'In aanbesteding',
      color: 'bg-amber-400',
      progress: 30,
    },
    {
      name: 'HVAC Kantoorgebouw Leuven',
      status: 'Afgerond',
      color: 'bg-slate-400',
      progress: 100,
    },
  ];

  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-700 bg-[#0F172A]">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold tracking-widest text-slate-300">ARCHOS</span>
          <span className="w-1 h-1 rounded-full bg-[#C4943A]" />
          <span className="text-xs text-slate-500">Dashboard</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#C4943A] flex items-center justify-center">
            <span className="text-xs font-bold text-white">PV</span>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4">
        {[
          { label: 'Actieve projecten', value: '12' },
          { label: 'Openstaande offertes', value: '4' },
          { label: 'Facturen deze maand', value: '€48.200' },
          { label: 'Medewerkers', value: '8' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-slate-800 rounded-xl p-3 flex flex-col gap-1"
          >
            <span className="text-[10px] text-slate-400 leading-tight">{stat.label}</span>
            <span className="text-lg font-bold text-white">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Project list */}
      <div className="px-4 pb-4">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Recente projecten
        </p>
        <div className="flex flex-col gap-2">
          {projects.map((p) => (
            <div
              key={p.name}
              className="bg-slate-800 rounded-lg px-3 py-2.5 flex items-center gap-3"
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-200 truncate">{p.name}</p>
                <div className="mt-1.5 h-1 w-full bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#C4943A] rounded-full transition-all"
                    style={{ width: `${p.progress}%` }}
                  />
                </div>
              </div>
              <span
                className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold text-white ${p.color}`}
              >
                {p.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

function Hero() {
  const fadeUp0 = useFadeUp(0);
  const fadeUp1 = useFadeUp(0.08);
  const fadeUp2 = useFadeUp(0.16);
  const fadeUp3 = useFadeUp(0.24);
  const fadeRight = useFadeIn(0.1);

  return (
    <section className="pt-28 pb-20 bg-[#F8FAFC] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left copy */}
          <div className="flex flex-col gap-6">
            <motion.div {...fadeUp0}>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#C4943A]-50 border border-orange-100 text-xs font-semibold text-[#C4943A]">
                <HardHat size={13} />
                Voor Belgische bouwbedrijven
              </span>
            </motion.div>

            <motion.h1
              {...fadeUp1}
              className="text-4xl sm:text-5xl font-extrabold text-[#0F172A] leading-tight"
            >
              Alles wat uw bouwbedrijf nodig heeft,{' '}
              <span className="text-[#C4943A]">op een plek.</span>
            </motion.h1>

            <motion.p {...fadeUp2} className="text-lg text-[#334155] leading-relaxed max-w-xl">
              Van eerste aanvraag tot finale oplevering — Archos digitaliseert uw volledige
              bouwproces. Minder papier, minder fouten, meer tijd op de werf.
            </motion.p>

            <motion.div {...fadeUp3} className="flex flex-col sm:flex-row gap-3">
              <a
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-white bg-[#C4943A] rounded-xl hover:bg-yellow-700 transition-colors shadow-sm"
              >
                Start uw gratis proefperiode
                <ArrowRight size={18} />
              </a>
              <a
                href="#demo"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-[#0F172A] border border-[#0F172A] rounded-xl hover:bg-[#0F172A] hover:text-white transition-colors"
              >
                Bekijk demo
                <ChevronRight size={18} />
              </a>
            </motion.div>

            <motion.p {...fadeUp3} className="text-sm text-slate-500">
              Geen creditcard nodig &middot; 14 dagen gratis &middot; Belgische support
            </motion.p>
          </div>

          {/* Right dashboard mockup */}
          <motion.div {...fadeRight} className="w-full">
            <DashboardMockup />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Social proof bar
// ---------------------------------------------------------------------------

function SocialProofBar() {
  const fade = useFadeIn(0);
  const logos = [
    'TMGO',
    'VanDenBerg Bouw',
    'De Backer NV',
    'Horizon Construct',
    'PB-Technics',
  ];

  return (
    <section className="py-10 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.p
          {...fade}
          className="text-center text-sm font-medium text-slate-400 mb-6 uppercase tracking-wide"
        >
          Vertrouwd door 200+ Belgische bouwbedrijven
        </motion.p>
        <motion.div
          {...fade}
          className="flex flex-wrap items-center justify-center gap-8 sm:gap-12"
        >
          {logos.map((logo) => (
            <span
              key={logo}
              className="text-base font-bold text-gray-300 tracking-tight select-none"
            >
              {logo}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Features
// ---------------------------------------------------------------------------

const FEATURES = [
  {
    Icon: FolderKanban,
    title: 'Projectbeheer',
    desc: 'Van aanvraag tot oplevering, alle projectinformatie gecentraliseerd.',
  },
  {
    Icon: FileText,
    title: 'Contractgenerator',
    desc: 'Genereer juridisch correcte Belgische onderaannemingsovereenkomsten in seconden.',
  },
  {
    Icon: Receipt,
    title: 'Facturatie',
    desc: 'Professionele facturen met uw huisstijl, in een klik verstuurd.',
  },
  {
    Icon: Calendar,
    title: 'Werfplanning',
    desc: 'Gantt-weergave van alle fasen en taken, per medewerker gefilterd.',
  },
  {
    Icon: BookOpen,
    title: 'Werfdagboek',
    desc: "Dagelijkse verslagen met foto's en GPS, direct vanop de werf.",
  },
  {
    Icon: Users,
    title: 'Teambeheer',
    desc: 'Rollen, permissies en uitnodigingen voor uw hele ploeg.',
  },
];

function Features() {
  return (
    <section id="functies" className="py-20 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...useFadeUp(0)} className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">
            Alles onder een dak
          </h2>
          <p className="mt-3 text-lg text-[#334155] max-w-2xl mx-auto">
            Archos bundelt alle tools die een modern bouwbedrijf nodig heeft in een
            intuïtief platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(({ Icon, title, desc }, i) => (
            <motion.div
              key={title}
              {...useFadeUp(i * 0.07)}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-[#C4943A]-50 flex items-center justify-center">
                <Icon size={20} className="text-[#C4943A]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">{title}</h3>
                <p className="mt-1 text-sm text-[#334155] leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Company types
// ---------------------------------------------------------------------------

const COMPANY_TYPES = [
  {
    Icon: Building2,
    title: 'Algemeen aannemer',
    desc: 'Beheer elk project van a tot z vanuit een overzicht.',
  },
  {
    Icon: Thermometer,
    title: 'HVAC-installateur',
    desc: 'Plan techniekers en volg installaties in realtime op.',
  },
  {
    Icon: Zap,
    title: 'Elektricien',
    desc: 'Digitale attesten en keuringsrapporten op maat.',
  },
  {
    Icon: Droplets,
    title: 'Sanitair / Loodgieter',
    desc: 'Offertes en facturen voor sanitaire werken, snel en correct.',
  },
  {
    Icon: HardHat,
    title: 'Ruwbouw',
    desc: 'Werfplanning en dagboek voor grotere bouwwerven.',
  },
  {
    Icon: Hammer,
    title: 'Schrijnwerker',
    desc: 'Maatwerk contracten en leveringstermijnen bijhouden.',
  },
  {
    Icon: Paintbrush,
    title: 'Schilder / Afwerking',
    desc: 'Kleurenplannen, klantverslagen en opvolgingen digitaal.',
  },
  {
    Icon: Wrench,
    title: 'Onderaannemer',
    desc: 'Reageer op aanvragen en beheer uw overeenkomsten centraal.',
  },
];

function CompanyTypes() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...useFadeUp(0)} className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">
            Speciaal voor uw type bouwbedrijf
          </h2>
          <p className="mt-3 text-lg text-[#334155] max-w-2xl mx-auto">
            Of u nu een kleine schrijnwerker bent of een grote algemene aannemer — Archos
            past zich aan uw noden aan.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {COMPANY_TYPES.map(({ Icon, title, desc }, i) => (
            <motion.div
              key={title}
              {...useFadeUp(i * 0.05)}
              className="bg-[#F8FAFC] rounded-2xl p-5 border border-gray-100 hover:border-orange-200 hover:shadow-sm transition-all flex flex-col gap-3"
            >
              <div className="w-9 h-9 rounded-lg bg-[#C4943A]-50 flex items-center justify-center">
                <Icon size={18} className="text-[#C4943A]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0F172A]">{title}</h3>
                <p className="mt-1 text-xs text-[#334155] leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// How it works
// ---------------------------------------------------------------------------

function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Maak uw account aan',
      desc: 'Bedrijfsgegevens invullen en abonnement kiezen.',
    },
    {
      num: '02',
      title: 'Scan uw website',
      desc: 'Automatische herkenning van uw logo en huisstijlkleuren.',
    },
    {
      num: '03',
      title: 'Nodig uw team uit',
      desc: 'Medewerkers toevoegen en direct aan de slag.',
    },
  ];

  return (
    <section className="py-20 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...useFadeUp(0)} className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">
            Klaar in 5 minuten
          </h2>
          <p className="mt-3 text-lg text-[#334155] max-w-xl mx-auto">
            Geen technische kennis vereist. Uw team kan meteen starten.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative">
          {/* Connector line visible on desktop */}
          <div className="hidden sm:block absolute top-8 left-[calc(16.666%+2rem)] right-[calc(16.666%+2rem)] h-px bg-gray-200" />

          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              {...useFadeUp(i * 0.1)}
              className="flex flex-col items-center text-center gap-4 relative"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#0F172A] flex items-center justify-center shadow-lg z-10">
                <span className="text-xl font-extrabold text-[#C4943A]">{step.num}</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">{step.title}</h3>
                <p className="mt-1 text-sm text-[#334155]">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Pricing
// ---------------------------------------------------------------------------

interface PricingPlan {
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  users: string;
  popular: boolean;
  features: string[];
  cta: string;
  href: string;
}

const PLANS: PricingPlan[] = [
  {
    name: 'Starter',
    monthlyPrice: 49,
    annualPrice: 490,
    users: 'Tot 5 gebruikers',
    popular: false,
    features: ['Projectbeheer', 'Klantenbeheer', 'Facturatie', '5 GB opslag'],
    cta: 'Begin met Starter',
    href: '/register?plan=starter',
  },
  {
    name: 'Professional',
    monthlyPrice: 99,
    annualPrice: 990,
    users: 'Tot 15 gebruikers',
    popular: true,
    features: [
      'Alles van Starter',
      'Contractgenerator',
      'Werfplanning',
      'Werfdagboek',
      'Onderaannemers',
      '50 GB opslag',
    ],
    cta: 'Begin met Professional',
    href: '/register?plan=professional',
  },
  {
    name: 'Enterprise',
    monthlyPrice: 199,
    annualPrice: 1990,
    users: 'Onbeperkt gebruikers',
    popular: false,
    features: [
      'Alles van Professional',
      'Rapporten & analytics',
      'Prioriteitssupport',
      'Maatwerk integraties',
      'Onbeperkte opslag',
    ],
    cta: 'Contacteer ons',
    href: '/contact',
  },
];

function Pricing() {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="prijzen" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...useFadeUp(0)} className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">
            Transparante prijzen, geen verrassingen
          </h2>
          <p className="mt-3 text-lg text-[#334155]">
            Kies het abonnement dat past bij uw bedrijf.
          </p>
        </motion.div>

        {/* Billing toggle */}
        <motion.div
          {...useFadeUp(0.05)}
          className="flex items-center justify-center gap-4 mb-12"
        >
          <span
            className={`text-sm font-medium transition-colors ${
              !annual ? 'text-[#0F172A]' : 'text-slate-400'
            }`}
          >
            Maandelijks
          </span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              annual ? 'bg-[#C4943A]' : 'bg-gray-300'
            }`}
            aria-label="Schakel tussen maandelijks en jaarlijks"
          >
            <span
              className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                annual ? 'translate-x-6' : 'translate-x-0.5'
              }`}
            />
          </button>
          <span
            className={`text-sm font-medium transition-colors ${
              annual ? 'text-[#0F172A]' : 'text-slate-400'
            }`}
          >
            Jaarlijks
            <span className="ml-2 px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold">
              2 maanden gratis
            </span>
          </span>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              {...useFadeUp(i * 0.08)}
              className={`relative rounded-2xl p-7 flex flex-col gap-5 border ${
                plan.popular
                  ? 'border-[#C4943A] bg-[#0F172A]'
                  : 'border-gray-100 bg-[#F8FAFC]'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 rounded-full bg-[#C4943A] text-white text-xs font-bold shadow whitespace-nowrap">
                    MEEST POPULAIR
                  </span>
                </div>
              )}

              <div>
                <h3
                  className={`text-lg font-bold ${
                    plan.popular ? 'text-white' : 'text-[#0F172A]'
                  }`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`text-sm mt-0.5 ${
                    plan.popular ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  {plan.users}
                </p>
              </div>

              <div>
                <div className="flex items-baseline gap-1">
                  <span
                    className={`text-4xl font-extrabold ${
                      plan.popular ? 'text-white' : 'text-[#0F172A]'
                    }`}
                  >
                    &euro;{annual ? Math.round(plan.annualPrice / 12) : plan.monthlyPrice}
                  </span>
                  <span
                    className={`text-sm ${
                      plan.popular ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    /maand
                  </span>
                </div>
                {annual && (
                  <p
                    className={`mt-1 text-xs ${
                      plan.popular ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    &euro;{plan.annualPrice}/jaar gefactureerd
                  </p>
                )}
              </div>

              <ul className="flex flex-col gap-2.5 flex-1">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2">
                    <Check size={15} className="mt-0.5 shrink-0 text-[#C4943A]" />
                    <span
                      className={`text-sm ${
                        plan.popular ? 'text-slate-300' : 'text-[#334155]'
                      }`}
                    >
                      {feat}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href={plan.href}
                className={`mt-auto block text-center px-5 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  plan.popular
                    ? 'bg-[#C4943A] text-white hover:bg-[#C4943A]-500'
                    : 'bg-[#0F172A] text-white hover:bg-slate-800'
                }`}
              >
                {plan.cta}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------------------

const TESTIMONIALS = [
  {
    quote: 'Met Archos besparen we minstens 5 uur per week op administratie.',
    name: 'Pieter Van Den Berg',
    role: 'Zaakvoerder, VDB Construct',
  },
  {
    quote:
      'De contractgenerator alleen al heeft zijn geld al duizend keer terugverdiend.',
    name: 'Sofie Claes',
    role: 'Projectmanager, Claes HVAC',
  },
  {
    quote: 'Eindelijk een app die echt werkt op de werf, ook offline.',
    name: 'Tom Martens',
    role: 'Werfleider, Martens Bouw',
  },
];

function Testimonials() {
  return (
    <section className="py-20 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...useFadeUp(0)} className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">
            Wat onze klanten zeggen
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              {...useFadeUp(i * 0.1)}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col gap-4"
            >
              {/* 5 stars */}
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star
                    key={s}
                    size={14}
                    className="text-[#C4943A] fill-[#C4943A]"
                  />
                ))}
              </div>
              <p className="text-[#334155] text-sm leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div>
                <p className="text-sm font-bold text-[#0F172A]">{t.name}</p>
                <p className="text-xs text-slate-500">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// CTA section
// ---------------------------------------------------------------------------

function CtaSection() {
  return (
    <section className="py-20 bg-[#0F172A]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2
          {...useFadeUp(0)}
          className="text-3xl sm:text-4xl font-extrabold text-white"
        >
          Klaar om te starten?
        </motion.h2>
        <motion.p {...useFadeUp(0.08)} className="mt-4 text-lg text-slate-300 leading-relaxed">
          Sluit u aan bij 200+ Belgische bouwbedrijven die hun administratie al
          gedigitaliseerd hebben.
        </motion.p>
        <motion.div {...useFadeUp(0.16)} className="mt-8">
          <a
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white bg-[#C4943A] rounded-xl hover:bg-[#C4943A]-500 transition-colors shadow-lg"
          >
            Start gratis proefperiode
            <ArrowRight size={18} />
          </a>
        </motion.div>
        <motion.p {...useFadeUp(0.22)} className="mt-4 text-sm text-slate-500">
          14 dagen gratis. Geen creditcard nodig. Belgische support.
        </motion.p>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------

function Footer() {
  const cols = [
    {
      title: 'Product',
      links: ['Functies', 'Prijzen', 'Roadmap'],
    },
    {
      title: 'Bedrijf',
      links: ['Over ons', 'Contact', 'Privacy'],
    },
    {
      title: 'Ondersteuning',
      links: ['Documentatie', 'Veelgestelde vragen', 'Status'],
    },
    {
      title: 'Juridisch',
      links: ['Privacybeleid', 'Algemene voorwaarden', 'Cookie policy'],
    },
  ];

  return (
    <footer id="contact" className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-8 sm:gap-12">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1 flex flex-col gap-3">
            <div className="flex items-center gap-1">
              <span className="text-lg font-extrabold tracking-tight text-[#0F172A]">
                ARCHOS
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#C4943A] mb-0.5" />
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Het digitale zenuwcentrum van uw bouwbedrijf.
            </p>
          </div>

          {/* Link columns */}
          {cols.map((col) => (
            <div key={col.title} className="flex flex-col gap-3">
              <p className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                {col.title}
              </p>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-slate-500 hover:text-[#0F172A] transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-slate-400">
            &copy; 2025 Archos BV &middot; Alle rechten voorbehouden &middot; Made in Belgium
          </p>
        </div>
      </div>
    </footer>
  );
}

// ---------------------------------------------------------------------------
// Page root
// ---------------------------------------------------------------------------

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navigation />
      <main>
        <Hero />
        <SocialProofBar />
        <Features />
        <CompanyTypes />
        <HowItWorks />
        <Pricing />
        <Testimonials />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
