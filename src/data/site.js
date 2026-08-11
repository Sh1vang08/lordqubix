// Central content source for the Qubix / LORD site.
// Copy and specifications follow the approved mockups and supplied catalogue.

export const WHATSAPP_NUMBER = "918130032574";

export const whatsappLink = (message = "Hello Qubix, I would like product information.") =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

/** Real business details, matching the live site. */
export const CONTACT = {
  phone: "+91 81300 32574",
  phoneAlt: "+91 99994 69110",
  email: "qubixprofessional@gmail.com",
  emailAlt: "qubixprofessional@gmail.com",
  hours: "Mon – Sat, 10:00 AM – 7:00 PM IST",
  address: "Gurugram, Haryana, India",
};

/** Named contacts, as published on the live site. */
export const CONTACT_PEOPLE = [
  { name: "Aryan Sharma", phone: "+91 81300 32574" },
  { name: "Rajat Sharma", phone: "+91 99994 69110" },
];

export const SOCIAL = {
  instagram: "https://instagram.com/qubix_professional",
  instagramHandle: "@qubix_professional",
};

/* ----------------------------------------------------------------- images */

const img = (file) =>
  new URL(`../assets/products/${file}`, import.meta.url).href;

export const BG = {
  hero: new URL("../assets/backgrounds/hero-neon-audio-stage-1823x863.png", import.meta.url).href,
  waveform: new URL("../assets/backgrounds/audio-waveform-banner-1983x793.png", import.meta.url).href,
  grid: new URL("../assets/backgrounds/technical-wave-grid-1536x1024.png", import.meta.url).href,
  map: new URL("../assets/backgrounds/contact-map-background-1536x1024.png", import.meta.url).href,
};

export const IMG = {
  qx2000: img("amp-qx-2000.webp"),
  // The two source extractions are transposed relative to their filenames;
  // these keys follow the model printed on each unit.
  qx3500: img("amp-qx-4500.webp"),
  qx4500: img("amp-qx-3500.webp"),
  qx4800: img("amp-qx-4800.webp"),
  qx7000: img("amp-qx-7000.webp"),
  qx9000: img("amp-qx-9000.webp"),
  qx12000: img("amp-qx-12000.webp"),
  qxAlt1: img("amp-qx-alt1.webp"),
  qxAlt2: img("amp-qx-alt2.webp"),
  ca12: img("amp-ca-12.webp"),
  ca20: img("amp-ca-20.webp"),
  ca40: img("amp-ca-40.webp"),
  mt1201: img("amp-mt-1201.webp"),
  mt1601: img("amp-mt-1601.webp"),
  mt1801: img("amp-mt-1801.webp"),
  td1004: img("amp-td-1004.webp"),
  td1504: img("amp-td-1504.webp"),
  td2004: img("amp-td-2004.webp"),

  mixerSignature: img("mixer-signature-22.webp"),
  mixerZed: img("mixer-zed.webp"),
  mixerLarge: img("mixer-large.webp"),
  mixerSq8: img("mixer-sq8.webp"),
  mixerGalaxy: img("mixer-galaxy4.webp"),
  mixerCompact: img("mixer-compact.webp"),
  mixerAlt: img("mixer-alt1.webp"),

  proc1: img("proc-01.webp"),
  proc2: img("proc-02.webp"),
  proc3: img("proc-03.webp"),
  proc4: img("proc-04.webp"),
  proc5: img("proc-05.webp"),

  wirelessKmc9: img("wireless-kmc9.webp"),
  wireless1: img("wireless-01.webp"),
  wireless2: img("wireless-02.webp"),
  wireless3: img("wireless-03.webp"),
  wireless4: img("wireless-04.webp"),

  speakerSystem: img("speaker-system-qrx.webp"),
  driver1: img("driver-01.webp"),
  driver2: img("driver-02.webp"),
  driver3: img("driver-03.webp"),
  driver4: img("driver-04.webp"),
  driver5: img("driver-05.webp"),
  compression1: img("compression-01.webp"),
  compression2: img("compression-02.webp"),
  compression3: img("compression-03.webp"),
  diaphragm1: img("diaphragm-01.webp"),

  paColumn: img("pa-column.webp"),
  paAmp: img("pa-amp-dpa110.webp"),
  paAmp2: img("pa-amp-02.webp"),
  paSpeaker: img("pa-speaker-01.webp"),

  mic1: img("mic-01.webp"),
  mic2: img("mic-02.webp"),
  accessory1: img("accessory-01.webp"),
  accessory2: img("accessory-02.webp"),
  brandHero: img("brand-hero.webp"),
};

/* ------------------------------------------------------------- navigation */

export const NAV = [
  { label: "Products", to: "/products" },
  { label: "Solutions", to: "/#solutions" },
  { label: "About Us", to: "/about" },
  { label: "Support", to: "/contact" },
  { label: "Contact", to: "/contact" },
];

/* --------------------------------------------------------------- homepage */

/**
 * Hero slides. The lead slide features a real model with its published
 * figures, and links to that product's page — `product` is a catalogue slug,
 * and when present the slide uses the catalogue photograph.
 */
export const HERO_SLIDES = [
  {
    titleTop: "TD-9000",
    titleAccent: "Class D Power",
    copy: "5200W per channel at 2Ω with a damping factor of 2500. D/HD Class output, twin-fan cooling and full overload protection in a 3U chassis.",
    product: "td-9000",
    badges: ["5200W × 2 @ 2Ω", "Damping 2500", "3U · 42 Kg"],
  },
  {
    titleTop: "TD-16000",
    titleAccent: "Maximum Headroom",
    copy: "7000W per channel at 2Ω and 14000W bridged, with a damping factor of 3500. Four-fan cooling for continuous operation under load.",
    product: "td-16000",
    badges: ["7000W × 2 @ 2Ω", "Damping 3500", "3U · 54 Kg"],
  },
  {
    titleTop: "QX-16000",
    titleAccent: "High Efficiency",
    copy: "6000W per channel at 2Ω with H Class output, short-circuit and overload protection, in a rugged 3U rack chassis.",
    product: "qx-16000",
    badges: ["6000W × 2 @ 2Ω", "12000W Bridged", "H Class Output"],
  },
];

/** LORD was founded in 1987; the experience figure is derived so it never
 *  goes stale and never contradicts the About page. */
export const FOUNDED = 1987;
export const YEARS_EXPERIENCE = new Date().getFullYear() - FOUNDED;

export const STATS = [
  { icon: "badge", value: `${YEARS_EXPERIENCE}+`, label: "Years of\nExperience" },
  { icon: "box", value: "500+", label: "Products in\nOur Catalogue" },
  { icon: "globe", value: "65+", label: "Countries\nWorldwide" },
  { icon: "shield", value: "100%", label: "Quality &\nReliability" },
];

