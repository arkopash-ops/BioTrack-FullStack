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

  if (loading) return <Typography>Loading...</Typography>;
  if (!profile) return <Typography>Profile not found</Typography>;

  const address = profile.addresses
    ? `${profile.addresses.street || ""}, ${profile.addresses.city || ""}, ${
        profile.addresses.state || ""
      }, ${profile.addresses.zipCode || ""}, ${profile.addresses.country || ""}`
    : "-";

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Card>
        <CardContent>
          {/* Header */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Typography variant="h4">User Profile</Typography>

            <Box display="flex" gap={2}>
              <Button variant="contained" onClick={handleEditProfile}>
                Edit Profile
              </Button>

              <Button
                variant="contained"
                color="error"
                onClick={handleDeleteUser}
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
              sx={{ width: 100, height: 100 }}
            />
          </Box>

          <Grid container spacing={3}>
            {/* User Info */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="h6">User Information</Typography>
              <Typography>Name: {profile.userId?.name || "-"}</Typography>
              <Typography>Email: {profile.userId?.email || "-"}</Typography>
              <Typography>Phone: {profile.phoneNo || "-"}</Typography>
            </Grid>

            {/* Bio */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="h6">Bio</Typography>
              <Typography>{profile.bio || "-"}</Typography>
            </Grid>

            {/* Address */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="h6">Address</Typography>
              <Typography>{address}</Typography>
            </Grid>

            {/* Social Links */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="h6">Social Links</Typography>
              <Typography>
                Facebook: {profile.socialLinks?.facebook || "-"}
              </Typography>
              <Typography>
                Instagram: {profile.socialLinks?.instagram || "-"}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default GetProfile;
