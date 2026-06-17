import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Menu,
  X,
  MapPin,
  Wifi,
  Car,
  Utensils,
  Flame,
  Bike,
  BedDouble,
  Bath,
  Trees,
  Phone,
  Mail,
  Send,
  ChevronDown,
  Clock,
  Users,
  Star,
  TreePine,
  Building2,
  Waves,
  Mountain,
  Landmark,
  ShoppingBag,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Animation helpers
// ---------------------------------------------------------------------------

function useFadeUp(delay = 0) {
  const reduced = useReducedMotion();
  return {
    initial: reduced ? { opacity: 1 } : { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.55, delay, ease: 'easeOut' },
  };
}

function useFadeIn(delay = 0) {
  const reduced = useReducedMotion();
  return {
    initial: reduced ? { opacity: 1 } : { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.5, delay, ease: 'easeOut' },
  };
}

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------

const NAV_LINKS = [
  { label: 'De Woning', href: '#woning' },
  { label: 'Te Bezoeken', href: '#bezoeken' },
  { label: 'Faciliteiten', href: '#faciliteiten' },
  { label: 'Reserveer', href: '#reserveer' },
];

function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-emerald-100'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
            <TreePine className="w-4 h-4 text-white" />
          </div>
          <span className={`font-semibold text-sm sm:text-base transition-colors duration-300 ${scrolled ? 'text-emerald-900' : 'text-white'}`}>
            Bokrijk Vakantiewoning
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNav(link.href)}
              className={`text-sm font-medium transition-colors duration-200 cursor-pointer hover:text-amber-500 ${
                scrolled ? 'text-emerald-800' : 'text-white/90'
              }`}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => handleNav('#reserveer')}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-emerald-900 text-sm font-semibold rounded-lg transition-colors duration-200 cursor-pointer"
          >
            Reserveer Nu
          </button>
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`md:hidden p-2 rounded-lg transition-colors duration-200 cursor-pointer ${
            scrolled ? 'text-emerald-800 hover:bg-emerald-50' : 'text-white hover:bg-white/10'
          }`}
          aria-label={mobileOpen ? 'Menu sluiten' : 'Menu openen'}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-emerald-100 shadow-lg">
          <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                className="text-left px-3 py-2.5 text-emerald-800 text-sm font-medium rounded-lg hover:bg-emerald-50 transition-colors duration-150 cursor-pointer"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => handleNav('#reserveer')}
              className="mt-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-emerald-900 text-sm font-semibold rounded-lg transition-colors duration-200 cursor-pointer text-center"
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient background (no external images) */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-emerald-700 to-teal-800" />
      {/* Decorative blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-teal-400/15 blur-3xl" />
      <div className="absolute top-1/3 right-1/3 w-64 h-64 rounded-full bg-amber-400/10 blur-3xl" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-400/20 border border-amber-400/40 rounded-full text-amber-300 text-xs font-medium mb-6"
        >
          <MapPin className="w-3 h-3" />
          Bokrijk, Limburg, België
        </motion.div>

        <motion.h1
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1, ease: 'easeOut' }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6"
        >
          Jouw perfecte{' '}
          <span className="text-amber-400">vakantiewoning</span>
          {' '}in het hart van de Kempen
        </motion.h1>

        <motion.p
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.2, ease: 'easeOut' }}
          className="text-emerald-100 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Ontspan in een comfortabele woning vlakbij het bekende Domein Bokrijk.
          Geniet van natuur, cultuur en gezelligheid — alles op fietsafstand.
        </motion.p>

        <motion.div
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.3, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <button
            onClick={() => document.querySelector('#reserveer')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-7 py-3.5 bg-amber-400 hover:bg-amber-500 text-emerald-900 font-semibold rounded-xl transition-colors duration-200 cursor-pointer text-base shadow-lg shadow-amber-400/25"
          >
            Reserveer uw verblijf
          </button>
          <button
            onClick={() => document.querySelector('#woning')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-colors duration-200 cursor-pointer text-base border border-white/20"
          >
            Meer ontdekken
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.45, ease: 'easeOut' }}
          className="mt-16 grid grid-cols-3 gap-4 max-w-md mx-auto"
        >
          {[
            { value: '3', label: 'Slaapkamers' },
            { value: '6', label: 'Personen' },
            { value: '4.9', label: 'Beoordeling' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold text-amber-400">{stat.value}</div>
              <div className="text-emerald-200 text-xs mt-0.5">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-emerald-300/60 flex flex-col items-center gap-1"
      >
        <ChevronDown className="w-5 h-5 animate-bounce" />
      </motion.div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// About the property
// ---------------------------------------------------------------------------

function AboutSection() {
  return (
    <section id="woning" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Visual placeholder */}
          <motion.div {...useFadeUp()} className="order-2 md:order-1">
            <div className="relative">
              <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-gradient-to-br from-emerald-200 via-teal-100 to-emerald-300 flex items-center justify-center">
                <div className="text-center">
                  <TreePine className="w-16 h-16 text-emerald-600 mx-auto mb-3" />
                  <p className="text-emerald-700 font-medium text-sm">Groene omgeving</p>
                </div>
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 bg-amber-400 rounded-xl px-4 py-3 shadow-lg">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-emerald-900 fill-emerald-900" />
                  <span className="font-bold text-emerald-900 text-sm">4.9 / 5</span>
                </div>
                <p className="text-emerald-800 text-xs mt-0.5">Uitstekende reviews</p>
              </div>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div {...useFadeUp(0.1)} className="order-1 md:order-2">
            <span className="inline-block text-emerald-600 text-sm font-semibold uppercase tracking-wider mb-3">
              Over de woning
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-emerald-900 mb-5 leading-snug">
              Rust en comfort in de Limburgse natuur
            </h2>
            <p className="text-slate-600 text-base leading-relaxed mb-5">
              Onze ruime vakantiewoning ligt op wandelafstand van het Domein Bokrijk en is de
              ideale uitvalsbasis voor een onvergetelijke vakantie in Limburg. De woning biedt
              alle comfort voor gezinnen en vriendengroepen.
            </p>
            <p className="text-slate-600 text-base leading-relaxed mb-8">
              Geniet van een uitgestrekte tuin, een zonnig terras en directe toegang tot de
              fietsroutes doorheen de Kempen. Alles wat u nodig heeft voor een zorgeloze vakantie.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: BedDouble, label: '3 Slaapkamers', sub: 'tot 6 personen' },
                { icon: Bath, label: '2 Badkamers', sub: 'volledig uitgerust' },
                { icon: Trees, label: 'Grote tuin', sub: 'met terras & BBQ' },
                { icon: MapPin, label: 'Toplocatie', sub: '5 min van Bokrijk' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                  <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-emerald-900">{label}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{sub}</div>
                  </div>
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
// Things to visit
// ---------------------------------------------------------------------------

const ATTRACTIONS = [
  {
    icon: Landmark,
    name: 'Openluchtmuseum Bokrijk',
    category: 'Cultuur & Erfgoed',
    distance: '5 min',
    description:
      'Het grootste openluchtmuseum van België met meer dan 100 historische gebouwen uit Vlaanderen. Een unieke tijdreis door eeuwen Vlaamse geschiedenis.',
    gradient: 'from-amber-100 via-orange-50 to-amber-200',
    iconColor: 'bg-amber-500',
  },
  {
    icon: Mountain,
    name: 'Nationaal Park Hoge Kempen',
    category: 'Natuur',
    distance: '20 min',
    description:
      'Het enige nationale park van België. Wandel door heide, vennen en bossen. Ontdek de wilde natuur en unieke flora en fauna van de Kempen.',
    gradient: 'from-emerald-100 via-teal-50 to-green-200',
    iconColor: 'bg-emerald-600',
  },
  {
    icon: ShoppingBag,
    name: 'Hasselt Centrum',
    category: 'Stad & Shopping',
    distance: '15 min',
    description:
      'De charmante hoofdstad van Limburg. Bezoek de gezellige Grote Markt, het Nationaal Jenevermuseum, de Japanse Tuin en talrijke winkels en restaurants.',
    gradient: 'from-violet-100 via-purple-50 to-violet-200',
    iconColor: 'bg-violet-600',
  },
  {
    icon: Building2,
    name: 'C-Mine Genk',
    category: 'Cultuur & Events',
    distance: '10 min',
    description:
      'Een voormalige mijnsite omgevormd tot bruisend cultuurcentrum. Museum C, cinema, expo\'s, evenementen en unieke industriële architectuur.',
    gradient: 'from-slate-100 via-gray-50 to-slate-200',
    iconColor: 'bg-slate-700',
  },
  {
    icon: Waves,
    name: 'Bokrijk Recreatiedomein',
    category: 'Sport & Recreatie',
    distance: '5 min',
    description:
      'Zwemmen in het heldere recreatiemeer, fietsen op uitgebreide paden, spelen in de natuur. Ideaal voor gezinnen met kinderen van alle leeftijden.',
    gradient: 'from-cyan-100 via-sky-50 to-blue-200',
    iconColor: 'bg-cyan-600',
  },
  {
    icon: Bike,
    name: 'Fietsknooppunten Kempen',
    category: 'Actief',
    distance: 'Direct',
    description:
      'Vertrek rechtstreeks vanuit de woning op de bekende Limburgse fietsknooppuntenroutes. Prachtige tochten door heide, bossen en pittoreske dorpjes.',
    gradient: 'from-lime-100 via-green-50 to-emerald-200',
    iconColor: 'bg-lime-600',
  },
];

function AttractionCard({ attraction, index }: { attraction: typeof ATTRACTIONS[0]; index: number }) {
  const { icon: Icon, name, category, distance, description, gradient, iconColor } = attraction;

  return (
    <motion.div
      {...useFadeUp(index * 0.07)}
      className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-default"
    >
      {/* Top visual */}
      <div className={`h-32 bg-gradient-to-br ${gradient} flex items-center justify-center relative`}>
        <div className={`w-12 h-12 rounded-xl ${iconColor} flex items-center justify-center shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="absolute top-3 right-3 px-2.5 py-1 bg-white/80 backdrop-blur-sm rounded-full text-xs font-medium text-slate-600 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {distance}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-1">{category}</div>
        <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors duration-200">
          {name}
        </h3>
        <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

function VisitSection() {
  return (
    <section id="bezoeken" className="py-24 bg-emerald-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div {...useFadeUp()} className="text-center mb-14">
          <span className="inline-block text-emerald-600 text-sm font-semibold uppercase tracking-wider mb-3">
            In de buurt
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-emerald-900 mb-4">
            Wat te bezoeken in Bokrijk
          </h2>
          <p className="text-slate-600 text-base max-w-2xl mx-auto leading-relaxed">
            Bokrijk en omgeving bieden een rijke mix van natuur, cultuur en recreatie.
            Hier zijn de absolute hoogtepunten op fiets- of rijafstand van uw verblijf.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ATTRACTIONS.map((attraction, i) => (
            <AttractionCard key={attraction.name} attraction={attraction} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Amenities / Faciliteiten
// ---------------------------------------------------------------------------

const AMENITIES = [
  { icon: Wifi, label: 'Gratis WiFi', desc: 'Snel internet overal' },
  { icon: Car, label: 'Parkeerplaats', desc: 'Private oprit' },
  { icon: Utensils, label: 'Volledig keuken', desc: 'Alle apparatuur' },
  { icon: Flame, label: 'Barbecue', desc: 'Gas BBQ in tuin' },
  { icon: Bike, label: 'Fietsen', desc: '4 fietsen beschikbaar' },
  { icon: BedDouble, label: '3 Slaapkamers', desc: 'Comfortabele bedden' },
  { icon: Bath, label: '2 Badkamers', desc: 'Met douche & bad' },
  { icon: Trees, label: 'Tuin & Terras', desc: 'Groot buitenruimte' },
];

function AmenitiesSection() {
  return (
    <section id="faciliteiten" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div {...useFadeUp()} className="text-center mb-14">
          <span className="inline-block text-emerald-600 text-sm font-semibold uppercase tracking-wider mb-3">
            Comfort
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-emerald-900 mb-4">
            Faciliteiten
          </h2>
          <p className="text-slate-600 text-base max-w-xl mx-auto leading-relaxed">
            Alles voor een comfortabel en zorgeloos verblijf, zodat u zich meteen thuis voelt.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {AMENITIES.map(({ icon: Icon, label, desc }, i) => (
            <motion.div
              key={label}
              {...useFadeUp(i * 0.05)}
              className="flex flex-col items-center text-center p-5 rounded-2xl border border-slate-100 bg-emerald-50/50 hover:bg-emerald-50 hover:border-emerald-200 transition-all duration-200 cursor-default"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center mb-3">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="font-semibold text-emerald-900 text-sm">{label}</div>
              <div className="text-slate-500 text-xs mt-1">{desc}</div>
            </motion.div>
          ))}
        </div>

        {/* Pricing teaser */}
        <motion.div {...useFadeUp(0.2)} className="mt-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-emerald-200 text-sm font-medium mb-1">Vanaf</div>
            <div className="text-4xl font-bold">
              €120<span className="text-xl font-normal text-emerald-200">/nacht</span>
            </div>
            <div className="text-emerald-200 text-sm mt-1 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" /> tot 6 personen • minimaal 2 nachten
            </div>
          </div>
          <button
            onClick={() => document.querySelector('#reserveer')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex-shrink-0 px-6 py-3 bg-amber-400 hover:bg-amber-500 text-emerald-900 font-semibold rounded-xl transition-colors duration-200 cursor-pointer shadow-lg shadow-black/10"
          >
            Beschikbaarheid controleren
          </button>
        </motion.div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Contact / Reserveer
// ---------------------------------------------------------------------------

function ContactSection() {
  const [form, setForm] = useState({ naam: '', email: '', telefoon: '', bericht: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="reserveer" className="py-24 bg-emerald-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Info */}
          <motion.div {...useFadeUp()}>
            <span className="inline-block text-emerald-600 text-sm font-semibold uppercase tracking-wider mb-3">
              Contact
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-emerald-900 mb-5 leading-snug">
              Reserveer uw verblijf in Bokrijk
            </h2>
            <p className="text-slate-600 text-base leading-relaxed mb-8">
              Stuur ons een bericht met uw gewenste data en wij bevestigen de beschikbaarheid
              zo snel mogelijk. Wij helpen u graag aan een onvergetelijke vakantie!
            </p>

            <div className="space-y-4">
              {[
                { icon: Phone, label: 'Telefoon', value: '+32 11 00 00 00' },
                { icon: Mail, label: 'E-mail', value: 'info@bokrijkvakantie.be' },
                { icon: MapPin, label: 'Adres', value: 'Bokrijklaan 1, 3600 Genk' },
                { icon: Clock, label: 'Check-in / Check-out', value: '15:00 / 11:00' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">{label}</div>
                    <div className="text-sm font-medium text-emerald-900">{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Form */}
          <motion.div {...useFadeUp(0.1)}>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8">
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                    <Send className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-bold text-emerald-900 mb-2">Bericht ontvangen!</h3>
                  <p className="text-slate-500 text-sm">
                    Bedankt voor uw interesse. Wij nemen zo snel mogelijk contact met u op.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-lg font-bold text-emerald-900 mb-2">Stuur een bericht</h3>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="naam" className="block text-xs font-medium text-slate-700 mb-1">
                        Naam *
                      </label>
                      <input
                        id="naam"
                        type="text"
                        required
                        value={form.naam}
                        onChange={(e) => setForm({ ...form, naam: e.target.value })}
                        placeholder="Jan Jansen"
                        className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow duration-200"
                      />
                    </div>
                    <div>
                      <label htmlFor="telefoon" className="block text-xs font-medium text-slate-700 mb-1">
                        Telefoon
                      </label>
                      <input
                        id="telefoon"
                        type="tel"
                        value={form.telefoon}
                        onChange={(e) => setForm({ ...form, telefoon: e.target.value })}
                        placeholder="+32 ..."
                        className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow duration-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-medium text-slate-700 mb-1">
                      E-mailadres *
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="jan@example.be"
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow duration-200"
                    />
                  </div>

                  <div>
                    <label htmlFor="bericht" className="block text-xs font-medium text-slate-700 mb-1">
                      Bericht & gewenste data *
                    </label>
                    <textarea
                      id="bericht"
                      required
                      rows={4}
                      value={form.bericht}
                      onChange={(e) => setForm({ ...form, bericht: e.target.value })}
                      placeholder="Ik zou graag verblijven van ... tot ... met ... personen."
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow duration-200 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2 text-sm"
                  >
                    <Send className="w-4 h-4" />
                    Verstuur aanvraag
                  </button>

                  <p className="text-center text-xs text-slate-400">
                    Wij reageren binnen 24 uur op uw aanvraag.
                  </p>
                </form>
              )}
            </div>
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
    <footer className="bg-emerald-900 text-emerald-200 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center">
              <TreePine className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-white text-sm">Bokrijk Vakantiewoning</span>
          </div>
          <p className="text-emerald-400 text-xs text-center">
            © {new Date().getFullYear()} Bokrijk Vakantiewoning · Bokrijklaan 1, 3600 Genk
          </p>
          <div className="flex items-center gap-1 text-amber-400 text-xs">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
            ))}
            <span className="ml-1 text-emerald-300">4.9</span>
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
  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      <Navigation />
      <Hero />
      <AboutSection />
      <VisitSection />
      <AmenitiesSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
