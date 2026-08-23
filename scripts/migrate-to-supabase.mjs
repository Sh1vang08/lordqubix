/**
 * One-off migration: src/data/products.js -> Supabase.
 *
 * Run once, after 0001_init.sql has been applied. Populates families,
 * categories and products from the existing static data, preserving the
 * catalogue order already encoded in FAMILIES/CATEGORIES/PRODUCTS as the
 * initial sort_order. Idempotent: safe to re-run, upserts on primary key.
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY in the environment (see .env) — the
 * service key bypasses RLS, which the anon key used by the live site cannot.
 */
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { PRODUCTS, CATEGORIES, FAMILIES, PHOTOGRAPHED } from "../src/data/products.js";

const url = process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env — " +
      "get the service_role key from Supabase > Settings > API."
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false },
});

const SORT_STEP = 1000;

async function main() {
  console.log(`Migrating ${FAMILIES.length} families, ${CATEGORIES.length} categories, ${PRODUCTS.length} products...`);

  // 1. Families, in their existing array order.
  const familyRows = FAMILIES.map((f, i) => ({
    slug: f.slug,
    label: f.label,
    blurb: f.blurb,
    sort_order: (i + 1) * SORT_STEP,
  }));
  let { error } = await supabase.from("families").upsert(familyRows);
  if (error) throw new Error("families: " + error.message);
  console.log(`  families: ${familyRows.length} upserted`);

  // 2. Categories. family_slug is derived the same way familyOf() does in
  // products.js: find the family whose `categories` list contains this
  // category's label. sort_order follows each family's categories array,
  // so the catalogue page ordering already encoded there is preserved.
  const categoryRows = CATEGORIES.map((c) => {
    const family = FAMILIES.find((f) => f.categories.includes(c.label));
    const posInFamily = family ? family.categories.indexOf(c.label) : -1;
    return {
      slug: c.slug,
      label: c.label,
      brand: c.brand,
      family_slug: family?.slug ?? null,
      sort_order: (posInFamily + 1) * SORT_STEP,
    };
  });
  ({ error } = await supabase.from("categories").upsert(categoryRows));
  if (error) throw new Error("categories: " + error.message);
  console.log(`  categories: ${categoryRows.length} upserted`);

  // 3. Products, sort_order following their existing position within each
  // category (the array order in products.js already reads in catalogue
  // order per the earlier numeric-sort work), sparse so the admin panel can
  // reorder by only touching neighbours.
  const withinCategoryIndex = {};
  const productRows = PRODUCTS.map((p) => {
    const i = (withinCategoryIndex[p.categorySlug] =
      (withinCategoryIndex[p.categorySlug] ?? 0) + 1);
    return {
      slug: p.slug,
      name: p.name,
      brand: p.brand,
      category_slug: p.categorySlug,
      summary: p.summary ?? "",
      tagline: p.tagline ?? "",
      features: p.features ?? [],
      specs: p.specs ?? [],
      sort_order: i * SORT_STEP,
      has_new_photo: PHOTOGRAPHED.has(p.slug),
    };
  });

  // Chunked: Supabase's default request size handles this in one call for
  // 169 rows, but chunking keeps this safe as the catalogue grows.
  const CHUNK = 500;
  for (let i = 0; i < productRows.length; i += CHUNK) {
    const chunk = productRows.slice(i, i + CHUNK);
    ({ error } = await supabase.from("products").upsert(chunk));
    if (error) throw new Error("products: " + error.message);
  }
  console.log(`  products: ${productRows.length} upserted`);

  // 4. Featured home-page picks, matching the current hardcoded
  // TOP_PICK_SLUGS in Home.jsx so the home page looks identical immediately
  // after cutover.
  const TOP_PICK_SLUGS = ["qx-4500", "qx-3500", "qx-2000", "qx-4800"];
  for (let i = 0; i < TOP_PICK_SLUGS.length; i++) {
    ({ error } = await supabase
      .from("products")
      .update({ featured_order: (i + 1) * SORT_STEP })
      .eq("slug", TOP_PICK_SLUGS[i]));
    if (error) throw new Error("featured_order: " + error.message);
  }
  console.log(`  featured_order: ${TOP_PICK_SLUGS.length} set`);

  console.log("\nDone.");
}

main().catch((e) => {
  console.error("\nMigration failed:", e.message);
  process.exit(1);
});
