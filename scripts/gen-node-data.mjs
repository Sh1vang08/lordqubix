/**
 * Regenerates src/data/products-node.js from src/data/products.js.
 *
 * The Vercel preview function (api/preview.js) needs the product list, but
 * products.js builds image URLs from `import.meta.env.BASE_URL`, which Node
 * cannot parse. Rather than duplicate the catalogue by hand — which would
 * drift the moment either copy changed — this extracts the PRODUCTS array
 * verbatim into a plain module.
 *
 * Runs automatically before every build via the `prebuild` script.
 */
import { readFileSync, writeFileSync } from "node:fs";

const SRC = "src/data/products.js";
const OUT = "src/data/products-node.js";

const source = readFileSync(SRC, "utf8");
const match = source.match(/export const PRODUCTS = \[[\s\S]*?\n\];/);

if (!match) {
  console.error(`gen-node-data: could not find PRODUCTS array in ${SRC}`);
  process.exit(1);
}

const header = `// GENERATED — do not edit by hand.
// Mirror of the PRODUCTS array in ${SRC}, for the Vercel link-preview
// function which runs in Node and cannot parse Vite's import.meta.env.
// Regenerate with: node scripts/gen-node-data.mjs
`;

writeFileSync(OUT, `${header}\n${match[0]}\n`, "utf8");

const count = (match[0].match(/\n {2}\{/g) || []).length;
console.log(`gen-node-data: wrote ${OUT} (${count} products)`);