export const CATEGORIES = [
  {
    slug: "power-amplifiers",
    name: "Power Amplifiers",
    blurb: "High power. Clean output.\nBuilt to perform.",
    tagline: "Power Amplifiers",
    image: IMG.qx4500,
    count: 30,
  },
  {
    slug: "mixing-consoles",
    name: "Mixing Consoles",
    blurb: "Precision control for\nperfect sound.",
    tagline: "Professional Mixing Consoles",
    image: IMG.mixerLarge,
    count: 24,
  },
  {
    slug: "audio-processing",
    name: "Audio Processing",
    blurb: "Crossover, EQ, compressors\nand more.",
    tagline: "Crossovers & Audio Processors",
    image: IMG.proc3,
    count: 8,
  },
  {
    slug: "wireless-systems",
    name: "Wireless Systems",
    blurb: "Reliable wireless performance\nfor every stage.",
    tagline: "UHF Professional Wireless Systems",
    image: IMG.wirelessKmc9,
    count: 3,
  },
  {
    slug: "speakers-components",
    name: "Speakers & Components",
    blurb: "Powerful sound. Premium\ncomponents.",
    tagline: "Full Range Speaker Drivers",
    // Full woofer front view rather than a magnet-assembly close-up.
    image: IMG.driver3,
    count: 39,
  },
  {
    slug: "loudspeakers",
    name: "Loudspeakers",
    blurb: "Engineered for performance.\nBuilt for impact.",
    tagline: "High Performance Speaker Systems",
    // Page 33 LORD column array — a transparent cut-out, unlike the
    // page-24 speaker montage which carries an opaque studio backdrop.
    image: IMG.paColumn,
    count: 25,
  },
];

export const FEATURED = [
  {
    series: "QX SERIES",
    name: "QX-4500",
    subtitle: "Dual Channel Power Amplifier",
    copy: "4800W max power. High headroom with superior thermal stability.",
    image: IMG.qx4500,
    to: "/products/qx-4500",
  },
  {
    series: "CA SERIES",
    name: "CA-20",
    subtitle: "Dual Channel Power Amplifier",
    copy: "High efficiency amplifier for professional sound reinforcement.",
    image: IMG.ca20,
    to: "/products/ca-20",
  },
  {
    series: "MG SERIES",
    name: "MG-16XU",
    subtitle: "Line Mixing Console",
    copy: "16-channel analog mixer with built-in effects and USB.",
    image: IMG.mixerLarge,
    to: "/products/mg-16xu",
  },
  {
    series: "WIRELESS SERIES",
    name: "KMC9",
    subtitle: "Professional Wireless Microphone",
    copy: "True diversity UHF system for clear and stable performance.",
    image: IMG.wirelessKmc9,
    to: "/products/kmc9",
  },
];

/** Venue photography behind each solution card. */
const solutionBg = (file) =>
  new URL(`../assets/solutions/${file}.webp`, import.meta.url).href;

export const SOLUTIONS = [
  {
    icon: "mic",
    title: "Live Sound",
    copy: "Powerful performance for any stage.",
    tone: "stage",
    image: solutionBg("live-sound"),
  },
  {
    icon: "settings",
    title: "Installations",
    copy: "Reliable solutions for permanent setups.",
    tone: "install",
    image: solutionBg("installations"),
  },
  {
    icon: "home",
    title: "Houses of Worship",
    copy: "Clarity and coverage that inspires.",
    tone: "worship",
    image: solutionBg("houses-of-worship"),
  },
  {
    icon: "calendar",
    title: "Corporate & Events",
    copy: "Professional audio for every event.",
    tone: "events",
    image: solutionBg("corporate-events"),
  },
];

export const WHY_QUBIX = [
  {
    icon: "diamond",
    title: "Premium Quality",
    copy: "Stringent quality control ensures products that last and perform consistently.",
  },
  {
    icon: "gear",
    title: "Advanced Engineering",
    copy: "Cutting-edge design and technology for superior audio performance.",
  },
  {
    icon: "shield",
    title: "Reliable Support",
    copy: "Dedicated support and global service network you can rely on.",
  },
  {
    icon: "globe",
    title: "Global Presence",
    copy: "Trusted by professionals in over 65 countries worldwide.",
  },
];

/* --------------------------------------------------------- products page */

export const PRODUCT_FILTERS = [
  { slug: "power-amplifiers", name: "Power Amplifiers", count: 30, icon: "amp" },
  { slug: "mixing-consoles", name: "Mixing Consoles", count: 24, icon: "mixer" },
  { slug: "audio-processing", name: "Audio Processing", count: 8, icon: "wave" },
  { slug: "wireless-communication", name: "Wireless Communication", count: 3, icon: "wireless" },
  { slug: "speakers", name: "Speakers", count: 39, icon: "speaker" },
  { slug: "compression-drivers", name: "Compression Drivers", count: 12, icon: "driver" },
  { slug: "diaphragms", name: "Diaphragms", count: 12, icon: "diaphragm" },
  { slug: "connectors-crossovers", name: "Connectors & Crossovers", count: 9, icon: "connector" },
  { slug: "pa-systems", name: "PA Systems", count: 25, icon: "pa" },
  { slug: "microphones", name: "Microphones", count: 7, icon: "mic" },
];

