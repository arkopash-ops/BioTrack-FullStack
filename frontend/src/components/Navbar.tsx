import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const readAuthStatus = () =>
    localStorage.getItem("isAuthenticated") === "true" ||
    Boolean(localStorage.getItem("token"));
  const readRole = () => localStorage.getItem("userRole") || "";

  // Initial auth state
  const [isAuthenticated, setIsAuthenticated] =
    useState<boolean>(readAuthStatus());
  const [role, setRole] = useState<string>(readRole());

  // Listen for auth changes
  useEffect(() => {
    const updateAuth = () => {
      setIsAuthenticated(readAuthStatus());
      setRole(readRole());
    };

    window.addEventListener("authChanged", updateAuth);
    return () => window.removeEventListener("authChanged", updateAuth);
  }, []);

  // Logout function
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json();
        alert(`Logout failed: ${data.message || "Unknown error"}`);
        return;
      }

      // Clear flag and notify Navbar
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      window.dispatchEvent(new Event("authChanged"));

      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "rgba(8,18,12,0.7)",
        backdropFilter: "blur(10px)",
        boxShadow: "none",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="h6"
          sx={{ color: "#e6f5ec", fontWeight: "bold", cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          BioTrack
        </Typography>

        <div>
          {isAuthenticated ? (
            <ProtectedRoute>
              <>
                {role === "admin" && (
                  <>
                    <Button
                      sx={{ color: "#b7d7c4", mr: 2, "&:hover": { color: "#8be0a6" } }}
                      onClick={() => navigate("/admin/dashboard")}
                    >
                      Dashboard
                    </Button>
                    <Button
                      sx={{ color: "#b7d7c4", mr: 2, "&:hover": { color: "#8be0a6" } }}
                      onClick={() => navigate("/admin/users")}
                    >
                      Users
                    </Button>
                    <Button
                      sx={{ color: "#b7d7c4", mr: 2, "&:hover": { color: "#8be0a6" } }}
                      onClick={() => navigate("/admin/species")}
                    >
                      Species
                    </Button>
                    <Button
                      sx={{ color: "#b7d7c4", mr: 2, "&:hover": { color: "#8be0a6" } }}
                      onClick={() => navigate("/admin/taxonomy")}
                    >
                      Taxonomy
                    </Button>
                  </>
                )}
                <Button
                  sx={{ color: "#b7d7c4", "&:hover": { color: "#8be0a6" } }}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            </ProtectedRoute>
          ) : (
            <>
              <Button
                sx={{
                  color: "#b7d7c4",
                  mr: 2,
                  "&:hover": { color: "#8be0a6" },
                }}
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
              <Button
                sx={{ color: "#b7d7c4", "&:hover": { color: "#8be0a6" } }}
                onClick={() => navigate("/register")}
              >
                Register
              </Button>
            </>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
