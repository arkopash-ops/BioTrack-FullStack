import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "../components/Layout";

import Guest from "../pages/guest/Guest";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import AdminDashboard from "../pages/admin/Dashboard";
import VisitorDashboard from "../pages/visitor/Dashboard";
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Guest />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/visitor/dashboard" element={<VisitorDashboard />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default AppRouter;