export const PRODUCTS = [
  { id: "qubix-qx-series-qx-10000", brand: "Qubix", name: "QX-10000", subtitle: "Power Amplifiers", category: "power-amplifiers", image: IMG.qx2000, to: "/products/qx-10000" },
  { id: "qubix-qx-series-qx-12000", brand: "Qubix", name: "QX-12000", subtitle: "Power Amplifiers", category: "power-amplifiers", image: IMG.qx3500, to: "/products/qx-12000" },
  { id: "qubix-qx-series-qx-16000", brand: "Qubix", name: "QX-16000", subtitle: "Power Amplifiers", category: "power-amplifiers", image: IMG.qx4500, to: "/products/qx-16000" },
  { id: "qubix-qx-series-qx-2000", brand: "Qubix", name: "QX-2000", subtitle: "Power Amplifiers", category: "power-amplifiers", image: IMG.qx4800, to: "/products/qx-2000" },
  { id: "qubix-qx-series-qx-3500", brand: "Qubix", name: "QX-3500", subtitle: "Power Amplifiers", category: "power-amplifiers", image: IMG.qx7000, to: "/products/qx-3500" },
  { id: "qubix-qx-series-qx-4500", brand: "Qubix", name: "QX-4500", subtitle: "Power Amplifiers", category: "power-amplifiers", image: IMG.qx9000, to: "/products/qx-4500" },
  { id: "qubix-qx-series-qx-4800", brand: "Qubix", name: "QX-4800", subtitle: "Power Amplifiers", category: "power-amplifiers", image: IMG.qx12000, to: "/products/qx-4800" },
  { id: "qubix-qx-series-qx-6000", brand: "Qubix", name: "QX-6000", subtitle: "Power Amplifiers", category: "power-amplifiers", image: IMG.qxAlt1, to: "/products/qx-6000" },
  { id: "qubix-qx-series-qx-8000", brand: "Qubix", name: "QX-8000", subtitle: "Power Amplifiers", category: "power-amplifiers", image: IMG.qxAlt2, to: "/products/qx-8000" },
  { id: "qubix-ca-series-ca-12", brand: "Qubix", name: "CA-12", subtitle: "Power Amplifiers", category: "power-amplifiers", image: IMG.ca12, to: "/products/ca-12" },
  { id: "qubix-ca-series-ca-20", brand: "Qubix", name: "CA-20", subtitle: "Power Amplifiers", category: "power-amplifiers", image: IMG.ca20, to: "/products/ca-20" },
  { id: "qubix-ca-series-ca-40", brand: "Qubix", name: "CA-40", subtitle: "Power Amplifiers", category: "power-amplifiers", image: IMG.ca40, to: "/products/ca-40" },
  { id: "qubix-mt-series-mt-1201", brand: "Qubix", name: "MT-1201", subtitle: "Power Amplifiers", category: "power-amplifiers", image: IMG.mt1201, to: "/products/mt-1201" },
  { id: "qubix-mt-series-mt-1601", brand: "Qubix", name: "MT-1601", subtitle: "Power Amplifiers", category: "power-amplifiers", image: IMG.mt1601, to: "/products/mt-1601" },
  { id: "qubix-mt-series-mt-1801", brand: "Qubix", name: "MT-1801", subtitle: "Power Amplifiers", category: "power-amplifiers", image: IMG.mt1801, to: "/products/mt-1801" },
  { id: "qubix-mt-series-mt-26000", brand: "Qubix", name: "MT-26000", subtitle: "Power Amplifiers", category: "power-amplifiers", image: IMG.mt1201, to: "/products/mt-26000" },
  { id: "qubix-td-series-td-16000", brand: "Qubix", name: "TD-16000", subtitle: "Power Amplifiers", category: "power-amplifiers", image: IMG.td1004, to: "/products/td-16000" },
  { id: "qubix-td-series-td-9000", brand: "Qubix", name: "TD-9000", subtitle: "Power Amplifiers", category: "power-amplifiers", image: IMG.td1504, to: "/products/td-9000" },
  { id: "qubix-mg-series-mg-10xu", brand: "Qubix", name: "MG-10XU", subtitle: "Mixing Consoles", category: "mixing-consoles", image: IMG.mixerLarge },
  { id: "qubix-mg-series-mg-16xu", brand: "Qubix", name: "MG-16XU", subtitle: "Mixing Consoles", category: "mixing-consoles", image: IMG.mixerSignature },
  { id: "qubix-mg-series-mg-24-14fx", brand: "Qubix", name: "MG-24/14FX", subtitle: "Mixing Consoles", category: "mixing-consoles", image: IMG.mixerLarge },
  { id: "qubix-mg-series-mg-32-14fx", brand: "Qubix", name: "MG-32/14FX", subtitle: "Mixing Consoles", category: "mixing-consoles", image: IMG.mixerSignature },
  { id: "qubix-s-zed-series-s-16", brand: "Qubix", name: "S-16", subtitle: "Mixing Consoles", category: "mixing-consoles", image: IMG.mixerZed },
  { id: "qubix-s-zed-series-s-22", brand: "Qubix", name: "S-22", subtitle: "Mixing Consoles", category: "mixing-consoles", image: IMG.mixerAlt },
  { id: "qubix-s-zed-series-zed-22", brand: "Qubix", name: "ZED-22", subtitle: "Mixing Consoles", category: "mixing-consoles", image: IMG.mixerZed },
  { id: "qubix-qas-series-qas-1210", brand: "Qubix", name: "QAS-1210", subtitle: "Audio Processing", category: "audio-processing", image: IMG.proc1 },
  { id: "qubix-qas-series-qas-1610", brand: "Qubix", name: "QAS-1610", subtitle: "Audio Processing", category: "audio-processing", image: IMG.proc2 },
  { id: "qubix-qas-series-qas-810", brand: "Qubix", name: "QAS-810", subtitle: "Audio Processing", category: "audio-processing", image: IMG.proc3 },
  { id: "qubix-efx-sq-series-efx-12", brand: "Qubix", name: "EFX-12", subtitle: "Mixing Consoles", category: "mixing-consoles", image: IMG.mixerSq8 },
  { id: "qubix-efx-sq-series-efx-8", brand: "Qubix", name: "EFX-8", subtitle: "Mixing Consoles", category: "mixing-consoles", image: IMG.mixerCompact },
  { id: "qubix-efx-sq-series-sq-4", brand: "Qubix", name: "SQ-4", subtitle: "Mixing Consoles", category: "mixing-consoles", image: IMG.mixerSq8 },
  { id: "qubix-efx-sq-series-sq-8", brand: "Qubix", name: "SQ-8", subtitle: "Mixing Consoles", category: "mixing-consoles", image: IMG.mixerCompact },
  { id: "qubix-dj-mixer-ddj3usb", brand: "Qubix", name: "DDJ3USB", subtitle: "DJ Mixers", category: "mixing-consoles", image: IMG.mixerGalaxy },
  { id: "qubix-dj-mixer-ddj6ebmp3", brand: "Qubix", name: "DDJ6EBMP3", subtitle: "DJ Mixers", category: "mixing-consoles", image: IMG.mixerSq8 },
  { id: "qubix-dj-mixer-galaxy4", brand: "Qubix", name: "GALAXY4", subtitle: "DJ Mixers", category: "mixing-consoles", image: IMG.mixerGalaxy },
  { id: "qubix-dj-mixer-m4", brand: "Qubix", name: "M4", subtitle: "DJ Mixers", category: "mixing-consoles", image: IMG.mixerSq8 },
  { id: "qubix-dj-mixer-m6usb", brand: "Qubix", name: "M6USB", subtitle: "DJ Mixers", category: "mixing-consoles", image: IMG.mixerGalaxy },
  { id: "qubix-dj-mixer-mx300usb", brand: "Qubix", name: "MX300USB", subtitle: "DJ Mixers", category: "mixing-consoles", image: IMG.mixerSq8 },
  { id: "qubix-audio-series-equipments-2310crossover", brand: "Qubix", name: "2310CROSSOVER", subtitle: "Audio Processing", category: "audio-processing", image: IMG.proc1 },
  { id: "qubix-audio-series-equipments-231equalizer", brand: "Qubix", name: "231EQUALIZER", subtitle: "Audio Processing", category: "audio-processing", image: IMG.proc2 },
  { id: "qubix-audio-series-equipments-234xl", brand: "Qubix", name: "234XL", subtitle: "Audio Processing", category: "audio-processing", image: IMG.proc3 },
  { id: "qubix-audio-series-equipments-driverack260", brand: "Qubix", name: "DRIVERACK260", subtitle: "Audio Processing", category: "audio-processing", image: IMG.proc4 },
  { id: "qubix-audio-series-equipments-qy6000", brand: "Qubix", name: "QY6000", subtitle: "Audio Processing", category: "audio-processing", image: IMG.proc5 },
  { id: "qubix-wireless-communication-kmc9", brand: "Qubix", name: "KMC9", subtitle: "Wireless Systems", category: "wireless-communication", image: IMG.wirelessKmc9 },
  { id: "qubix-wireless-communication-skm9000", brand: "Qubix", name: "SKM9000", subtitle: "Wireless Systems", category: "wireless-communication", image: IMG.wireless1 },
  { id: "qubix-wireless-communication-tft-200plus", brand: "Qubix", name: "TFT-200PLUS", subtitle: "Wireless Systems", category: "wireless-communication", image: IMG.wireless2 },
  { id: "qubix-speaker-10ndl76", brand: "Qubix", name: "10NDL76", subtitle: "Speaker Drivers", category: "speakers", image: IMG.driver1 },
  { id: "qubix-speaker-12ndl100", brand: "Qubix", name: "12NDL100", subtitle: "Speaker Drivers", category: "speakers", image: IMG.driver2 },
  { id: "qubix-speaker-12ndl76", brand: "Qubix", name: "12NDL76", subtitle: "Speaker Drivers", category: "speakers", image: IMG.driver3 },
  { id: "qubix-speaker-15bh300", brand: "Qubix", name: "15BH300", subtitle: "Speaker Drivers", category: "speakers", image: IMG.driver4 },
  { id: "qubix-speaker-15bh350", brand: "Qubix", name: "15BH350", subtitle: "Speaker Drivers", category: "speakers", image: IMG.driver5 },
  { id: "qubix-speaker-15pd60", brand: "Qubix", name: "15PD60", subtitle: "Speaker Drivers", category: "speakers", image: IMG.driver1 },
  { id: "qubix-speaker-15qh40dm", brand: "Qubix", name: "15QH40DM", subtitle: "Speaker Drivers", category: "speakers", image: IMG.driver2 },
  { id: "qubix-speaker-18bh451", brand: "Qubix", name: "18BH451", subtitle: "Speaker Drivers", category: "speakers", image: IMG.driver3 },
  { id: "qubix-speaker-18pd52", brand: "Qubix", name: "18PD52", subtitle: "Speaker Drivers", category: "speakers", image: IMG.driver4 },
  { id: "qubix-speaker-18pd60", brand: "Qubix", name: "18PD60", subtitle: "Speaker Drivers", category: "speakers", image: IMG.driver5 },
  { id: "qubix-speaker-18qh50dm", brand: "Qubix", name: "18QH50DM", subtitle: "Speaker Drivers", category: "speakers", image: IMG.driver1 },
  { id: "qubix-speaker-21pd60", brand: "Qubix", name: "21PD60", subtitle: "Speaker Drivers", category: "speakers", image: IMG.driver2 },
  { id: "qubix-speaker-21pd60dm", brand: "Qubix", name: "21PD60DM", subtitle: "Speaker Drivers", category: "speakers", image: IMG.driver3 },
  { id: "qubix-compression-driver-37-vrx", brand: "Qubix", name: "37-VRX", subtitle: "Compression Drivers", category: "compression-drivers", image: IMG.compression1 },
  { id: "qubix-compression-driver-ct-450p", brand: "Qubix", name: "CT-450P", subtitle: "Compression Drivers", category: "compression-drivers", image: IMG.compression2 },
  { id: "qubix-compression-driver-ct-550p", brand: "Qubix", name: "CT-550P", subtitle: "Compression Drivers", category: "compression-drivers", image: IMG.compression3 },
  { id: "qubix-compression-driver-ct-750", brand: "Qubix", name: "CT-750", subtitle: "Compression Drivers", category: "compression-drivers", image: IMG.compression1 },
  { id: "qubix-compression-driver-ct-850", brand: "Qubix", name: "CT-850", subtitle: "Compression Drivers", category: "compression-drivers", image: IMG.compression2 },
  { id: "qubix-compression-driver-ct-950", brand: "Qubix", name: "CT-950", subtitle: "Compression Drivers", category: "compression-drivers", image: IMG.compression3 },
  { id: "qubix-compression-driver-d-2", brand: "Qubix", name: "D-2", subtitle: "Compression Drivers", category: "compression-drivers", image: IMG.compression1 },
  { id: "qubix-compression-driver-d-26", brand: "Qubix", name: "D-26", subtitle: "Compression Drivers", category: "compression-drivers", image: IMG.compression2 },
  { id: "qubix-compression-driver-qb-2880", brand: "Qubix", name: "QB-2880", subtitle: "Compression Drivers", category: "compression-drivers", image: IMG.compression3 },
  { id: "qubix-compression-driver-qs-4599", brand: "Qubix", name: "QS-4599", subtitle: "Compression Drivers", category: "compression-drivers", image: IMG.compression1 },
  { id: "qubix-compression-driver-qs-650", brand: "Qubix", name: "QS-650", subtitle: "Compression Drivers", category: "compression-drivers", image: IMG.compression2 },
  { id: "qubix-compression-driver-qs-880", brand: "Qubix", name: "QS-880", subtitle: "Compression Drivers", category: "compression-drivers", image: IMG.compression3 },
  { id: "qubix-diaphragms-ct-750diaphragm", brand: "Qubix", name: "CT-750DIAPHRAGM", subtitle: "Diaphragms", category: "diaphragms", image: IMG.diaphragm1 },
  { id: "qubix-diaphragms-ct-850diaphragm", brand: "Qubix", name: "CT-850DIAPHRAGM", subtitle: "Diaphragms", category: "diaphragms", image: IMG.compression3 },
  { id: "qubix-diaphragms-ct-950diaphragm", brand: "Qubix", name: "CT-950DIAPHRAGM", subtitle: "Diaphragms", category: "diaphragms", image: IMG.compression2 },
  { id: "qubix-diaphragms-d-26diaphragm", brand: "Qubix", name: "D-26DIAPHRAGM", subtitle: "Diaphragms", category: "diaphragms", image: IMG.diaphragm1 },
  { id: "qubix-diaphragms-d-2diaphragm", brand: "Qubix", name: "D-2DIAPHRAGM", subtitle: "Diaphragms", category: "diaphragms", image: IMG.compression3 },
  { id: "qubix-diaphragms-d-450-blue", brand: "Qubix", name: "D-450(BLUE)", subtitle: "Diaphragms", category: "diaphragms", image: IMG.compression2 },
  { id: "qubix-diaphragms-d-450-silver", brand: "Qubix", name: "D-450(SILVER)", subtitle: "Diaphragms", category: "diaphragms", image: IMG.diaphragm1 },
  { id: "qubix-diaphragms-d-520-blue", brand: "Qubix", name: "D-520(BLUE)", subtitle: "Diaphragms", category: "diaphragms", image: IMG.compression3 },
  { id: "qubix-diaphragms-d-520-silver", brand: "Qubix", name: "D-520(SILVER)", subtitle: "Diaphragms", category: "diaphragms", image: IMG.compression2 },
  { id: "qubix-diaphragms-d-750-flatwire", brand: "Qubix", name: "D-750(FLATWIRE)", subtitle: "Diaphragms", category: "diaphragms", image: IMG.diaphragm1 },
  { id: "qubix-diaphragms-d-750-roundwire", brand: "Qubix", name: "D-750(ROUNDWIRE)", subtitle: "Diaphragms", category: "diaphragms", image: IMG.compression3 },
  { id: "qubix-diaphragms-mid-4599", brand: "Qubix", name: "MID-4599", subtitle: "Diaphragms", category: "diaphragms", image: IMG.compression2 },
  { id: "qubix-connector-crossover-line-array-d4599crossover", brand: "Qubix", name: "D4599CROSSOVER", subtitle: "Connectors & Crossovers", category: "connectors-crossovers", image: IMG.accessory1 },
  { id: "qubix-connector-crossover-line-array-g15-450", brand: "Qubix", name: "G15-450", subtitle: "Connectors & Crossovers", category: "connectors-crossovers", image: IMG.accessory2 },
  { id: "qubix-connector-crossover-line-array-g15-750", brand: "Qubix", name: "G15-750", subtitle: "Connectors & Crossovers", category: "connectors-crossovers", image: IMG.accessory1 },
  { id: "qubix-connector-crossover-line-array-p-38", brand: "Qubix", name: "P-38", subtitle: "Connectors & Crossovers", category: "connectors-crossovers", image: IMG.accessory2 },
  { id: "qubix-connector-crossover-line-array-socket", brand: "Qubix", name: "SOCKET", subtitle: "Connectors & Crossovers", category: "connectors-crossovers", image: IMG.accessory1 },
  { id: "qubix-connector-crossover-line-array-spcone", brand: "Qubix", name: "SPCONE", subtitle: "Connectors & Crossovers", category: "connectors-crossovers", image: IMG.accessory2 },
  { id: "qubix-connector-crossover-line-array-stereojack", brand: "Qubix", name: "STEREOJACK", subtitle: "Connectors & Crossovers", category: "connectors-crossovers", image: IMG.accessory1 },
  { id: "qubix-connector-crossover-line-array-xlr-f", brand: "Qubix", name: "XLR-F", subtitle: "Connectors & Crossovers", category: "connectors-crossovers", image: IMG.accessory2 },
  { id: "qubix-connector-crossover-line-array-xlr-m", brand: "Qubix", name: "XLR-M", subtitle: "Connectors & Crossovers", category: "connectors-crossovers", image: IMG.accessory1 },
  { id: "qubix-full-range-super-high-power-speaker-qrx-700", brand: "Qubix", name: "QRX-700", subtitle: "Full Range Speakers", category: "pa-systems", image: IMG.paSpeaker },
  { id: "qubix-full-range-super-high-power-speaker-vrx-932500watt", brand: "Qubix", name: "VRX-932500WATT", subtitle: "Full Range Speakers", category: "pa-systems", image: IMG.speakerSystem },
  { id: "speaker-10lm50", brand: "LORD", name: "10LM50", subtitle: "Speaker Drivers", category: "speakers", image: IMG.driver1 },
  { id: "speaker-12lm30-40", brand: "LORD", name: "12LM30/40", subtitle: "Speaker Drivers", category: "speakers", image: IMG.driver2 },
  { id: "speaker-12lm50", brand: "LORD", name: "12LM50", subtitle: "Speaker Drivers", category: "speakers", image: IMG.driver3 },
  { id: "speaker-12lm60", brand: "LORD", name: "12LM60", subtitle: "Speaker Drivers", category: "speakers", image: IMG.driver4 },
  { id: "speaker-15lm01", brand: "LORD", name: "15LM01", subtitle: "Speaker Drivers", category: "speakers", image: IMG.driver5 },
  { id: "speaker-15lm02", brand: "LORD", name: "15LM02", subtitle: "Speaker Drivers", category: "speakers", image: IMG.driver1 },
  { id: "speaker-15lm03", brand: "LORD", name: "15LM03", subtitle: "Speaker Drivers", category: "speakers", image: IMG.driver2 },
  { id: "speaker-15lm04", brand: "LORD", name: "15LM04", subtitle: "Speaker Drivers", category: "speakers", image: IMG.driver3 },
  { id: "speaker-15lm05", brand: "LORD", name: "15LM05", subtitle: "Speaker Drivers", category: "speakers", image: IMG.driver4 },
  { id: "speaker-15lm06", brand: "LORD", name: "15LM06", subtitle: "Speaker Drivers", category: "speakers", image: IMG.driver5 },
  { id: "speaker-15lm07", brand: "LORD", name: "15LM07", subtitle: "Speaker Drivers", category: "speakers", image: IMG.driver1 },
  { id: "speaker-15lm08", brand: "LORD", name: "15LM08", subtitle: "Speaker Drivers", category: "speakers", image: IMG.driver2 },
  { id: "speaker-18lm06", brand: "LORD", name: "18LM06", subtitle: "Speaker Drivers", category: "speakers", image: IMG.driver3 },
  { id: "speaker-18lm451", brand: "LORD", name: "18LM451", subtitle: "Speaker Drivers", category: "speakers", image: IMG.driver4 },
  { id: "speaker-18pd52", brand: "LORD", name: "18PD52", subtitle: "Speaker Drivers", category: "speakers", image: IMG.driver5 },
  { id: "lord-power-amplifiers-dj1200", brand: "LORD", name: "DJ1200", subtitle: "Power Amplifiers", category: "power-amplifiers", image: IMG.paAmp, to: "/products/dj1200" },
  { id: "lord-power-amplifiers-dj1600", brand: "LORD", name: "DJ1600", subtitle: "Power Amplifiers", category: "power-amplifiers", image: IMG.paAmp2, to: "/products/dj1600" },
  { id: "lord-power-amplifiers-dj2500", brand: "LORD", name: "DJ2500", subtitle: "Power Amplifiers", category: "power-amplifiers", image: IMG.paAmp, to: "/products/dj2500" },
  { id: "lord-power-amplifiers-dj3600", brand: "LORD", name: "DJ3600", subtitle: "Power Amplifiers", category: "power-amplifiers", image: IMG.paAmp2, to: "/products/dj3600" },
  { id: "lord-power-amplifiers-dj4000", brand: "LORD", name: "DJ4000", subtitle: "Power Amplifiers", category: "power-amplifiers", image: IMG.paAmp, to: "/products/dj4000" },
  { id: "lord-power-amplifiers-hd5002", brand: "LORD", name: "HD5002", subtitle: "Power Amplifiers", category: "power-amplifiers", image: IMG.paAmp2, to: "/products/hd5002" },
  { id: "lord-power-amplifiers-mt3500", brand: "LORD", name: "MT3500", subtitle: "Power Amplifiers", category: "power-amplifiers", image: IMG.paAmp, to: "/products/mt3500" },
  { id: "lord-power-amplifiers-mt4500", brand: "LORD", name: "MT4500", subtitle: "Power Amplifiers", category: "power-amplifiers", image: IMG.paAmp2, to: "/products/mt4500" },
  { id: "lord-power-amplifiers-pbt501", brand: "LORD", name: "PBT501", subtitle: "Power Amplifiers", category: "power-amplifiers", image: IMG.paAmp, to: "/products/pbt501" },
  { id: "lord-power-amplifiers-pbt701", brand: "LORD", name: "PBT701", subtitle: "Power Amplifiers", category: "power-amplifiers", image: IMG.paAmp2, to: "/products/pbt701" },
  { id: "lord-power-amplifiers-ssa350", brand: "LORD", name: "SSA350", subtitle: "Power Amplifiers", category: "power-amplifiers", image: IMG.paAmp, to: "/products/ssa350" },
  { id: "lord-power-amplifiers-ssa6500", brand: "LORD", name: "SSA6500", subtitle: "Power Amplifiers", category: "power-amplifiers", image: IMG.paAmp2, to: "/products/ssa6500" },
  { id: "lord-two-zone-pa-amplifier-tza1200", brand: "LORD", name: "TZA1200", subtitle: "Two Zone PA Amplifiers", category: "pa-systems", image: IMG.paAmp2 },
  { id: "lord-two-zone-pa-amplifier-tza1500p", brand: "LORD", name: "TZA1500P", subtitle: "Two Zone PA Amplifiers", category: "pa-systems", image: IMG.paAmp },
  { id: "lord-two-zone-pa-amplifier-tza2500", brand: "LORD", name: "TZA2500", subtitle: "Two Zone PA Amplifiers", category: "pa-systems", image: IMG.paAmp2 },
  { id: "lord-two-zone-pa-amplifier-tza4000usb", brand: "LORD", name: "TZA4000USB", subtitle: "Two Zone PA Amplifiers", category: "pa-systems", image: IMG.paAmp },
  { id: "lord-two-zone-pa-amplifier-tza5000usb", brand: "LORD", name: "TZA5000USB", subtitle: "Two Zone PA Amplifiers", category: "pa-systems", image: IMG.paAmp2 },
  { id: "lord-two-zone-pa-amplifier-tza7000", brand: "LORD", name: "TZA7000", subtitle: "Two Zone PA Amplifiers", category: "pa-systems", image: IMG.paAmp },
  { id: "lord-pa-amplifier-dp475", brand: "LORD", name: "DP475", subtitle: "PA Amplifiers", category: "pa-systems", image: IMG.paAmp },
  { id: "lord-pa-amplifier-dp60", brand: "LORD", name: "DP60", subtitle: "PA Amplifiers", category: "pa-systems", image: IMG.paAmp2 },
  { id: "lord-pa-amplifier-dpa110", brand: "LORD", name: "DPA110", subtitle: "PA Amplifiers", category: "pa-systems", image: IMG.paAmp },
  { id: "lord-pa-amplifier-dpa1250", brand: "LORD", name: "DPA1250", subtitle: "PA Amplifiers", category: "pa-systems", image: IMG.paAmp2 },
  { id: "lord-pa-amplifier-dpa1800", brand: "LORD", name: "DPA1800", subtitle: "PA Amplifiers", category: "pa-systems", image: IMG.paAmp },
  { id: "lord-pa-amplifier-dpa40", brand: "LORD", name: "DPA40", subtitle: "PA Amplifiers", category: "pa-systems", image: IMG.paAmp2 },
  { id: "lord-pa-amplifier-dpa570", brand: "LORD", name: "DPA570", subtitle: "PA Amplifiers", category: "pa-systems", image: IMG.paAmp },
  { id: "lord-pa-amplifier-dpa770", brand: "LORD", name: "DPA770", subtitle: "PA Amplifiers", category: "pa-systems", image: IMG.paAmp2 },
  { id: "lord-pa-amplifier-ssa160", brand: "LORD", name: "SSA160", subtitle: "PA Amplifiers", category: "pa-systems", image: IMG.paAmp },
  { id: "lord-pa-amplifier-ssa300bt", brand: "LORD", name: "SSA300BT", subtitle: "PA Amplifiers", category: "pa-systems", image: IMG.paAmp2 },
  { id: "lord-pa-audio-mixing-consoles-12channel", brand: "LORD", name: "12CHANNEL", subtitle: "Mixing Consoles", category: "mixing-consoles", image: IMG.mixerCompact },
  { id: "lord-pa-audio-mixing-consoles-16channel", brand: "LORD", name: "16CHANNEL", subtitle: "Mixing Consoles", category: "mixing-consoles", image: IMG.mixerAlt },
  { id: "lord-pa-audio-mixing-consoles-6channel", brand: "LORD", name: "6CHANNEL", subtitle: "Mixing Consoles", category: "mixing-consoles", image: IMG.mixerCompact },
  { id: "lord-pa-audio-mixing-consoles-8channel", brand: "LORD", name: "8CHANNEL", subtitle: "Mixing Consoles", category: "mixing-consoles", image: IMG.mixerAlt },
  { id: "lord-pa-audio-mixing-consoles-9channel", brand: "LORD", name: "9CHANNEL", subtitle: "Mixing Consoles", category: "mixing-consoles", image: IMG.mixerCompact },
  { id: "lord-pa-audio-mixing-consoles-mx626-usb", brand: "LORD", name: "MX626(USB)", subtitle: "Mixing Consoles", category: "mixing-consoles", image: IMG.mixerAlt },
  { id: "lord-pa-audio-mixing-consoles-um6", brand: "LORD", name: "UM6", subtitle: "Mixing Consoles", category: "mixing-consoles", image: IMG.mixerCompact },
  { id: "lord-crossover-pa-column-1000watt-500-500-450h-f", brand: "LORD", name: "1000WATT(500+500+450H.F.)", subtitle: "PA Columns & Crossovers", category: "pa-systems", image: IMG.paColumn },
  { id: "lord-crossover-pa-column-column-600-600-750-h-f", brand: "LORD", name: "COLUMN(600+600+750)H.F", subtitle: "PA Columns & Crossovers", category: "pa-systems", image: IMG.paSpeaker },
  { id: "lord-crossover-pa-column-d26", brand: "LORD", name: "D26", subtitle: "PA Columns & Crossovers", category: "pa-systems", image: IMG.paColumn },
  { id: "lord-crossover-pa-column-d450", brand: "LORD", name: "D450", subtitle: "PA Columns & Crossovers", category: "pa-systems", image: IMG.paSpeaker },
  { id: "lord-crossover-pa-column-d518", brand: "LORD", name: "D518", subtitle: "PA Columns & Crossovers", category: "pa-systems", image: IMG.paColumn },
  { id: "lord-crossover-pa-column-d850", brand: "LORD", name: "D850", subtitle: "PA Columns & Crossovers", category: "pa-systems", image: IMG.paSpeaker },
  { id: "lord-crossover-pa-column-linearrayspeaker-600-600-2x750", brand: "LORD", name: "LINEARRAYSPEAKER(600+600+2X750)", subtitle: "PA Columns & Crossovers", category: "pa-systems", image: IMG.paColumn },
  { id: "lord-pa-microphone-am-9455xlr", brand: "LORD", name: "AM-9455XLR", subtitle: "Microphones", category: "microphones", image: IMG.mic1 },
  { id: "lord-pa-microphone-lud1000xlr", brand: "LORD", name: "LUD1000XLR", subtitle: "Microphones", category: "microphones", image: IMG.mic2 },
  { id: "lord-pa-microphone-lud100xlr", brand: "LORD", name: "LUD100XLR", subtitle: "Microphones", category: "microphones", image: IMG.mic1 },
  { id: "lord-pa-microphone-lud101xlr", brand: "LORD", name: "LUD101XLR", subtitle: "Microphones", category: "microphones", image: IMG.mic2 },
  { id: "lord-pa-microphone-lud580xlr", brand: "LORD", name: "LUD580XLR", subtitle: "Microphones", category: "microphones", image: IMG.mic1 },
  { id: "lord-pa-microphone-lud99xlr", brand: "LORD", name: "LUD99XLR", subtitle: "Microphones", category: "microphones", image: IMG.mic2 },
  { id: "lord-pa-microphone-microphoneclamp", brand: "LORD", name: "MICROPHONECLAMP", subtitle: "Microphones", category: "microphones", image: IMG.mic1 },
  { id: "lord-pa-driver-unit-lduf55xt", brand: "LORD", name: "LDUF55XT", subtitle: "Driver Units", category: "speakers", image: IMG.driver1 },
  { id: "lord-pa-driver-unit-lduf80xt", brand: "LORD", name: "LDUF80XT", subtitle: "Driver Units", category: "speakers", image: IMG.driver2 },
  { id: "lord-pa-driver-unit-lfm100", brand: "LORD", name: "LFM100", subtitle: "Driver Units", category: "speakers", image: IMG.driver3 },
  { id: "lord-pa-driver-unit-lfm40", brand: "LORD", name: "LFM40", subtitle: "Driver Units", category: "speakers", image: IMG.driver4 },
  { id: "lord-pa-driver-unit-lfm50", brand: "LORD", name: "LFM50", subtitle: "Driver Units", category: "speakers", image: IMG.driver5 },
  { id: "lord-pa-driver-unit-lfm55", brand: "LORD", name: "LFM55", subtitle: "Driver Units", category: "speakers", image: IMG.driver1 },
  { id: "lord-pa-driver-unit-lfm60", brand: "LORD", name: "LFM60", subtitle: "Driver Units", category: "speakers", image: IMG.driver2 },
  { id: "lord-pa-driver-unit-lfm75", brand: "LORD", name: "LFM75", subtitle: "Driver Units", category: "speakers", image: IMG.driver3 },
  { id: "lord-pa-driver-unit-lu100", brand: "LORD", name: "LU100", subtitle: "Driver Units", category: "speakers", image: IMG.driver4 },
  { id: "lord-pa-driver-unit-lu50", brand: "LORD", name: "LU50", subtitle: "Driver Units", category: "speakers", image: IMG.driver5 },
  { id: "lord-pa-driver-unit-lu60", brand: "LORD", name: "LU60", subtitle: "Driver Units", category: "speakers", image: IMG.driver1 },
];

