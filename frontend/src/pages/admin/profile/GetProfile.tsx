import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Container,
  Grid,
  Button,
  Box,
  Avatar,
} from "@mui/material";

import type { GetProfileData as Profile } from "../../../interfaces";

const GetProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;

      try {
        const res = await axios.get<{ data: Profile }>(
          `http://localhost:8080/api/admin/${userId}`,
          { withCredentials: true },
        );

        setProfile(res.data.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleEditProfile = () => {
    if (!profile) return;
    navigate(`/admin/edit-profile/${profile._id}`);
  };

  const handleDeleteUser = async () => {
    if (!userId) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?",
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:8080/api/admin/${userId}`, {
        withCredentials: true,
      });

      alert("User deleted successfully");

      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete user");
    }
  };

  if (loading)
    return <Typography sx={{ color: "#b7d7c4", textAlign: "center", mt: 4 }}>Loading...</Typography>;
  if (!profile)
    return (
      <Typography sx={{ color: "#b7d7c4", textAlign: "center", mt: 4 }}>
        Profile not found
      </Typography>
    );

  const address = profile.addresses
    ? `${profile.addresses.street || ""}, ${profile.addresses.city || ""}, ${
        profile.addresses.state || ""
      }, ${profile.addresses.zipCode || ""}, ${profile.addresses.country || ""}`
    : "-";

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Card
        sx={{
          backgroundColor: "rgba(8,18,12,0.72)",
          border: "1px solid rgba(109,220,139,0.18)",
          backdropFilter: "blur(10px)",
          color: "#e6f5ec",
          "& .MuiTypography-root": { color: "#e6f5ec" },
        }}
      >
        <CardContent>
          {/* Header */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Typography variant="h4" sx={{ color: "#e6f5ec", fontWeight: "bold" }}>
              User Profile
            </Typography>

            <Box display="flex" gap={2}>
              <Button
                variant="contained"
                onClick={handleEditProfile}
                sx={{ backgroundColor: "#2f9e5b", "&:hover": { backgroundColor: "#257a47" } }}
              >
                Edit Profile
              </Button>

              <Button
                variant="contained"
                color="error"
                onClick={handleDeleteUser}
                sx={{ boxShadow: "none" }}
              >
                Delete User
              </Button>
            </Box>
          </Box>

          {/* Profile Image */}
          <Box display="flex" justifyContent="center" mb={3}>
            <Avatar
              src={
                profile.profileImageUrl
                  ? `http://localhost:8080/public/${profile.profileImageUrl}`
                  : "http://localhost:8080/public/default/default-profile.jpg"
              }
              sx={{ width: 100, height: 100, border: "2px solid rgba(109,220,139,0.35)" }}
            />
          </Box>

          <Grid container spacing={3}>
            {/* User Info */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="h6" sx={{ color: "#b7d7c4", fontWeight: "bold" }}>
                User Information
              </Typography>
              <Typography sx={{ color: "#b7d7c4" }}>
                Name: <span style={{ color: "#e6f5ec" }}>{profile.userId?.name || "-"}</span>
              </Typography>
              <Typography sx={{ color: "#b7d7c4" }}>
                Email: <span style={{ color: "#e6f5ec" }}>{profile.userId?.email || "-"}</span>
              </Typography>
              <Typography sx={{ color: "#b7d7c4" }}>
                Phone: <span style={{ color: "#e6f5ec" }}>{profile.phoneNo || "-"}</span>
              </Typography>
            </Grid>

            {/* Bio */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="h6" sx={{ color: "#b7d7c4", fontWeight: "bold" }}>
                Bio
              </Typography>
              <Typography sx={{ color: "#e6f5ec" }}>{profile.bio || "-"}</Typography>
            </Grid>

            {/* Address */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="h6" sx={{ color: "#b7d7c4", fontWeight: "bold" }}>
                Address
              </Typography>
              <Typography sx={{ color: "#e6f5ec" }}>{address}</Typography>
            </Grid>

            {/* Social Links */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="h6" sx={{ color: "#b7d7c4", fontWeight: "bold" }}>
                Social Links
              </Typography>
              <Typography sx={{ color: "#b7d7c4" }}>
                Facebook:{" "}
                <span style={{ color: "#e6f5ec" }}>
                  {profile.socialLinks?.facebook || "-"}
                </span>
              </Typography>
              <Typography sx={{ color: "#b7d7c4" }}>
                Instagram:{" "}
                <span style={{ color: "#e6f5ec" }}>
                  {profile.socialLinks?.instagram || "-"}
                </span>
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default GetProfile;
