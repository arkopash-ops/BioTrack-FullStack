import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  // Initial auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    localStorage.getItem("isAuthenticated") === "true",
  );

  // Listen for auth changes
  useEffect(() => {
    const updateAuth = () => {
      setIsAuthenticated(localStorage.getItem("isAuthenticated") === "true");
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
        backgroundColor: "rgba(255,255,255,0.1)",
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
          sx={{ color: "#fff", fontWeight: "bold", cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          BioTrack
        </Typography>

        <div>
          {isAuthenticated ? (
            <Button
              sx={{ color: "#e0f7e9", "&:hover": { color: "#185c29" } }}
              onClick={handleLogout}
            >
              Logout
            </Button>
          ) : (
            <>
              <Button
                sx={{
                  color: "#e0f7e9",
                  mr: 2,
                  "&:hover": { color: "#185c29" },
                }}
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
              <Button
                sx={{ color: "#e0f7e9", "&:hover": { color: "#185c29" } }}
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