/* ------------------------------------------------ power amplifier category */

export const AMP_SERIES = [
  {
    key: "qx",
    name: "QX SERIES",
    tag: "High Efficiency",
    blurb: "Balanced power with high efficiency and stability.",
    accent: "var(--gold-500)",
    thumb: IMG.qx4800,
    models: [
      { name: "QX-2000", image: IMG.qx2000 },
      { name: "QX-3500", image: IMG.qx3500 },
      { name: "QX-4500", image: IMG.qx4500 },
      { name: "QX-4800", image: IMG.qx4800 },
      { name: "QX-12000", image: IMG.qx12000 },
    ],
  },
  {
    key: "ca",
    name: "CA SERIES",
    tag: "High Headroom",
    blurb: "High headroom performance for demanding applications.",
    accent: "var(--blue-600)",
    thumb: IMG.ca20,
    // Model names match the live Qubix catalogue.
    models: [
      { name: "CA-12", image: IMG.ca40 },
      { name: "CA-20", image: IMG.ca20 },
      { name: "CA-40", image: IMG.ca12 },
    ],
  },
  {
    key: "mt",
    name: "MT SERIES",
    tag: "High Power",
    blurb: "Maximum power with rugged reliability.",
    accent: "var(--gold-500)",
    thumb: IMG.mt1801,
    models: [
      { name: "MT-1201", image: IMG.mt1601 },
      { name: "MT-1801", image: IMG.mt1801 },
      { name: "MT-26000", image: IMG.mt1201 },
    ],
  },
  {
    key: "td",
    name: "TD SERIES",
    tag: "Class D Technology",
    blurb: "Lightweight Class D power with superior efficiency.",
    accent: "var(--gold-500)",
    thumb: IMG.td2004,
    models: [
      { name: "TD-9000", image: IMG.td2004 },
      { name: "TD-16000", image: IMG.td1504 },
    ],
  },
];

