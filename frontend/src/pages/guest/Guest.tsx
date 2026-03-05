import React from "react";
import { Container, Paper, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Guest: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container
      maxWidth="sm"
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          width: "100%",
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255,255,255,0.1)",
          borderRadius: "16px",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ color: "#fff", fontWeight: "bold" }}
        >
          Welcome, Guest!
        </Typography>

        <Typography variant="body1" sx={{ color: "#e0f7e9", mb: 3 }}>
          You’re currently browsing as a guest. To access all features, please
          create an account.
        </Typography>

        <Button
          variant="contained"
          fullWidth
          sx={{
            backgroundColor: "#2ecc71",
            color: "#fff",
            "&:hover": { backgroundColor: "#27ae60" },
          }}
          onClick={() => navigate("/register")}
        >
          Create Account
        </Button>

        <Button
          variant="text"
          fullWidth
          sx={{
            color: "#e0f7e9",
            mt: 2,
            "&:hover": { textDecoration: "underline", color: "#185c26" },
          }}
          onClick={() => navigate("/login")}
        >
          Already have an account? Login
        </Button>
      </Paper>
    </Container>
  );
};

export default Guest;
