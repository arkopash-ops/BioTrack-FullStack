import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";

import Guest from "../pages/guest/Guest";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import AdminDashboard from "../pages/admin/Dashboard";
import VisitorDashboard from "../pages/visitor/Dashboard";

import GetProfile from "../pages/admin/profile/GetProfile";
import EditProfile from "../pages/admin/profile/EditProfile";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Guest />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/visitor/dashboard"
            element={
              <ProtectedRoute>
                <VisitorDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/profile/:userId"
            element={
              <ProtectedRoute>
                <GetProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/edit-profile/:userId"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default AppRouter;