export const AMP_HERO_BADGES = [
  { icon: "bolt", title: "High Power", copy: "Up to 8200W\nPer Channel" },
  { icon: "shield", title: "Built to Protect", copy: "Reliable in every\ncondition" },
  { icon: "wave", title: "Clean & Stable", copy: "Professional\nsound quality" },
];

export const AMP_STATS = [
  { icon: "bolt", value: "16+", label: "Models", sub: "Across Series" },
  { icon: "shield", value: "4", label: "Series", sub: "To Choose" },
  { icon: "wave", value: "Professional", label: "Power You Can", sub: "Rely On", wide: true },
];

export const AMP_APPLICATIONS = [
  {
    icon: "music",
    title: "Live Sound",
    copy: "High power and reliability for live performances.",
    tone: "live",
  },
  {
    icon: "building",
    title: "Fixed Installations",
    copy: "Consistent performance for venues and installations.",
    tone: "install",
  },
  {
    icon: "calendar",
    title: "Touring & Events",
    copy: "Rugged, dependable power for every event.",
    tone: "touring",
  },
];

export const HOW_TO_CHOOSE = [
  { n: 1, icon: "bolt", title: "Calculate Power", copy: "Determine total power based on your speakers." },
  { n: 2, icon: "sliders", title: "Select Configuration", copy: "Choose 2Ω / 4Ω / 8Ω mode for your setup." },
  { n: 3, icon: "shield", title: "Check Protection", copy: "Ensure advanced protection for safe performance." },
  { n: 4, icon: "fan", title: "Ensure Cooling", copy: "Proper ventilation for long-lasting reliability." },
];

