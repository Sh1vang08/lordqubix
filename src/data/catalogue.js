// Full catalogue asset index.
//
// All 204 extracted catalogue images are imported eagerly via Vite's glob
// import, then grouped by the catalogue page they came from. Page ranges map
// to product families (verified against the supplied contact sheet), so every
// supplied asset is addressable and used somewhere on the site.

const modules = import.meta.glob("../assets/catalogue/*.{webp,png}", {
  eager: true,
  import: "default",
});

/**
 * The five catalogue extractions that have an opaque (non-transparent)
 * backdrop. On dark cards they need a light plate behind them instead of
 * being dropped straight onto navy, otherwise their baked-in white/grey
 * background reads as a rendering fault.
 */
const OPAQUE = new Set([
  "catalogue-page-01-asset-01-2252x1736.webp",
  "catalogue-page-24-asset-01-2486x2864.webp",
  "catalogue-page-29-asset-07-696x388.webp",
  "catalogue-page-34-asset-04-159x478.webp",
  "catalogue-page-34-asset-05-159x504.webp",
]);

/** @type {{ file: string, url: string, page: number, index: number, w: number, h: number, ratio: number, opaque: boolean }[]} */
export const ALL_ASSETS = Object.entries(modules)
  .map(([path, url]) => {
    const file = path.split("/").pop();
    const m = file.match(/page-(\d+)-asset-(\d+)-(\d+)x(\d+)/);
    const w = m ? Number(m[3]) : 0;
    const h = m ? Number(m[4]) : 0;
    return {
      file,
      url,
      page: m ? Number(m[1]) : 0,
      index: m ? Number(m[2]) : 0,
      w,
      h,
      ratio: h ? w / h : 1,
      opaque: OPAQUE.has(file),
    };
  })
  .sort((a, b) => a.page - b.page || a.index - b.index);

/** Assets from an inclusive catalogue page range. */
export const pages = (from, to = from) =>
  ALL_ASSETS.filter((a) => a.page >= from && a.page <= to);

/** Look up one asset by page + index (1-based), falling back to the first. */
export const asset = (page, index = 1) =>
  ALL_ASSETS.find((a) => a.page === page && a.index === index) ||
  pages(page)[0] ||
  ALL_ASSETS[0];

export const url = (page, index = 1) => asset(page, index).url;

/**
 * Catalogue page ranges by product family, verified against the contact sheet.
 * Wide, short assets (ratio > 2) are rack units; near-square assets are
 * drivers, mics and components.
 */
export const FAMILY_PAGES = {
  brand: [1, 1],
  qxAmps: [4, 6],
  caAmps: [7, 7],
  mtAmps: [8, 8],
  tdAmps: [9, 9],
  mixers: [10, 14],
  processing: [15, 15],
  wireless: [16, 17],
  // Pages 18-21 are cone/woofer drivers, 22 compression drivers,
  // 23 crossover networks & components.
  drivers: [18, 21],
  compression: [22, 22],
  crossovers: [23, 23],
  speakerSystems: [24, 24],
  paAmps: [25, 28],
  // Page 29-30 mics; 31-32 are further drivers/woofers.
  microphones: [29, 30],
  driversAlt: [31, 32],
  paSystems: [33, 33],
  // Page 34 microphones (LORD), 35-36 diaphragms & components.
  micsLord: [34, 34],
  components: [35, 36],
};

/** All assets belonging to a named family. */
export const family = (name) => {
  const range = FAMILY_PAGES[name];
  return range ? pages(range[0], range[1]) : [];
};

/** Rack-style (wide) assets in a family — good for amplifier/processor rows. */
export const familyWide = (name) => family(name).filter((a) => a.ratio > 1.9);

/** Squarer assets in a family — good for driver/mic/component grids. */
export const familySquare = (name) => family(name).filter((a) => a.ratio <= 1.9);

/** Deterministically pick n assets spread across a family. */
export const spread = (list, n) => {
  if (list.length <= n) return list;
  const out = [];
  const step = list.length / n;
  for (let i = 0; i < n; i += 1) out.push(list[Math.floor(i * step)]);
  return out;
};

export const TOTAL_ASSETS = ALL_ASSETS.length;
