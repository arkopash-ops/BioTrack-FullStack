import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Paper,
  Typography,
  InputAdornment,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(`Login failed: ${data.message || "Invalid credentials"}`);
        return;
      }

      // Save token and notify Navbar
      if (data.token) {
        localStorage.setItem("token", data.token);
        window.dispatchEvent(new Event("authChanged"));
      }

      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

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
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ color: "#fff", fontWeight: "bold" }}
        >
          Login
        </Typography>

        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon sx={{ color: "#e0f7e9" }} />
              </InputAdornment>
            ),
          }}
          sx={{ input: { color: "#fff" }, label: { color: "#e0f7e9" } }}
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon sx={{ color: "#e0f7e9" }} />
              </InputAdornment>
            ),
          }}
          sx={{ input: { color: "#fff" }, label: { color: "#e0f7e9" } }}
        />

        <Button
          variant="contained"
          color="success"
          fullWidth
          endIcon={<ArrowForwardIcon />}
          sx={{
            mt: 2,
            backgroundColor: "#2ecc71",
            "&:hover": { backgroundColor: "#27ae60" },
          }}
          onClick={handleLogin}
        >
          Login
        </Button>

        <Typography
          variant="body2"
          align="center"
          sx={{
            color: "#e0f7e9",
            mt: 2,
            cursor: "pointer",
            "&:hover": { color: "#185c29", textDecoration: "underline" },
          }}
          onClick={() => navigate("/register")}
        >
          Don't have an account? Register
        </Typography>
      </Paper>
    </Container>
  );
};

export default Login;
