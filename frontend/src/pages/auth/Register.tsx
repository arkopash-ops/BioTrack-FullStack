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
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(`Error: ${data.message || "Registration failed"}`);
        return;
      }

      // Save flag and notify Navbar
      if (data.success) {
        localStorage.setItem("isAuthenticated", "true");
        window.dispatchEvent(new Event("authChanged"));
      }

      navigate("/visitor/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
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
          backgroundColor: "rgba(8,18,12,0.72)",
          borderRadius: "16px",
          border: "1px solid rgba(109,220,139,0.18)",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ color: "#e6f5ec", fontWeight: "bold" }}
        >
          Register
        </Typography>

        <TextField
          label="Name"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon sx={{ color: "#b7d7c4" }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{ input: { color: "#e6f5ec" }, label: { color: "#b7d7c4" } }}
        />

        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon sx={{ color: "#b7d7c4" }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{ input: { color: "#e6f5ec" }, label: { color: "#b7d7c4" } }}
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: "#b7d7c4" }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{ input: { color: "#e6f5ec" }, label: { color: "#b7d7c4" } }}
        />

        <Button
          variant="contained"
          color="success"
          fullWidth
          endIcon={<ArrowForwardIcon />}
          sx={{
            mt: 2,
            backgroundColor: "#2f9e5b",
            "&:hover": { backgroundColor: "#257a47" },
          }}
          onClick={handleRegister}
        >
          Register
        </Button>

        <Typography
          variant="body2"
          align="center"
          sx={{
            color: "#b7d7c4",
            mt: 2,
            cursor: "pointer",
            "&:hover": { color: "#8be0a6", textDecoration: "underline" },
          }}
          onClick={() => navigate("/login")}
        >
          Already have an account? Login
        </Typography>
      </Paper>
    </Container>
  );
};

export default Register;
