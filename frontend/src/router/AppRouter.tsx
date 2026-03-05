import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "../components/Layout";

import Guest from "../pages/guest/Guest";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Guest />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default AppRouter;
