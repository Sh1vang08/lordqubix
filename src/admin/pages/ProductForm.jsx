import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  listCategories,
  uploadProductImage,
} from "../api";
import "./ProductForm.css";

const BLANK = {
  slug: "",
  name: "",
  brand: "Qubix",
  category_slug: "",
  summary: "",
  tagline: "",
  features: [],
  specs: [],
};

const slugify = (s) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default function ProductForm() {
  const { slug } = useParams();
  const isNew = slug === undefined || slug === "new";
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(BLANK);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    listCategories().then(setCategories).catch((e) => setError(e.message));
    if (!isNew) {
      getProduct(slug)
        .then((p) => setForm(p))
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    }
  }, [slug, isNew]);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const onNameChange = (name) => {
    // Auto-derive the slug from the name for new products only — editing an
    // existing product's name must never silently change its URL.
    set(isNew ? { name, slug: slugify(name) } : { name });
  };

  const onFeatureChange = (i, value) => {
    const next = [...form.features];
    next[i] = value;
    set({ features: next });
  };
  const addFeature = () => set({ features: [...form.features, ""] });
  const removeFeature = (i) =>
    set({ features: form.features.filter((_, idx) => idx !== i) });

  const onSpecChange = (i, key, value) => {
    const next = [...form.specs];
    next[i] = [key, value];
    set({ specs: next });
  };
  const addSpec = () => set({ specs: [...form.specs, ["", ""]] });
  const removeSpec = (i) => set({ specs: form.specs.filter((_, idx) => idx !== i) });

  const onImagePick = (file) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const cleanedFeatures = form.features.map((f) => f.trim()).filter(Boolean);
      const cleanedSpecs = form.specs
        .map(([k, v]) => [k.trim(), v.trim()])
        .filter(([k, v]) => k && v);

      const payload = {
        name: form.name.trim(),
        brand: form.brand,
        category_slug: form.category_slug,
        summary: form.summary.trim(),
        tagline: form.tagline.trim(),
        features: cleanedFeatures,
        specs: cleanedSpecs,
      };

      let saved;
      if (isNew) {
        saved = await createProduct({ ...payload, slug: form.slug });
      } else {
        saved = await updateProduct(slug, payload);
      }

      if (imageFile) {
        const url = await uploadProductImage(saved.slug, "full", imageFile);
        await updateProduct(saved.slug, { has_new_photo: true });
        // The uploaded file becomes the product's canonical image at
        // `${slug}/full.<ext>` in Storage; nothing else references `url`
        // directly today, but keeping it here is where a future thumbnail/
        // OG pipeline step would pick it up.
        void url;
      }

      navigate("/admin/products");
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!confirm(`Delete ${form.name}? This cannot be undone.`)) return;
    try {
      await deleteProduct(slug);
      navigate("/admin/products");
    } catch (e) {
      setError(e.message);
    }
  };

  if (loading) return <p>Loading…</p>;

  return (
    <div>
      <div className="admin-toolbar">
        <h1>{isNew ? "New product" : form.name}</h1>
        <Link className="admin-btn" to="/admin/products">
          ← Back to products
        </Link>
      </div>

      {error && <p className="admin-error">{error}</p>}

      <form className="admin-form" onSubmit={submit}>
        <div className="admin-form__grid">
          <label>
            Name
            <input
              value={form.name}
              onChange={(e) => onNameChange(e.target.value)}
              required
            />
          </label>
          <label>
            Slug (URL)
            <input
              value={form.slug}
              onChange={(e) => set({ slug: slugify(e.target.value) })}
              disabled={!isNew}
              required
            />
          </label>
          <label>
            Brand
            <select value={form.brand} onChange={(e) => set({ brand: e.target.value })}>
              <option value="Qubix">Qubix</option>
              <option value="Lord">Lord</option>
            </select>
          </label>
          <label>
            Category
            <select
              value={form.category_slug}
              onChange={(e) => set({ category_slug: e.target.value })}
              required
            >
              <option value="" disabled>
                Select a category…
              </option>
              {categories
                .filter((c) => c.brand === form.brand)
                .map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.label}
                  </option>
                ))}
            </select>
          </label>
        </div>

        <label>
          Summary
          <input value={form.summary} onChange={(e) => set({ summary: e.target.value })} />
        </label>
        <label>
          Tagline
          <input value={form.tagline} onChange={(e) => set({ tagline: e.target.value })} />
        </label>

        <fieldset className="admin-form__section">
          <legend>Features</legend>
          {form.features.map((f, i) => (
            <div className="admin-form__row" key={i}>
              <input value={f} onChange={(e) => onFeatureChange(i, e.target.value)} />
              <button type="button" onClick={() => removeFeature(i)}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" className="admin-btn" onClick={addFeature}>
            + Add feature
          </button>
        </fieldset>

        <fieldset className="admin-form__section">
          <legend>Specifications</legend>
          {form.specs.map(([k, v], i) => (
            <div className="admin-form__row admin-form__row--spec" key={i}>
              <input
                placeholder="Key (e.g. Power Rating)"
                value={k}
                onChange={(e) => onSpecChange(i, e.target.value, v)}
              />
              <input
                placeholder="Value (e.g. 400W)"
                value={v}
                onChange={(e) => onSpecChange(i, k, e.target.value)}
              />
              <button type="button" onClick={() => removeSpec(i)}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" className="admin-btn" onClick={addSpec}>
            + Add spec
          </button>
        </fieldset>

        <fieldset className="admin-form__section">
          <legend>Product photo</legend>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files[0] && onImagePick(e.target.files[0])}
          />
          {imagePreview && (
            <img className="admin-form__preview" src={imagePreview} alt="Preview" />
          )}
          <p className="admin-hint">
            Uploads replace this product's photo in storage. Marks the product as
            having 2026 photography.
          </p>
        </fieldset>

        <div className="admin-form__actions">
          <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
            {saving ? "Saving…" : isNew ? "Create product" : "Save changes"}
          </button>
          {!isNew && (
            <button type="button" className="admin-btn admin-btn--danger" onClick={onDelete}>
              Delete product
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
