import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
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
import {
  listProducts,
  listCollections,
  updateCollection,
  getCollectionProducts,
  setCollectionProducts,
} from "../api";
import "./ProductList.css";

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

export default function CollectionEditor() {
  const { id } = useParams();
  const [collection, setCollection] = useState(null);
  const [allProducts, setAllProducts] = useState(null);
  const [items, setItems] = useState([]);
  const [addSlug, setAddSlug] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([listCollections(), listProducts(), getCollectionProducts(id)])
      .then(([collections, products, current]) => {
        setCollection(collections.find((c) => c.id === id));
        setAllProducts(products);
        setItems(current);
      })
      .catch((e) => setError(e.message));
  }, [id]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const available = useMemo(() => {
    if (!allProducts) return [];
    const used = new Set(items.map((p) => p.slug));
    return allProducts.filter((p) => !used.has(p.slug));
  }, [allProducts, items]);

  const persistItems = async (next) => {
    setSaving(true);
    setError("");
    try {
      await setCollectionProducts(id, next.map((p) => p.slug));
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const onDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((p) => p.slug === active.id);
    const newIndex = items.findIndex((p) => p.slug === over.id);
    const next = arrayMove(items, oldIndex, newIndex);
    setItems(next);
    persistItems(next);
  };

  const onRemove = (slug) => {
    const next = items.filter((p) => p.slug !== slug);
    setItems(next);
    persistItems(next);
  };

  const onAdd = () => {
    if (!addSlug) return;
    const product = allProducts.find((p) => p.slug === addSlug);
    if (!product) return;
    const next = [...items, product];
    setItems(next);
    setAddSlug("");
    persistItems(next);
  };

  const togglePublished = async () => {
    try {
      const updated = await updateCollection(id, { is_published: !collection.is_published });
      setCollection(updated);
    } catch (e) {
      setError(e.message);
    }
  };

  if (!collection || !allProducts) return <p>Loading…</p>;

  return (
    <div>
      <div className="admin-toolbar">
        <h1>{collection.title}</h1>
        <Link className="admin-btn" to="/admin/collections">
          ← Back to collections
        </Link>
      </div>

      {error && <p className="admin-error">{error}</p>}

      <div className="admin-filters" style={{ marginBottom: 20 }}>
        <button className="admin-btn" onClick={togglePublished}>
          {collection.is_published ? "Unpublish" : "Publish"}
        </button>
        <span className="admin-hint">
          {collection.is_published
            ? "Visible on the public site"
            : "Draft — hidden from visitors"}
          {saving && " · Saving…"}
        </span>
      </div>

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
          <SortableContext items={items.map((p) => p.slug)} strategy={verticalListSortingStrategy}>
            <tbody>
              {items.map((p) => (
                <Row key={p.slug} product={p} onRemove={onRemove} />
              ))}
            </tbody>
          </SortableContext>
        </table>
      </DndContext>
      {!items.length && <p className="admin-empty">No products in this collection yet.</p>}

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
    </div>
  );
}