/* ---------------------------------------------------- QX product detail */

export const QX_PRODUCT = {
  brand: "Qubix",
  title: "QX Series Dual Channel Power Amplifier",
  intro:
    "Professional dual channel power amplifiers engineered for reliability, efficiency and superior audio performance in touring, installations and fixed sound applications.",
  models: ["QX-2000", "QX-3500", "QX-4500"],
  highlights: [
    "Dual channel design for maximum flexibility",
    "High efficiency power output with stable performance",
    "Advanced protection: Short circuit, DC, Overload, AC protection",
    "H Class output circuitry for clean and powerful sound",
    "LED indicators and front panel level controls",
    "Rugged build for demanding environments",
  ],
  gallery: [IMG.qx4500, IMG.qx3500, IMG.qx2000, IMG.qx4800],
  pillars: [
    {
      icon: "shield",
      title: "Built to Perform",
      copy: "Reliable, road-ready design for continuous operation in harsh conditions.",
    },
    {
      icon: "wave",
      title: "Powerful & Efficient",
      copy: "High output with H Class circuitry delivers clean audio with excellent efficiency.",
    },
    {
      icon: "check-shield",
      title: "Protected & Safe",
      copy: "Comprehensive protection ensures safety for equipment and performance.",
    },
    {
      icon: "sliders",
      title: "Flexible & Versatile",
      copy: "Dual channel configuration suitable for a wide range of applications.",
    },
  ],
  designCopy:
    "The QX Series is built with high-efficiency components, advanced protection and intelligent cooling to deliver consistent performance across all conditions.",
  designPoints: [
    "Dual channel output for versatile setups",
    "High signal-to-noise ratio for clear, dynamic audio",
    "Intelligent thermal management with dual fans",
    "LED status indicators for signal, clip, protect and power",
    "Balanced XLR inputs & Speakon outputs",
    "Robust construction with front handle for easy rack mounting",
  ],
  designImage: IMG.qxAlt2,
  specs: {
    columns: ["QX-2000", "QX-3500", "QX-4500"],
    rows: [
      { label: "2 OHM POWER", values: ["400W x2", "600W x2", "700W x2"] },
      { label: "4 OHM POWER", values: ["300W x2", "500W x2", "600W x2"] },
      { label: "8 OHM POWER", values: ["200W x2", "350W x2", "400W x2"] },
      { label: "8 OHM BRIDGE", values: ["600W", "1000W", "1200W"] },
      { label: "4 OHM BRIDGE", values: ["800W", "1400W", "1600W"] },
      { label: "INPUT SENSITIVITY", span: "0.775 VMS / 1.0 VMS / 1.4 VMS" },
      { label: "OUTPUT CIRCUITRY", values: ["H Class", "H Class", "H Class"] },
      { label: "DAMPING FACTOR", values: ["400", "500", "600"] },
      {
        label: "PROTECTION",
        span: "Short Circuit, Auto Limited, Overload, AC/DC Protection",
      },
      { label: "CROSS OVER", values: ["-", "-", "-"] },
      { label: "HEIGHT", values: ["2U", "2U", "2U"] },
      { label: "GROSS WEIGHT", values: ["14.8 Kg", "17.5 Kg", "19.5 Kg"] },
      { label: "FAN", values: ["2 Fan", "2 Fan", "2 Fan"] },
    ],
  },
  applications: [
    { icon: "speaker-stack", title: "Live Sound", copy: "Concerts, bands and live performance setups." },
    { icon: "building", title: "Installations", copy: "Conference rooms, auditoriums and commercial spaces." },
    { icon: "events", title: "Events", copy: "Corporate events, outdoor shows and gatherings." },
    { icon: "church", title: "Houses of Worship", copy: "Churches, temples and community halls." },
  ],
  related: [
    { name: "QX Series Power Amplifiers", sub: "4 Channel Amplifiers", image: IMG.qx4800 },
    { name: "QX Series Power Amplifiers", sub: "High Performance Series", image: IMG.qx7000 },
    { name: "Processing Amplifiers", sub: "Integrated DSP Solutions", image: IMG.proc3 },
    { name: "Professional Audio Mixers", sub: "Precision & Control", image: IMG.mixerLarge },
  ],
};

