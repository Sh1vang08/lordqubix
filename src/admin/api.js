import { supabase } from "../lib/supabase";

/* --------------------------------------------------------------- reads */

export async function listFamilies() {
  const { data, error } = await supabase
    .from("families")
    .select("*")
    .order("sort_order");
  if (error) throw error;
  return data;
}

export async function listCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("family_slug")
    .order("sort_order");
  if (error) throw error;
  return data;
}

export async function listProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("category_slug")
    .order("sort_order");
  if (error) throw error;
  return data;
}

export async function getProduct(slug) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) throw error;
  return data;
}

export async function listCollections() {
  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getCollectionProducts(collectionId) {
  const { data, error } = await supabase
    .from("collection_products")
    .select("sort_order, products(*)")
    .eq("collection_id", collectionId)
    .order("sort_order");
  if (error) throw error;
  return data.map((row) => ({ ...row.products, _sortOrder: row.sort_order }));
}

/* -------------------------------------------------------------- writes */

export async function createProduct(product) {
  const { data, error } = await supabase
    .from("products")
    .insert(product)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateProduct(slug, patch) {
  const { data, error } = await supabase
    .from("products")
    .update(patch)
    .eq("slug", slug)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteProduct(slug) {
  const { error } = await supabase.from("products").delete().eq("slug", slug);
  if (error) throw error;
}

/**
 * Persists a new order for a list of product slugs within one category.
 * Renumbers every row in sparse steps of 1000 rather than trying to patch
 * only the moved item — simpler to reason about and the category lists are
 * small (a few dozen rows at most), so a full renumber is cheap.
 */
export async function reorderCategoryProducts(categorySlug, orderedSlugs) {
  const updates = orderedSlugs.map((slug, i) =>
    supabase
      .from("products")
      .update({ sort_order: (i + 1) * 1000 })
      .eq("slug", slug)
      .eq("category_slug", categorySlug)
  );
  const results = await Promise.all(updates);
  const failed = results.find((r) => r.error);
  if (failed) throw failed.error;
}

/** Sets the four (or fewer) featured home-page slots, in order. Any product
 * previously featured but not in the new list is cleared back to null. */
export async function setFeaturedOrder(orderedSlugs) {
  const { error: clearError } = await supabase
    .from("products")
    .update({ featured_order: null })
    .not("featured_order", "is", null);
  if (clearError) throw clearError;

  const updates = orderedSlugs.map((slug, i) =>
    supabase
      .from("products")
      .update({ featured_order: (i + 1) * 1000 })
      .eq("slug", slug)
  );
  const results = await Promise.all(updates);
  const failed = results.find((r) => r.error);
  if (failed) throw failed.error;
}

export async function createCollection(collection) {
  const { data, error } = await supabase
    .from("collections")
    .insert(collection)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateCollection(id, patch) {
  const { data, error } = await supabase
    .from("collections")
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteCollection(id) {
  const { error } = await supabase.from("collections").delete().eq("id", id);
  if (error) throw error;
}

export async function setCollectionProducts(collectionId, orderedSlugs) {
  const { error: delError } = await supabase
    .from("collection_products")
    .delete()
    .eq("collection_id", collectionId);
  if (delError) throw delError;

  if (!orderedSlugs.length) return;

  const rows = orderedSlugs.map((slug, i) => ({
    collection_id: collectionId,
    product_slug: slug,
    sort_order: (i + 1) * 1000,
  }));
  const { error } = await supabase.from("collection_products").insert(rows);
  if (error) throw error;
}

/* --------------------------------------------------------------- images */

/**
 * Uploads one file to the product-images bucket under `${slug}/${kind}.webp`
 * and returns its public URL. `kind` is "full" | "thumb" | "og" so a product
 * can hold all three sizes without collisions.
 */
export async function uploadProductImage(slug, kind, file) {
  const path = `${slug}/${kind}.${file.name.split(".").pop()}`;
  const { error } = await supabase.storage
    .from("product-images")
    .upload(path, file, { upsert: true, cacheControl: "3600" });
  if (error) throw error;
  const { data } = supabase.storage.from("product-images").getPublicUrl(path);
  return data.publicUrl;
}
