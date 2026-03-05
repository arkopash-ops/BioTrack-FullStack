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
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(`Error: ${data.message || "Registration failed"}`);
        return;
      }

      navigate("/dashboard", { state: { user: data.user } });
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
          Register
        </Typography>

        <TextField
          label="Name"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setName(e.target.value)
          }
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon sx={{ color: "#e0f7e9" }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            input: { color: "#fff" },
            label: { color: "#e0f7e9" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#e0f7e9" },
              "&:hover fieldset": { borderColor: "#b2f5ea" },
              "&.Mui-focused fieldset": { borderColor: "#81e6d9" },
            },
          }}
        />

        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon sx={{ color: "#e0f7e9" }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            input: { color: "#fff" },
            label: { color: "#e0f7e9" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#e0f7e9" },
              "&:hover fieldset": { borderColor: "#b2f5ea" },
              "&.Mui-focused fieldset": { borderColor: "#81e6d9" },
            },
          }}
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: "#e0f7e9" }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            input: { color: "#fff" },
            label: { color: "#e0f7e9" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#e0f7e9" },
              "&:hover fieldset": { borderColor: "#b2f5ea" },
              "&.Mui-focused fieldset": { borderColor: "#81e6d9" },
            },
          }}
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
          onClick={handleRegister}
        >
          Register
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
          onClick={() => navigate("/")}
        >
          Already have an account? Login
        </Typography>
      </Paper>
    </Container>
  );
};

export default Register;
