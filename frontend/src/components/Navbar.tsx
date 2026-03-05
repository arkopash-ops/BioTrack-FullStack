import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const navigate = useNavigate();

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
            sx={{
              color: "#e0f7e9",
              "&:hover": { color: "#185c29" },
            }}
            onClick={() => navigate("/register")}
          >
            Register
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
