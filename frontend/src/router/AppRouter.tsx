import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";

import Guest from "../pages/guest/Guest";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import AdminDashboard from "../pages/admin/Dashboard";
import AdminUsers from "../pages/admin/Users";
import AdminSpecies from "../pages/admin/Species";
import AdminTaxonomy from "../pages/admin/Taxonomy";
import AdminGetSpecies from "../pages/admin/species/GetSpecies";
import AdminSpeciesEvolutionTree from "../pages/admin/species/SpeciesEvolutionTree";
import AdminEditSpecies from "../pages/admin/species/EditSpecies";

import GetProfile from "../pages/admin/profile/GetProfile";
import EditProfile from "../pages/admin/profile/EditProfile";

import VisitorDashboard from "../pages/visitor/Dashboard";

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
            path="/admin/users"
            element={
              <ProtectedRoute>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/species"
            element={
              <ProtectedRoute>
                <AdminSpecies />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/species/:slug"
            element={
              <ProtectedRoute>
                <AdminGetSpecies />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/species/:slug/edit"
            element={
              <ProtectedRoute>
                <AdminEditSpecies />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/species/:slug/evolution-tree"
            element={
              <ProtectedRoute>
                <AdminSpeciesEvolutionTree />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/taxonomy"
            element={
              <ProtectedRoute>
                <AdminTaxonomy />
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
