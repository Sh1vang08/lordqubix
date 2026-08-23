import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listCollections, createCollection, deleteCollection } from "../api";
import "./ProductList.css";

export default function CollectionList() {
  const [collections, setCollections] = useState(null);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");

  // Not passed to useEffect directly: an arrow function that implicitly
  // returns a Promise would have that Promise mistaken for the effect's
  // cleanup function, and React crashes calling it on unmount.
  const load = () => {
    listCollections().then(setCollections).catch((e) => setError(e.message));
  };

  useEffect(load, []); // eslint-disable-line react-hooks/exhaustive-deps

  const slugify = (s) =>
    s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  const onCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await createCollection({ title: title.trim(), slug: slugify(title) });
      setTitle("");
      setCreating(false);
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  const onDelete = async (id, name) => {
    if (!confirm(`Delete collection "${name}"? This cannot be undone.`)) return;
    try {
      await deleteCollection(id);
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  if (!collections) return <p>Loading…</p>;

  return (
    <div>
      <div className="admin-toolbar">
        <h1>Collections</h1>
        <button className="admin-btn admin-btn--primary" onClick={() => setCreating(true)}>
          + New collection
        </button>
      </div>

      {error && <p className="admin-error">{error}</p>}

      {creating && (
        <form className="admin-filters" onSubmit={onCreate} style={{ marginBottom: 20 }}>
          <input
            placeholder="Collection title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
          <button className="admin-btn admin-btn--primary" type="submit">
            Create
          </button>
          <button className="admin-btn" type="button" onClick={() => setCreating(false)}>
            Cancel
          </button>
        </form>
      )}

      <table className="admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Slug</th>
            <th>Published</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {collections.map((c) => (
            <tr key={c.id} className="admin-row">
              <td>{c.title}</td>
              <td className="admin-row__muted">{c.slug}</td>
              <td>{c.is_published ? "✓" : "—"}</td>
              <td className="admin-row__actions">
                <Link to={`/admin/collections/${c.id}`}>Edit</Link>
                <button onClick={() => onDelete(c.id, c.title)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {!collections.length && <p className="admin-empty">No collections yet.</p>}
    </div>
  );
}
