import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "../pages/Dashboard/pages/Dashboard";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import DashboardLayout from "../layouts/DashboardLayout";

const AppRoute = () => {
  return (
    <Routes>
      {/* Public Route */}

      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected Routes */}

      <Route path="/" element={<MainLayout />}>
        <Route path="/login" element={<Login />} />
        <Route index element={<Home />} />
      </Route>
      {/* Protected Dashboard Routes */}
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Route path="/login" element={<Login />} />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* 404 Route */}
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  );
};

export default AppRoute;
