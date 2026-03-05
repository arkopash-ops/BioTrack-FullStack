import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, TextField, Button, Paper, Typography } from "@mui/material";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = () => {
    alert(
      `Email: ${email}\nPassword: ${password}\n(This is just a design demo)`,
    );
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
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
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
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
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
