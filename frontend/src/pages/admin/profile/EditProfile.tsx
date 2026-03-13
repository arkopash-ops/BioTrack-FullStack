import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Stack,
  Avatar,
  Paper,
  Box,
} from "@mui/material";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import type { Profile } from "../../../interfaces";

const defaultProfile: Profile = {
  _id: "",
  userId: { name: "", role: "" },
  bio: "",
  profileImageUrl: "",
  phoneNo: "",
  addresses: {
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  },
  socialLinks: {
    facebook: "",
    instagram: "",
  },
};

const EditProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const imageSrc = profile.profileImageUrl
    ? profile.profileImageUrl.startsWith("blob:") ||
      profile.profileImageUrl.startsWith("http")
      ? profile.profileImageUrl
      : `http://localhost:8080/public/${profile.profileImageUrl}`
    : "http://localhost:8080/public/default/default-profile.jpg";

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;

      try {
        const res = await axios.get<{ data: Profile }>(
          `http://localhost:8080/api/admin/${userId}`,
          { withCredentials: true },
        );

        const data = res.data.data;

        setProfile({
          ...defaultProfile,
          ...data,
          addresses: { ...defaultProfile.addresses, ...data.addresses },
          socialLinks: { ...defaultProfile.socialLinks, ...data.socialLinks },
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    const file = e.target.files[0];
    setImageFile(file);

    const previewUrl = URL.createObjectURL(file);

    setProfile((prev) => ({
      ...prev,
      profileImageUrl: previewUrl,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const key = name.split(".")[1];

      setProfile((prev) => ({
        ...prev,
        addresses: { ...prev.addresses, [key]: value },
      }));
    } else if (name.startsWith("social.")) {
      const key = name.split(".")[1];

      setProfile((prev) => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, [key]: value },
      }));
    } else if (name === "userId.name") {
      setProfile((prev) => ({
        ...prev,
        userId: { ...prev.userId, name: value },
      }));
    } else {
      setProfile((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!profile.userId.name.trim()) newErrors.name = "Name is required";

    if (profile.phoneNo && !/^\d{10}$/.test(profile.phoneNo))
      newErrors.phoneNo = "Phone must be 10 digits";

    if (!profile.bio.trim()) newErrors.bio = "Bio is required";

    if (imageFile) {
      if (!imageFile.type.startsWith("image/")) {
        newErrors.profileImage = "Only image files are allowed";
      } else if (imageFile.size > 2 * 1024 * 1024) {
        newErrors.profileImage = "Image must be smaller than 2MB";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || !userId) return;

    try {
      const formData = new FormData();

      formData.append("bio", profile.bio);
      formData.append("phoneNo", profile.phoneNo);
      formData.append("name", profile.userId.name);

      formData.append("facebook", profile.socialLinks.facebook);
      formData.append("instagram", profile.socialLinks.instagram);

      formData.append("street", profile.addresses.street);
      formData.append("city", profile.addresses.city);
      formData.append("state", profile.addresses.state);
      formData.append("zip", profile.addresses.zip);
      formData.append("country", profile.addresses.country);

      if (imageFile) {
        formData.append("profileImage", imageFile);
      }

      const res = await axios.put(
        `http://localhost:8080/api/admin/${userId}`,
        formData,
        { withCredentials: true },
      );

      if (res.data.success) {
        alert("Profile updated successfully!");
        navigate("/admin/dashboard");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to update profile");
    }
  };

  if (loading)
    return <Typography sx={{ color: "#b7d7c4", textAlign: "center", mt: 4 }}>Loading...</Typography>;

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper
        sx={{
          p: 4,
          backgroundColor: "rgba(8,18,12,0.72)",
          border: "1px solid rgba(109,220,139,0.18)",
          backdropFilter: "blur(10px)",
          color: "#e6f5ec",
          "& .MuiTypography-root": { color: "#e6f5ec" },
          "& .MuiFormLabel-root": { color: "#b7d7c4" },
          "& .MuiInputBase-input": { color: "#e6f5ec" },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(109,220,139,0.35)",
          },
          "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(139,224,166,0.6)",
          },
          "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#8be0a6",
          },
          "& .MuiFormHelperText-root": { color: "#b7d7c4" },
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ color: "#e6f5ec", fontWeight: "bold" }}>
          Edit User Profile
        </Typography>

        <Stack spacing={3}>
          {/* Profile Image */}
          <Stack alignItems="center" spacing={1}>
            <Avatar
              src={imageSrc}
              sx={{ width: 90, height: 90, border: "2px solid rgba(109,220,139,0.35)" }}
            />

            <Button component="label" variant="text" sx={{ color: "#8be0a6" }}>
              Change Profile Image
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>
            {errors.profileImage && (
              <Typography color="error" variant="body2">
                {errors.profileImage}
              </Typography>
            )}
          </Stack>

          <TextField
            label="Name"
            name="userId.name"
            value={profile.userId.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
          />

          <TextField
            label="Phone Number"
            name="phoneNo"
            value={profile.phoneNo}
            onChange={handleChange}
            error={!!errors.phoneNo}
            helperText={errors.phoneNo}
            fullWidth
          />

          <TextField
            label="Bio"
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            error={!!errors.bio}
            helperText={errors.bio}
            multiline
            rows={3}
            fullWidth
          />

          <Typography variant="h6" sx={{ color: "#b7d7c4", fontWeight: "bold" }}>
            Address
          </Typography>

          <TextField
            label="Street"
            name="address.street"
            value={profile.addresses.street}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="City"
            name="address.city"
            value={profile.addresses.city}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="State"
            name="address.state"
            value={profile.addresses.state}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="ZIP"
            name="address.zip"
            value={profile.addresses.zip}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Country"
            name="address.country"
            value={profile.addresses.country}
            onChange={handleChange}
            fullWidth
          />

          <Typography variant="h6" sx={{ color: "#b7d7c4", fontWeight: "bold" }}>
            Social Links
          </Typography>

          <TextField
            label="Facebook"
            name="social.facebook"
            value={profile.socialLinks.facebook}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Instagram"
            name="social.instagram"
            value={profile.socialLinks.instagram}
            onChange={handleChange}
            fullWidth
          />

          <Box display="flex" gap={2}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleSubmit}
              sx={{ backgroundColor: "#2f9e5b", "&:hover": { backgroundColor: "#257a47" } }}
            >
              Update Profile
            </Button>

            <Button
              variant="outlined"
              fullWidth
              onClick={() => navigate("/admin/users")}
              sx={{ color: "#b7d7c4", borderColor: "rgba(109,220,139,0.45)" }}
            >
              Cancel
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
};

export default EditProfile;
