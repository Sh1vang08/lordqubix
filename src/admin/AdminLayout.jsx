import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./AdminLayout.css";

const LINKS = [
  { to: "/admin/products", label: "Products" },
  { to: "/admin/featured", label: "Featured" },
  { to: "/admin/collections", label: "Collections" },
];

export default function AdminLayout() {
  const { session, signOut } = useAuth();

  return (
    <div className="admin-shell">
      <aside className="admin-nav">
        <p className="admin-nav__brand">Qubix &amp; LORD</p>
        <nav>
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                isActive ? "admin-nav__link is-active" : "admin-nav__link"
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-nav__foot">
          <p>{session?.user?.email}</p>
          <button onClick={signOut}>Sign out</button>
        </div>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
