import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Avatar,
  Stack,
  Link,
} from "@mui/material";
import Grid from "@mui/system/Grid";
import PersonIcon from "@mui/icons-material/Person";
import SecurityIcon from "@mui/icons-material/Security";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PublicIcon from "@mui/icons-material/Public";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Profile {
  _id: string;

  userId: {
    name: string;
    role: string;
  };

  bio: string;
  profileImageUrl: string;
  phoneNo: string;

  addresses: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };

  socialLinks: {
    facebook: string;
    instagram: string;
  };

  createdAt: string;
  updatedAt: string;
}

const Dashboard: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get<{ profile: Profile }>(
          "http://localhost:8080/api/profile/me",
          { withCredentials: true },
        );

        setProfile(res.data.profile);
      } catch (error: unknown) {
        console.error("Failed to fetch profile:", error);

        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            localStorage.removeItem("isAuthenticated");
            window.dispatchEvent(new Event("authChanged"));
            navigate("/login");
          }
        }
      }
    };

    fetchUser();
  }, [navigate]);

  if (!profile) return <Typography>Loading...</Typography>;

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
          sx={{ color: "#fff", fontWeight: "bold", textAlign: "center", mb: 4 }}
        >
          User Dashboard
        </Typography>

        <Grid container spacing={3}>
          {/* Profile Image */}
          <Grid size={{ xs: 12 }}>
            <Stack alignItems="center">
              <Avatar
                alt={profile.userId.name}
                src={`http://localhost:8080/public/${profile.profileImageUrl}`}
                sx={{ width: 80, height: 80 }}
              />
            </Stack>
          </Grid>

          {/* Name */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <PersonIcon />
              <Typography>
                <strong>Name:</strong> {profile.userId.name}
              </Typography>
            </Stack>
          </Grid>

          {/* Role */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <SecurityIcon />
              <Typography>
                <strong>Role:</strong> {profile.userId.role}
              </Typography>
            </Stack>
          </Grid>

          {/* Bio */}
          <Grid size={{ xs: 12 }}>
            <Typography>
              <strong>Bio:</strong> {profile.bio}
            </Typography>
          </Grid>

          {/* Phone */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <PhoneIcon />
              <Typography>
                <strong>Phone:</strong> {profile.phoneNo}
              </Typography>
            </Stack>
          </Grid>

          {/* Address */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <LocationOnIcon />
              <Typography>
                <strong>Address:</strong>
                <br />
                {profile.addresses.street}
                <br />
                {profile.addresses.city}, {profile.addresses.state}
                <br />
                {profile.addresses.zip}, {profile.addresses.country}
              </Typography>
            </Stack>
          </Grid>

          {/* Social Links */}
          <Grid size={{ xs: 12 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <PublicIcon />
              <Typography>
                <strong>Facebook:</strong>{" "}
                <Link href={profile.socialLinks.facebook} target="_blank">
                  Open
                </Link>
              </Typography>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <PublicIcon />
              <Typography>
                <strong>Instagram:</strong>{" "}
                <Link href={profile.socialLinks.instagram} target="_blank">
                  Open
                </Link>
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Dashboard;
