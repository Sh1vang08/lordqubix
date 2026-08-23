import { Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Login from "./pages/Login";

export default function RequireAuth() {
  const { session, loading } = useAuth();

  if (loading) return null;
  if (!session) return <Login />;
  return <Outlet />;
}
