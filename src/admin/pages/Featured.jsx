import { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { listProducts, setFeaturedOrder } from "../api";
import "./ProductList.css";

const MAX_FEATURED = 4;

function Row({ product, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: product.slug });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  return (
    <tr ref={setNodeRef} style={style} className="admin-row">
      <td className="admin-row__handle" {...attributes} {...listeners}>
        ⠿
      </td>
      <td>{product.name}</td>
      <td className="admin-row__muted">{product.summary}</td>
      <td className="admin-row__actions">
        <button onClick={() => onRemove(product.slug)}>Remove</button>
      </td>
    </tr>
  );
}

export default function Featured() {
  const [all, setAll] = useState(null);
  const [featured, setFeatured] = useState([]);
  const [addSlug, setAddSlug] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    listProducts()
      .then((products) => {
        setAll(products);
        const current = products
          .filter((p) => p.featured_order != null)
          .sort((a, b) => a.featured_order - b.featured_order);
        setFeatured(current);
      })
      .catch((e) => setError(e.message));
  }, []);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const available = useMemo(() => {
    if (!all) return [];
    const featuredSlugs = new Set(featured.map((p) => p.slug));
    return all.filter((p) => !featuredSlugs.has(p.slug));
  }, [all, featured]);

  const persist = async (next) => {
    setSaving(true);
    setError("");
    try {
      await setFeaturedOrder(next.map((p) => p.slug));
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const onDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = featured.findIndex((p) => p.slug === active.id);
    const newIndex = featured.findIndex((p) => p.slug === over.id);
    const next = arrayMove(featured, oldIndex, newIndex);
    setFeatured(next);
    persist(next);
  };

  const onRemove = (slugToRemove) => {
    const next = featured.filter((p) => p.slug !== slugToRemove);
    setFeatured(next);
    persist(next);
  };

  const onAdd = () => {
    if (!addSlug || featured.length >= MAX_FEATURED) return;
    const product = all.find((p) => p.slug === addSlug);
    if (!product) return;
    const next = [...featured, product];
    setFeatured(next);
    setAddSlug("");
    persist(next);
  };

  if (!all) return <p>Loading…</p>;

  return (
    <div>
      <div className="admin-toolbar">
        <h1>Featured products</h1>
      </div>
      <p className="admin-hint" style={{ marginBottom: 16, display: "block" }}>
        The four cards under "Engineered for Professionals" on the home page, in this
        order. {saving && "Saving…"}
      </p>

      {error && <p className="admin-error">{error}</p>}

      {/* DndContext's off-screen announcer <div> can't be a direct child of
          <table>, so it wraps the whole table rather than sitting inside it. */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <table className="admin-table" style={{ maxWidth: 640 }}>
          <thead>
            <tr>
              <th />
              <th>Name</th>
              <th>Summary</th>
              <th />
            </tr>
          </thead>
          <SortableContext items={featured.map((p) => p.slug)} strategy={verticalListSortingStrategy}>
            <tbody>
              {featured.map((p) => (
                <Row key={p.slug} product={p} onRemove={onRemove} />
              ))}
            </tbody>
          </SortableContext>
        </table>
      </DndContext>

      {featured.length < MAX_FEATURED && (
        <div className="admin-filters" style={{ marginTop: 16 }}>
          <select value={addSlug} onChange={(e) => setAddSlug(e.target.value)}>
            <option value="">Add a product…</option>
            {available.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name}
              </option>
            ))}
          </select>
          <button className="admin-btn admin-btn--primary" onClick={onAdd} disabled={!addSlug}>
            Add
          </button>
        </div>
      )}
      {featured.length >= MAX_FEATURED && (
        <p className="admin-hint" style={{ marginTop: 16, display: "block" }}>
          4 slots filled — remove one to add another.
        </p>
      )}
    </div>
  );
}
