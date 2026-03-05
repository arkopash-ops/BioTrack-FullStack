import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Paper,
  Typography,
} from "@mui/material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    alert(`Email: ${email}\nPassword: ${password}\n(This is just a design demo)`);
  };

  return (
    <>
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
            Species Research Login
          </Typography>

          <TextField
            label="Email"
            fullWidth
            margin="normal"
            onChange={(e) => setEmail(e.target.value)}
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
            onChange={(e) => setPassword(e.target.value)}
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
            sx={{ mt: 2, backgroundColor: "#2ecc71", "&:hover": { backgroundColor: "#27ae60" } }}
            onClick={handleLogin}
          >
            Login
          </Button>
        </Paper>
      </Container>
    </>
  );
};

export default Login;