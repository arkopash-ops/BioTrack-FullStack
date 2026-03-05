import { useLocation } from "react-router-dom";
import {
  Container,
  Typography,
  Paper,
  Chip,
  Avatar,
  Stack,
} from "@mui/material";
import Grid from "@mui/system/Grid";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import SecurityIcon from "@mui/icons-material/Security";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import CookieIcon from "@mui/icons-material/Cookie";

interface User {
  name: string;
  email: string;
  password: string;
  role: string;
  status: string;
}

interface LocationState {
  user: User;
}

const Dashboard: React.FC = () => {
  const location = useLocation();
  const state = location.state as LocationState;
  const { user } = state;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "success";
      case "inactive":
        return "default";
      case "banned":
        return "error";
      default:
        return "primary";
    }
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 5,
          borderRadius: "16px",
          width: "100%",
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255,255,255,0.1)",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            color: "#fff",
            fontWeight: "bold",
            textAlign: "center",
            mb: 4,
          }}
        >
          User Dashboard
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: "#2ecc71" }}>
                <PersonIcon />
              </Avatar>
              <Typography sx={{ color: "#fff" }}>
                <strong>Name:</strong> {user.name}
              </Typography>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: "#9c27b0" }}>
                <EmailIcon />
              </Avatar>
              <Typography sx={{ color: "#fff" }}>
                <strong>Email:</strong> {user.email}
              </Typography>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: "#f44336" }}>
                <LockIcon />
              </Avatar>
              <Typography sx={{ color: "#fff" }}>
                <strong>Password (hashed):</strong> {user.password}
              </Typography>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: "#ff9800" }}>
                <SecurityIcon />
              </Avatar>
              <Typography sx={{ color: "#fff" }}>
                <strong>Role:</strong> {user.role}
              </Typography>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: "#4caf50" }}>
                <VerifiedUserIcon />
              </Avatar>
              <Chip
                label={user.status}
                color={getStatusColor(user.status)}
                size="small"
              />
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: "#795548" }}>
                <CookieIcon />
              </Avatar>
              <Typography sx={{ color: "#fff" }}>
                <strong>Token:</strong> Stored in your browser cookie
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Dashboard;