/* ------------------------------------------------------------ about page */

export const JOURNEY = [
  {
    icon: "calendar",
    title: "Founded in 1980s",
    copy: "LORD is founded with a vision to innovate in professional audio technology.",
  },
  {
    icon: "star",
    title: "Brand Evolution",
    copy: "From microphones to complete audio solutions, building trust across professionals.",
  },
  {
    icon: "factory",
    title: "Modern Manufacturing",
    copy: "In-house design, advanced facilities, and rigorous quality control define our production.",
  },
  {
    icon: "globe",
    title: "Global Reach",
    copy: "Products trusted in 65+ countries, powering performances around the world.",
  },
];

export const VALUES = [
  { icon: "bulb", title: "Innovation", copy: "Continuously advancing audio technology for better performance." },
  { icon: "shield", title: "Quality", copy: "Rigorous testing and premium components ensure lasting quality." },
  { icon: "handshake", title: "Reliability", copy: "Built to perform consistently in every environment." },
  { icon: "headset", title: "Support", copy: "Dedicated support and after-sales service you can count on." },
];

export const ECOSYSTEM = [
  { title: "Power Amplifiers", image: IMG.qx4500 },
  { title: "Mixing Consoles", image: IMG.mixerLarge },
  { title: "Wireless Systems", image: IMG.wirelessKmc9 },
  { title: "Speakers & Cabinets", image: IMG.paColumn },
  { title: "Microphones", image: IMG.mic1 },
  { title: "PA Systems", image: IMG.paColumn },
  { title: "Audio Processors", image: IMG.proc3 },
  { title: "Accessories", image: IMG.accessory1 },
];

