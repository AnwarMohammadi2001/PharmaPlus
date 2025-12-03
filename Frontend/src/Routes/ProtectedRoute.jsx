import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { Children } from "react";

const ProtectedRoute = ({ children }) => {
  const accessToken = useSelector((state) => state.auth.accessToken);

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return children; // 🔹 مهم: Outlet برای رندر کردن مسیرهای داخلی
};

export default ProtectedRoute;
