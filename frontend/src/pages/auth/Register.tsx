import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Paper,
  Typography,
  MenuItem,
} from "@mui/material";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("visitor");

  const handleRegister = () => {
    alert(
      `Name: ${name}\nEmail: ${email}\nPassword: ${password}\nRole: ${role}\n(This is just a design demo)`
    );
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
            Register User
          </Typography>

          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            value={password}
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

          <TextField
            select
            label="Role"
            fullWidth
            margin="normal"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            sx={{
              input: { color: "#fff" },
              label: { color: "#e0f7e9" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#e0f7e9" },
                "&:hover fieldset": { borderColor: "#b2f5ea" },
                "&.Mui-focused fieldset": { borderColor: "#81e6d9" },
              },
            }}
          >
            <MenuItem value="visitor">Visitor</MenuItem>
            <MenuItem value="researcher">Researcher</MenuItem>
          </TextField>

          <Button
            variant="contained"
            color="success"
            fullWidth
            sx={{
              mt: 2,
              backgroundColor: "#2ecc71",
              "&:hover": { backgroundColor: "#27ae60" },
            }}
            onClick={handleRegister}
          >
            Register
          </Button>
        </Paper>
      </Container>
    </>
  );
};

export default Register;