export const ABOUT_STATS = [
  { icon: "calendar", value: `${YEARS_EXPERIENCE}+`, label: "Years", sub: "of Audio Excellence" },
  { icon: "box", value: "500+", label: "Products", sub: "Across Our Ecosystem" },
  { icon: "globe", value: "65+", label: "Countries", sub: "Global Presence" },
  { icon: "shield", value: "100%", label: "Quality Focus", sub: "Tested. Trusted. Delivered." },
];

/* ---------------------------------------------------------- contact page */

export const INTEREST_CARDS = [
  { title: "Power Amplifiers", copy: "High performance & reliable power for every application.", image: IMG.qx4500 },
  { title: "Mixing Consoles", copy: "Professional analog & digital mixers for perfect control.", image: IMG.mixerLarge },
  { title: "Wireless Systems", copy: "Stable, clear & interference-free wireless audio solutions.", image: IMG.wirelessKmc9 },
  { title: "Speakers & Components", copy: "High quality speakers & components for every need.", image: IMG.driver1 },
  { title: "PA Systems", copy: "Complete PA solutions for events of any size.", image: IMG.paColumn },
];

export const ENQUIRY_STEPS = [
  {
    n: 1,
    icon: "chat",
    title: "Tell Us Your Need",
    copy: "Share your requirements, venue or application and product preferences.",
  },
  {
    n: 2,
    icon: "headset",
    title: "Get Expert Guidance",
    copy: "Our audio experts understand your needs and suggest the best solutions.",
  },
  {
    n: 3,
    icon: "badge",
    title: "Receive the Right Recommendation",
    copy: "Get the right product recommendations, specs and quotation.",
  },
];

export const FAQS = [
  {
    q: "How do I choose the right product for my requirement?",
    a: "Share your venue size, application type and budget with our team. Our audio experts will assess your requirement and recommend the right combination of amplifiers, speakers and processing for your setup.",
  },
  {
    q: "Can I get a quotation for my project?",
    a: "Yes. Send us your requirement through the enquiry form or WhatsApp and we will share a detailed quotation, typically within two business hours on working days.",
  },
  {
    q: "Do you have authorized dealers and service partners?",
    a: "We work with an authorized dealer and system integrator network across India and in 65+ countries. Contact us and we will connect you with your nearest partner.",
  },
  {
    q: "Can I get a product catalogue?",
    a: "Our complete Qubix and LORD product catalogue is available for download from the header, or we can email you the latest version on request.",
  },
  {
    q: "What kind of after-sales support do you provide?",
    a: "Every product is backed by warranty, dedicated technical support and a service centre network. Our team assists with installation guidance, troubleshooting and spares.",
  },
];

export const PRODUCT_CATEGORY_OPTIONS = [
  "Power Amplifiers",
  "Mixing Consoles",
  "Audio Processing",
  "Wireless Systems",
  "Speakers & Components",
  "PA Systems",
  "Microphones",
  "Accessories",
];

/* ---------------------------------------------------------------- footer */

export const FOOTER_COLUMNS = [
  {
    title: "Products",
    links: [
      { label: "Power Amplifiers", to: "/products/power-amplifiers" },
      { label: "Mixing Consoles", to: "/products" },
      { label: "Audio Processing", to: "/products" },
      { label: "Wireless Systems", to: "/products" },
      { label: "Speakers & Components", to: "/products" },
      { label: "Accessories", to: "/products" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", to: "/about" },
      { label: "Our Brands", to: "/about" },
      { label: "Careers", to: "/contact" },
      { label: "News & Events", to: "/contact" },
      { label: "Become a Dealer", to: "/contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Product Support", to: "/contact" },
      { label: "Downloads", to: "/contact" },
      { label: "Warranty", to: "/contact" },
      { label: "FAQs", to: "/contact" },
      { label: "Contact Support", to: "/contact" },
    ],
  },
];
