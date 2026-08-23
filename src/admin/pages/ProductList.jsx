import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
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
import { listProducts, listCategories, reorderCategoryProducts, deleteProduct } from "../api";
import "./ProductList.css";

function Row({ product, onDelete }) {
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
      <td>{product.brand}</td>
      <td className="admin-row__muted">{product.summary}</td>
      <td>{product.has_new_photo ? "✓" : ""}</td>
      <td className="admin-row__actions">
        <Link to={`/admin/products/${product.slug}`}>Edit</Link>
        <button onClick={() => onDelete(product.slug)}>Delete</button>
      </td>
    </tr>
  );
}

export default function ProductList() {
  const [products, setProducts] = useState(null);
  const [categories, setCategories] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  const load = () => {
    Promise.all([listProducts(), listCategories()])
      .then(([p, c]) => {
        setProducts(p);
        setCategories(c);
        if (!categoryFilter && c.length) setCategoryFilter(c[0].slug);
      })
      .catch((e) => setError(e.message));
  };

  useEffect(load, []); // eslint-disable-line react-hooks/exhaustive-deps

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const filtered = useMemo(() => {
    if (!products) return [];
    let list = products;
    if (categoryFilter) list = list.filter((p) => p.category_slug === categoryFilter);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q)
      );
    }
    return list;
  }, [products, categoryFilter, query]);

  // Reordering only makes sense within one category, sorted by its own
  // position — filtering by name/search disables drag so a partial view
  // can't silently scramble the category's real order.
  const canReorder = Boolean(categoryFilter) && !query.trim();

  const onDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = filtered.findIndex((p) => p.slug === active.id);
    const newIndex = filtered.findIndex((p) => p.slug === over.id);
    const reordered = arrayMove(filtered, oldIndex, newIndex);

    // Optimistic: update local state immediately, persist after.
    setProducts((prev) => {
      const others = prev.filter((p) => p.category_slug !== categoryFilter);
      return [...others, ...reordered];
    });
    try {
      await reorderCategoryProducts(categoryFilter, reordered.map((p) => p.slug));
    } catch (e) {
      setError(e.message);
      load();
    }
  };

  const onDelete = async (slug) => {
    if (!confirm(`Delete ${slug}? This cannot be undone.`)) return;
    try {
      await deleteProduct(slug);
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  if (!products || !categories) return <p>Loading…</p>;

  return (
    <div>
      <div className="admin-toolbar">
        <h1>Products</h1>
        <Link className="admin-btn admin-btn--primary" to="/admin/products/new">
          + New product
        </Link>
      </div>

      {error && <p className="admin-error">{error}</p>}

      <div className="admin-filters">
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.label} ({c.brand})
            </option>
          ))}
        </select>
        <input
          type="search"
          placeholder="Search all products…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {!canReorder && query.trim() && (
          <span className="admin-hint">Clear search to reorder</span>
        )}
      </div>

      {/* DndContext renders an off-screen <div> for its screen-reader
          announcer, so it wraps the whole <table> rather than sitting inside
          it — a <div> as a direct child of <table>/<tbody> is invalid HTML
          and React refuses to render it, throwing on unmount. */}
      {canReorder ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <table className="admin-table">
            <thead>
              <tr>
                <th />
                <th>Name</th>
                <th>Brand</th>
                <th>Summary</th>
                <th>New photo</th>
                <th />
              </tr>
            </thead>
            <SortableContext items={filtered.map((p) => p.slug)} strategy={verticalListSortingStrategy}>
              <tbody>
                {filtered.map((p) => (
                  <Row key={p.slug} product={p} onDelete={onDelete} />
                ))}
              </tbody>
            </SortableContext>
          </table>
        </DndContext>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th />
              <th>Name</th>
              <th>Brand</th>
              <th>Summary</th>
              <th>New photo</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.slug} className="admin-row">
                <td />
                <td>{p.name}</td>
                <td>{p.brand}</td>
                <td className="admin-row__muted">{p.summary}</td>
                <td>{p.has_new_photo ? "✓" : ""}</td>
                <td className="admin-row__actions">
                  <Link to={`/admin/products/${p.slug}`}>Edit</Link>
                  <button onClick={() => onDelete(p.slug)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!filtered.length && <p className="admin-empty">No products match.</p>}
    </div>
  );
}
