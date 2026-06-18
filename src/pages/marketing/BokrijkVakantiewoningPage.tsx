import { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Menu, X, MapPin, Wifi, Car, Utensils, Flame, Bike,
  BedDouble, Bath, Trees, Phone, Mail, Send, Clock,
  Users, Star, TreePine, ChevronRight, Leaf,
} from 'lucide-react';

// Inject Playfair Display from Google Fonts
function usePlayfairDisplay() {
  useEffect(() => {
    const id = 'playfair-font';
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap';
    document.head.appendChild(link);
  }, []);
}

function useFadeUp(delay = 0) {
  const reduced = useReducedMotion();
  return {
    initial: reduced ? { opacity: 1 } : { opacity: 0, y: 32 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-50px' },
    transition: { duration: 0.65, delay, ease: [0.25, 0.1, 0.25, 1] },
  };
}

function useFadeIn(delay = 0) {
  const reduced = useReducedMotion();
  return {
    initial: reduced ? { opacity: 1 } : { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true, margin: '-50px' },
    transition: { duration: 0.6, delay, ease: 'easeOut' },
  };
}

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------

const NAV_LINKS = [
  { label: 'Verblijf', href: '#verblijf' },
  { label: 'Ontdekken', href: '#ontdekken' },
  { label: 'Reserveer', href: '#reserveer' },
];

function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-stone-50/96 backdrop-blur-md border-b border-stone-200'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2.5 cursor-pointer"
        >
          <Leaf className={`w-4 h-4 transition-colors duration-500 ${scrolled ? 'text-stone-700' : 'text-white/80'}`} />
          <span
            className={`font-medium tracking-[0.15em] text-xs uppercase transition-colors duration-500 ${
              scrolled ? 'text-stone-800' : 'text-white/90'
            }`}
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Bokrijk
          </span>
        </button>

        {/* Center nav – desktop */}
        <nav className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className={`tracking-[0.12em] text-xs uppercase transition-colors duration-300 cursor-pointer hover:opacity-60 ${
                scrolled ? 'text-stone-700' : 'text-white/90'
              }`}
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => scrollTo('#reserveer')}
            className={`hidden md:inline-flex items-center gap-1.5 px-5 py-2 text-xs tracking-[0.12em] uppercase font-medium rounded-none transition-all duration-300 cursor-pointer border ${
              scrolled
                ? 'border-stone-800 text-stone-800 hover:bg-stone-800 hover:text-white'
                : 'border-white/70 text-white hover:bg-white hover:text-stone-800'
            }`}
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Reserveer nu
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden p-2 cursor-pointer transition-colors duration-300 ${scrolled ? 'text-stone-700' : 'text-white'}`}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-stone-50 border-t border-stone-200">
          <div className="max-w-7xl mx-auto px-5 py-5 flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="text-left text-xs tracking-[0.15em] uppercase text-stone-600 hover:text-stone-900 transition-colors duration-200 cursor-pointer py-1"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => scrollTo('#reserveer')}
              className="mt-1 text-xs tracking-[0.15em] uppercase font-medium text-stone-800 border border-stone-800 px-5 py-2.5 hover:bg-stone-800 hover:text-white transition-colors duration-200 cursor-pointer text-center"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Reserveer Nu
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

function Hero() {
  const reduced = useReducedMotion();

  return (
    <section className="relative min-h-screen flex flex-col">
      {/* Background – warm forest gradient mimicking a golden-hour photograph */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1208] via-[#2c1e0f] to-[#141f14]" />
      {/* Warm light bloom */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-amber-900/25 blur-[120px]" />
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />

      {/* Hero text – centred */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pt-24 pb-32">
        <motion.p
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-amber-300/80 tracking-[0.3em] text-xs uppercase mb-8"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          Bokrijk · Limburg · België
        </motion.p>

        <motion.h1
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.05] mb-8 max-w-4xl"
          style={{ fontFamily: 'Playfair Display, Georgia, serif', fontWeight: 500 }}
        >
          Jouw thuis in het<br />
          <em style={{ fontStyle: 'italic', color: '#e8c97a' }}>hart van de Kempen</em>
        </motion.h1>

        <motion.p
          initial={reduced ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="text-stone-300/75 text-sm sm:text-base max-w-md leading-relaxed mb-12"
          style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}
        >
          Een sfeervolle vakantiewoning op wandelafstand van het Domein Bokrijk.
          Natuur, cultuur en rust — alles binnen handbereik.
        </motion.p>

        <motion.div
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <button
            onClick={() => document.querySelector('#reserveer')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-3.5 bg-amber-600 hover:bg-amber-700 text-white text-xs tracking-[0.2em] uppercase font-medium transition-colors duration-200 cursor-pointer"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Reserveer uw verblijf
          </button>
          <button
            onClick={() => document.querySelector('#verblijf')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-3.5 border border-white/30 hover:border-white/70 text-white/80 hover:text-white text-xs tracking-[0.2em] uppercase font-medium transition-all duration-200 cursor-pointer"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Ontdek de woning
          </button>
        </motion.div>
      </div>

      {/* Bottom footer bar inside hero – Stay · Explore · Dine style */}
      <motion.div
        initial={reduced ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.8 }}
        className="relative z-10 border-t border-white/10"
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-3 divide-x divide-white/10">
            {[
              { label: 'Verblijf', sub: '3 slaapkamers · 6 pers.' },
              { label: 'Ontdekken', sub: 'Museum · Natuur · Stad' },
              { label: 'Reserveer', sub: 'Vanaf €120 / nacht' },
            ].map(({ label, sub }) => (
              <div key={label} className="py-5 px-4 sm:px-8 text-center">
                <div
                  className="text-white/90 text-sm font-medium mb-0.5"
                  style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                >
                  {label}
                </div>
                <div
                  className="text-white/40 text-xs"
                  style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}
                >
                  {sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Marquee
// ---------------------------------------------------------------------------

function Marquee() {
  const text = 'WELKOM IN BOKRIJK  ·  VAKANTIEWONING  ·  LIMBURG, BELGIË  ·  ';
  const repeated = text.repeat(8);

  return (
    <div className="bg-stone-900 py-3 overflow-hidden">
      <div
        className="whitespace-nowrap animate-[marquee_30s_linear_infinite]"
        style={{ display: 'inline-block' }}
      >
        <span
          className="text-stone-400 tracking-[0.25em] text-xs"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          {repeated}
        </span>
        <span
          className="text-stone-400 tracking-[0.25em] text-xs"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          {repeated}
        </span>
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Welcome / Intro
// ---------------------------------------------------------------------------

function WelcomeSection() {
  return (
    <section className="py-24 sm:py-32 bg-stone-50">
      <div className="max-w-2xl mx-auto px-5 text-center">
        <motion.div {...useFadeIn()}>
          {/* Decorative element */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px w-12 bg-amber-600/40" />
            <Leaf className="w-4 h-4 text-amber-600/60" />
            <div className="h-px w-12 bg-amber-600/40" />
          </div>

          <p
            className="text-amber-700 tracking-[0.2em] text-xs uppercase mb-5"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Welkom
          </p>
          <h2
            className="text-stone-800 text-3xl sm:text-4xl md:text-5xl leading-snug mb-8"
            style={{ fontFamily: 'Playfair Display, Georgia, serif', fontWeight: 500 }}
          >
            Een uniek verblijf in de groene Kempen
          </h2>
          <p
            className="text-stone-500 text-base leading-relaxed mb-6"
            style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}
          >
            Onze vakantiewoning combineert landelijke rust met moderne comfort.
            Op wandelafstand van het Openluchtmuseum Bokrijk en omringd door de prachtige
            Limburgse natuur — de ideale uitvalsbasis voor een onvergetelijke vakantie.
          </p>
          <p
            className="text-stone-500 text-base leading-relaxed"
            style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}
          >
            Geniet van een zonnige tuin, gezellige leefruimtes en directe toegang tot
            honderden kilometers fietsroutes doorheen de Kempen.
          </p>

          <button
            onClick={() => document.querySelector('#verblijf')?.scrollIntoView({ behavior: 'smooth' })}
            className="mt-10 inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-amber-700 hover:text-amber-900 transition-colors duration-200 cursor-pointer border-b border-amber-700/40 hover:border-amber-900 pb-0.5"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Ontdek de woning
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Property / Verblijf section
// ---------------------------------------------------------------------------

function VerblijfSection() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { label: 'Woonkamer & Keuken', desc: 'Ruime open leefruimte met volledig uitgeruste keuken, eethoek voor 6 personen en een gezellige zithoek met houtkachel.' },
    { label: 'Slaapkamers', desc: '3 comfortabele slaapkamers: een master bedroom met kingsize bed, een tweepersoonskamer en een kamer met twee eenpersoonsbedden.' },
    { label: 'Tuin & Terras', desc: 'Groot omheind terras met tuinmeubelen, gasbarbecue en een idyllische tuin met uitzicht op de Limburgse natuur.' },
  ];

  const gradients = [
    'from-stone-200 via-amber-50 to-stone-300',
    'from-amber-100 via-stone-100 to-amber-200',
    'from-emerald-100 via-stone-50 to-teal-100',
  ];

  return (
    <section id="verblijf" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left – image placeholder */}
          <motion.div {...useFadeUp()} className="sticky top-24">
            <div className={`aspect-[4/3] rounded-sm bg-gradient-to-br ${gradients[activeTab]} flex items-center justify-center transition-all duration-500`}>
              <div className="text-center">
                <BedDouble className="w-10 h-10 text-stone-400 mx-auto mb-2" />
                <p className="text-stone-400 text-xs tracking-wider uppercase" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {tabs[activeTab].label}
                </p>
              </div>
            </div>

            {/* Mini gallery row */}
            <div className="grid grid-cols-3 gap-2 mt-2">
              {tabs.map((tab, i) => (
                <button
                  key={tab.label}
                  onClick={() => setActiveTab(i)}
                  className={`aspect-[4/3] rounded-sm bg-gradient-to-br ${gradients[i]} flex items-center justify-center cursor-pointer transition-all duration-200 ${
                    activeTab === i ? 'ring-2 ring-amber-600 ring-offset-1' : 'opacity-60 hover:opacity-90'
                  }`}
                >
                  <div className="text-stone-500 text-[10px] tracking-wide text-center px-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {i + 1}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Right – text */}
          <motion.div {...useFadeUp(0.12)}>
            <p
              className="text-amber-700 tracking-[0.2em] text-xs uppercase mb-5"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Verblijfsopties
            </p>
            <h2
              className="text-stone-800 text-3xl sm:text-4xl md:text-5xl leading-snug mb-6"
              style={{ fontFamily: 'Playfair Display, Georgia, serif', fontWeight: 500 }}
            >
              Schop uw schoenen uit en voel u thuis
            </h2>

            <div className="space-y-1 mb-10">
              {tabs.map((tab, i) => (
                <button
                  key={tab.label}
                  onClick={() => setActiveTab(i)}
                  className={`w-full text-left py-4 border-b cursor-pointer transition-all duration-200 group ${
                    activeTab === i ? 'border-amber-600' : 'border-stone-100 hover:border-stone-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm font-medium transition-colors duration-200 ${
                        activeTab === i ? 'text-stone-900' : 'text-stone-400 group-hover:text-stone-600'
                      }`}
                      style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                    >
                      {tab.label}
                    </span>
                    <ChevronRight
                      className={`w-4 h-4 transition-all duration-200 ${
                        activeTab === i ? 'text-amber-600 translate-x-0.5' : 'text-stone-300'
                      }`}
                    />
                  </div>
                  {activeTab === i && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                      className="mt-2 text-stone-500 text-sm leading-relaxed"
                      style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}
                    >
                      {tab.desc}
                    </motion.p>
                  )}
                </button>
              ))}
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-4 gap-4 pb-10 border-b border-stone-100 mb-10">
              {[
                { n: '3', label: 'Slaapkamers' },
                { n: '2', label: 'Badkamers' },
                { n: '6', label: 'Personen' },
                { n: '120m²', label: 'Oppervlakte' },
              ].map(({ n, label }) => (
                <div key={label} className="text-center">
                  <div
                    className="text-2xl font-medium text-stone-800 mb-0.5"
                    style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                  >
                    {n}
                  </div>
                  <div
                    className="text-stone-400 text-xs"
                    style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => document.querySelector('#reserveer')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-amber-700 hover:text-amber-900 transition-colors duration-200 cursor-pointer border-b border-amber-700/40 hover:border-amber-900 pb-0.5"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Beschikbaarheid & prijzen
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Category cards – Natuur / Cultuur / Ontspan
// ---------------------------------------------------------------------------

const CATEGORIES = [
  {
    label: 'Natuur',
    sub: 'Wandelen & fietsen',
    desc: 'Nationaal Park Hoge Kempen, heidevelden en vennen',
    gradient: 'from-[#0d1f0d] via-[#1a2e1a] to-[#0a180a]',
    accent: '#86efac',
  },
  {
    label: 'Cultuur',
    sub: 'Musea & erfgoed',
    desc: 'Openluchtmuseum Bokrijk, C-Mine Genk, Hasselt centrum',
    gradient: 'from-[#1c1408] via-[#2e2010] to-[#140e04]',
    accent: '#fcd34d',
  },
  {
    label: 'Ontspan',
    sub: 'Recreatie & wellness',
    desc: 'Zwemmen, fietsen, terras genieten in de Kempen',
    gradient: 'from-[#0d1520] via-[#152035] to-[#081018]',
    accent: '#93c5fd',
  },
];

function CategoryCards() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-3">
      {CATEGORIES.map((cat, i) => (
        <motion.div
          key={cat.label}
          {...useFadeIn(i * 0.1)}
          onClick={() => document.querySelector('#ontdekken')?.scrollIntoView({ behavior: 'smooth' })}
          className={`relative aspect-[3/4] sm:aspect-auto sm:min-h-[520px] bg-gradient-to-b ${cat.gradient} flex flex-col justify-end p-8 sm:p-10 cursor-pointer group overflow-hidden`}
        >
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-500" />

          <div className="relative z-10">
            <p
              className="text-xs tracking-[0.2em] uppercase mb-3 transition-colors duration-300"
              style={{ fontFamily: 'Inter, sans-serif', color: cat.accent, opacity: 0.7 }}
            >
              {cat.sub}
            </p>
            <h3
              className="text-white text-3xl sm:text-4xl mb-3 leading-tight"
              style={{ fontFamily: 'Playfair Display, Georgia, serif', fontWeight: 500 }}
            >
              {cat.label}
            </h3>
            <p
              className="text-white/50 text-sm leading-relaxed mb-6"
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}
            >
              {cat.desc}
            </p>
            <span
              className="inline-flex items-center gap-1.5 text-xs tracking-[0.15em] uppercase text-white/60 group-hover:text-white/90 transition-colors duration-300"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Ontdek meer <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
            </span>
          </div>
        </motion.div>
      ))}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Wat te Bezoeken
// ---------------------------------------------------------------------------

const ATTRACTIONS = [
  {
    name: 'Openluchtmuseum Bokrijk',
    category: 'Cultuur & Erfgoed',
    distance: '5 min',
    description: 'Het grootste openluchtmuseum van België. Meer dan 100 historische gebouwen uit Vlaanderen — een unieke tijdreis.',
    gradient: 'from-amber-50 to-stone-100',
  },
  {
    name: 'Nationaal Park Hoge Kempen',
    category: 'Natuur',
    distance: '20 min',
    description: "Het enige nationale park van België. Eindeloze heide, vennen en bossen vol wilde natuur.",
    gradient: 'from-emerald-50 to-teal-100',
  },
  {
    name: 'Hasselt Centrum',
    category: 'Stad & Shopping',
    distance: '15 min',
    description: 'Provinciestad met Grote Markt, Japanse Tuin, het Nationaal Jenevermuseum en gezellige terrassen.',
    gradient: 'from-violet-50 to-stone-100',
  },
  {
    name: 'C-Mine Genk',
    category: 'Cultuur & Events',
    distance: '10 min',
    description: "Voormalige mijnsite herschapen tot cultuurcentrum. Museum C, cinema, expo's en industriële architectuur.",
    gradient: 'from-stone-100 to-slate-100',
  },
  {
    name: 'Bokrijk Recreatiedomein',
    category: 'Sport & Recreatie',
    distance: '5 min',
    description: 'Zwemmen in het recreatiemeer, fietsen, wandelen en genieten van de natuur — ideaal voor gezinnen.',
    gradient: 'from-cyan-50 to-sky-100',
  },
  {
    name: 'Fietsknooppunten Kempen',
    category: 'Actief',
    distance: 'Vertrek hier',
    description: 'Vertrek rechtstreeks vanuit de woning op de Limburgse knooppuntenroutes door heide en dorpjes.',
    gradient: 'from-lime-50 to-emerald-100',
  },
];

function OntdekkenSection() {
  return (
    <section id="ontdekken" className="py-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <motion.div {...useFadeUp()} className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 gap-4">
          <div>
            <p
              className="text-amber-700 tracking-[0.2em] text-xs uppercase mb-4"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              In de buurt
            </p>
            <h2
              className="text-stone-800 text-3xl sm:text-4xl md:text-5xl leading-snug"
              style={{ fontFamily: 'Playfair Display, Georgia, serif', fontWeight: 500 }}
            >
              Wat te bezoeken<br />
              <em style={{ fontStyle: 'italic' }}>in Bokrijk</em>
            </h2>
          </div>
          <p
            className="text-stone-400 text-sm max-w-xs leading-relaxed"
            style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}
          >
            Alles op fiets- of rijafstand van uw vakantiewoning.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-stone-200">
          {ATTRACTIONS.map((attr, i) => (
            <motion.div
              key={attr.name}
              {...useFadeIn(i * 0.06)}
              className="bg-white p-8 group hover:bg-stone-50 transition-colors duration-200 cursor-default"
            >
              {/* Top row */}
              <div className="flex items-start justify-between mb-5">
                <span
                  className="text-xs tracking-[0.15em] uppercase text-stone-400"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {attr.category}
                </span>
                <span
                  className="text-xs text-amber-600 font-medium flex items-center gap-1"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <Clock className="w-3 h-3" />
                  {attr.distance}
                </span>
              </div>

              {/* Gradient swatch */}
              <div className={`h-28 rounded-sm bg-gradient-to-br ${attr.gradient} mb-5`} />

              <h3
                className="text-stone-800 text-lg leading-snug mb-2 group-hover:text-stone-900 transition-colors duration-200"
                style={{ fontFamily: 'Playfair Display, Georgia, serif', fontWeight: 500 }}
              >
                {attr.name}
              </h3>
              <p
                className="text-stone-400 text-sm leading-relaxed"
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}
              >
                {attr.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Amenities
// ---------------------------------------------------------------------------

const AMENITIES = [
  { icon: Wifi, label: 'Gratis WiFi' },
  { icon: Car, label: 'Private parking' },
  { icon: Utensils, label: 'Volledig keuken' },
  { icon: Flame, label: 'Barbecue' },
  { icon: Bike, label: '4 fietsen' },
  { icon: BedDouble, label: '3 Slaapkamers' },
  { icon: Bath, label: '2 Badkamers' },
  { icon: Trees, label: 'Tuin & Terras' },
];

function FaciliteitenSection() {
  return (
    <section className="py-24 bg-stone-900 text-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <motion.div {...useFadeUp()}>
            <p
              className="text-amber-400/70 tracking-[0.2em] text-xs uppercase mb-5"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Faciliteiten
            </p>
            <h2
              className="text-white text-3xl sm:text-4xl md:text-5xl leading-snug mb-6"
              style={{ fontFamily: 'Playfair Display, Georgia, serif', fontWeight: 500 }}
            >
              Alles voor een zorgeloos verblijf
            </h2>
            <p
              className="text-stone-400 text-base leading-relaxed mb-10"
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}
            >
              De woning is volledig ingericht zodat u nergens aan hoeft te denken.
              Kom aan, leg uw koffers neer en geniet.
            </p>

            <div className="border-t border-stone-800 pt-8">
              <div className="flex items-baseline gap-2 mb-1">
                <span
                  className="text-4xl font-medium text-white"
                  style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                >
                  €120
                </span>
                <span className="text-stone-500 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>/nacht</span>
              </div>
              <p className="text-stone-500 text-xs mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                tot 6 personen · minimaal 2 nachten
              </p>
              <button
                onClick={() => document.querySelector('#reserveer')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white text-xs tracking-[0.2em] uppercase font-medium transition-colors duration-200 cursor-pointer"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Reserveer nu
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>

          {/* Right – amenity grid */}
          <motion.div {...useFadeUp(0.1)}>
            <div className="grid grid-cols-2 gap-px bg-stone-800">
              {AMENITIES.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="bg-stone-900 hover:bg-stone-800 transition-colors duration-200 p-6 flex items-center gap-4 group cursor-default"
                >
                  <Icon className="w-5 h-5 text-amber-500/70 group-hover:text-amber-400 transition-colors duration-200 flex-shrink-0" />
                  <span
                    className="text-stone-300 text-sm group-hover:text-white transition-colors duration-200"
                    style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Reviews / Testimonials
// ---------------------------------------------------------------------------

const REVIEWS = [
  { name: 'Sophie V.', location: 'Gent', text: 'Absolute rust en prachtige omgeving. De woning was perfect voor ons gezin. Zeker terugkeren!', stars: 5 },
  { name: 'Marc & Lien', location: 'Antwerpen', text: 'Schitterend gelegen, volledig ingericht en een warme ontvangst. Bokrijk is echt een aanrader.', stars: 5 },
  { name: 'Thomas K.', location: 'Brussel', text: 'De fietsen in de woning zijn een geweldige extra. We hebben heel Limburg verkend vanuit deze thuisbasis.', stars: 5 },
];

function ReviewsSection() {
  return (
    <section className="py-24 bg-white border-t border-stone-100">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <motion.div {...useFadeUp()} className="text-center mb-14">
          <div className="flex items-center justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <h2
            className="text-stone-800 text-3xl sm:text-4xl"
            style={{ fontFamily: 'Playfair Display, Georgia, serif', fontWeight: 500 }}
          >
            Wat onze gasten zeggen
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-8">
          {REVIEWS.map((r, i) => (
            <motion.div key={r.name} {...useFadeUp(i * 0.1)} className="text-center">
              <p
                className="text-stone-500 text-base leading-relaxed mb-6 italic"
                style={{ fontFamily: 'Playfair Display, Georgia, serif', fontStyle: 'italic' }}
              >
                "{r.text}"
              </p>
              <div className="h-px w-8 bg-amber-300 mx-auto mb-4" />
              <p
                className="text-stone-700 text-sm font-medium"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {r.name}
              </p>
              <p
                className="text-stone-400 text-xs mt-0.5"
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}
              >
                {r.location}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Contact / Reserveer
// ---------------------------------------------------------------------------

function ReserveerSection() {
  const [form, setForm] = useState({ naam: '', email: '', telefoon: '', aankomst: '', vertrek: '', personen: '2', bericht: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputCls = "w-full px-4 py-3 border border-stone-200 bg-transparent text-sm text-stone-800 placeholder-stone-300 focus:outline-none focus:border-stone-600 transition-colors duration-200";

  return (
    <section id="reserveer" className="py-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-5 gap-16 items-start">
          {/* Left col (2/5) */}
          <motion.div {...useFadeUp()} className="lg:col-span-2">
            <p
              className="text-amber-700 tracking-[0.2em] text-xs uppercase mb-5"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Reserveer
            </p>
            <h2
              className="text-stone-800 text-3xl sm:text-4xl leading-snug mb-6"
              style={{ fontFamily: 'Playfair Display, Georgia, serif', fontWeight: 500 }}
            >
              Boek uw verblijf in Bokrijk
            </h2>
            <p
              className="text-stone-400 text-sm leading-relaxed mb-10"
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}
            >
              Stuur ons uw gewenste data en wij bevestigen de beschikbaarheid binnen 24 uur.
              Wij helpen u graag aan een onvergetelijke vakantie.
            </p>

            <div className="space-y-5 border-t border-stone-200 pt-8">
              {[
                { icon: Phone, label: 'Telefoon', value: '+32 11 00 00 00' },
                { icon: Mail, label: 'E-mail', value: 'info@bokrijkvakantie.be' },
                { icon: MapPin, label: 'Adres', value: 'Bokrijklaan 1, 3600 Genk' },
                { icon: Clock, label: 'Check-in / Check-out', value: '15:00 – 11:00' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4">
                  <Icon className="w-4 h-4 text-stone-300 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-stone-400 text-xs mb-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>{label}</div>
                    <div className="text-stone-700 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right col (3/5) – form */}
          <motion.div {...useFadeUp(0.1)} className="lg:col-span-3">
            {submitted ? (
              <div className="border border-stone-200 p-12 text-center">
                <Leaf className="w-8 h-8 text-amber-600 mx-auto mb-4" />
                <h3
                  className="text-stone-800 text-2xl mb-3"
                  style={{ fontFamily: 'Playfair Display, Georgia, serif', fontWeight: 500 }}
                >
                  Aanvraag ontvangen
                </h3>
                <p className="text-stone-400 text-sm" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}>
                  Bedankt voor uw interesse. Wij nemen binnen 24 uur contact met u op om uw verblijf te bevestigen.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="border border-stone-200 p-8 sm:p-10">
                <h3
                  className="text-stone-700 text-lg mb-8"
                  style={{ fontFamily: 'Playfair Display, Georgia, serif', fontWeight: 500 }}
                >
                  Stuur een aanvraag
                </h3>

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="naam" className="block text-xs text-stone-400 mb-1.5 tracking-wide" style={{ fontFamily: 'Inter, sans-serif' }}>Naam *</label>
                    <input id="naam" type="text" required value={form.naam} onChange={e => setForm({ ...form, naam: e.target.value })} placeholder="Jan Jansen" className={inputCls} style={{ fontFamily: 'Inter, sans-serif' }} />
                  </div>
                  <div>
                    <label htmlFor="telefoon" className="block text-xs text-stone-400 mb-1.5 tracking-wide" style={{ fontFamily: 'Inter, sans-serif' }}>Telefoon</label>
                    <input id="telefoon" type="tel" value={form.telefoon} onChange={e => setForm({ ...form, telefoon: e.target.value })} placeholder="+32 ..." className={inputCls} style={{ fontFamily: 'Inter, sans-serif' }} />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="email" className="block text-xs text-stone-400 mb-1.5 tracking-wide" style={{ fontFamily: 'Inter, sans-serif' }}>E-mailadres *</label>
                  <input id="email" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="jan@example.be" className={inputCls} style={{ fontFamily: 'Inter, sans-serif' }} />
                </div>

                <div className="grid sm:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label htmlFor="aankomst" className="block text-xs text-stone-400 mb-1.5 tracking-wide" style={{ fontFamily: 'Inter, sans-serif' }}>Aankomst *</label>
                    <input id="aankomst" type="date" required value={form.aankomst} onChange={e => setForm({ ...form, aankomst: e.target.value })} className={inputCls} style={{ fontFamily: 'Inter, sans-serif' }} />
                  </div>
                  <div>
                    <label htmlFor="vertrek" className="block text-xs text-stone-400 mb-1.5 tracking-wide" style={{ fontFamily: 'Inter, sans-serif' }}>Vertrek *</label>
                    <input id="vertrek" type="date" required value={form.vertrek} onChange={e => setForm({ ...form, vertrek: e.target.value })} className={inputCls} style={{ fontFamily: 'Inter, sans-serif' }} />
                  </div>
                  <div>
                    <label htmlFor="personen" className="block text-xs text-stone-400 mb-1.5 tracking-wide" style={{ fontFamily: 'Inter, sans-serif' }}>Personen</label>
                    <select id="personen" value={form.personen} onChange={e => setForm({ ...form, personen: e.target.value })} className={inputCls + ' cursor-pointer'} style={{ fontFamily: 'Inter, sans-serif' }}>
                      {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} {n === 1 ? 'persoon' : 'personen'}</option>)}
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="bericht" className="block text-xs text-stone-400 mb-1.5 tracking-wide" style={{ fontFamily: 'Inter, sans-serif' }}>Bericht (optioneel)</label>
                  <textarea id="bericht" rows={4} value={form.bericht} onChange={e => setForm({ ...form, bericht: e.target.value })} placeholder="Eventuele vragen of bijzondere wensen..." className={inputCls + ' resize-none'} style={{ fontFamily: 'Inter, sans-serif' }} />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-stone-900 hover:bg-stone-800 text-white text-xs tracking-[0.2em] uppercase font-medium transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <Send className="w-3.5 h-3.5" />
                  Aanvraag versturen
                </button>
                <p className="text-center text-xs text-stone-300 mt-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Reactie binnen 24 uur · Geen verborgen kosten
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------

function Footer() {
  return (
    <footer className="bg-stone-950 py-10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <Leaf className="w-4 h-4 text-stone-600" />
            <span
              className="text-stone-400 tracking-[0.15em] text-xs uppercase"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Bokrijk Vakantiewoning
            </span>
          </div>

          <p className="text-stone-600 text-xs text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
            © {new Date().getFullYear()} · Bokrijklaan 1, 3600 Genk · info@bokrijkvakantie.be
          </p>

          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-amber-500 text-amber-500" />
            ))}
            <span className="text-stone-500 text-xs ml-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>4.9</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function BokrijkVakantiewoningPage() {
  usePlayfairDisplay();

  return (
    <div className="min-h-screen bg-stone-50 antialiased">
      <Navigation />
      <Hero />
      <Marquee />
      <WelcomeSection />
      <VerblijfSection />
      <CategoryCards />
      <OntdekkenSection />
      <FaciliteitenSection />
      <ReviewsSection />
      <ReserveerSection />
      <Footer />
    </div>
  );
}
