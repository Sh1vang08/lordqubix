import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import RequireAuth from "./RequireAuth";
import AdminLayout from "./AdminLayout";
import ProductList from "./pages/ProductList";
import ProductForm from "./pages/ProductForm";
import Featured from "./pages/Featured";
import CollectionList from "./pages/CollectionList";
import CollectionEditor from "./pages/CollectionEditor";

export default function AdminApp() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<RequireAuth />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="products" replace />} />
            <Route path="products" element={<ProductList />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/:slug" element={<ProductForm />} />
            <Route path="featured" element={<Featured />} />
            <Route path="collections" element={<CollectionList />} />
            <Route path="collections/:id" element={<CollectionEditor />} />
            <Route path="*" element={<Navigate to="products" replace />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}
