import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

type SpeciesForm = {
  commonName: string;
  scientificName: string;
  populationStatus: string;
  lifespan: string;
  description: string;
  habitat: string[];
};

type SpeciesImage = {
  url: string;
  public_id?: string;
};

const statusOptions = [
  "Least Concern",
  "Vulnerable",
  "Endangered",
  "Critically Endangered",
  "Extinct",
];

const EditSpecies = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<SpeciesForm>({
    commonName: "",
    scientificName: "",
    populationStatus: "Unknown",
    lifespan: "",
    description: "",
    habitat: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<SpeciesImage[]>([]);
  const [newHabitat, setNewHabitat] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchSpecies = async () => {
      if (!slug) {
        setError("Missing species slug.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(
          `http://localhost:8080/api/species/${slug}`,
          { withCredentials: true },
        );
        if (res.data.success) {
          const data = res.data.data;
          setForm({
            commonName: data.commonName ?? "",
            scientificName: data.scientificName ?? "",
            populationStatus: data.populationStatus ?? "Unknown",
            lifespan: data.lifespan ?? "",
            description: data.description ?? "",
            habitat: data.habitat ?? [],
          });
          setImages(data.images ?? []);
        } else {
          setError(res.data.message || "Failed to load species.");
        }
      } catch (err) {
        console.error("Failed to fetch species:", err);
        setError("Failed to load species.");
      } finally {
        setLoading(false);
      }
    };

    fetchSpecies();
  }, [slug]);

  const handleChange = (field: keyof SpeciesForm) => (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleAddHabitat = () => {
    const value = newHabitat.trim();
    if (!value) return;
    setForm((prev) => ({
      ...prev,
      habitat: prev.habitat.includes(value) ? prev.habitat : [...prev.habitat, value],
    }));
    setNewHabitat("");
  };

  const handleRemoveHabitat = (value: string) => {
    setForm((prev) => ({
      ...prev,
      habitat: prev.habitat.filter((item) => item !== value),
    }));
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!slug || !files || files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append("images", file);
      });
      const res = await axios.post(
        `http://localhost:8080/api/species/${slug}/images`,
        formData,
        { withCredentials: true },
      );
      if (res.data.success) {
        setImages(res.data.data ?? []);
      } else {
        setError(res.data.message || "Failed to upload images.");
      }
    } catch (err) {
      console.error("Failed to upload images:", err);
      setError("Failed to upload images.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (publicId?: string) => {
    if (!slug || !publicId) return;
    setUploading(true);
    setError(null);
    try {
      const res = await axios.delete(
        `http://localhost:8080/api/species/${slug}/images`,
        {
          data: { public_id: publicId },
          withCredentials: true,
        },
      );
      if (res.data.success) {
        setImages(res.data.data ?? []);
      } else {
        setError(res.data.message || "Failed to delete image.");
      }
    } catch (err) {
      console.error("Failed to delete image:", err);
      setError("Failed to delete image.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!slug) {
      setError("Missing species slug.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const res = await axios.patch(
        `http://localhost:8080/api/species/${slug}`,
        form,
        { withCredentials: true },
      );
      if (res.data.success) {
        navigate(`/admin/species/${res.data.data.slug ?? slug}`);
      } else {
        setError(res.data.message || "Failed to update species.");
      }
    } catch (err) {
      console.error("Failed to update species:", err);
      setError("Failed to update species.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper
        elevation={6}
        sx={{
          p: { xs: 3, md: 4 },
          backgroundColor: "rgba(8,18,12,0.72)",
          borderRadius: "16px",
          border: "1px solid rgba(109,220,139,0.18)",
        }}
      >
        <Stack spacing={3}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              variant="outlined"
              onClick={() => navigate(slug ? `/admin/species/${slug}` : "/admin/species")}
              sx={{
                textTransform: "none",
                borderColor: "rgba(109,220,139,0.45)",
                color: "#b7d7c4",
                "&:hover": { borderColor: "#8be0a6", color: "#e6f5ec" },
              }}
            >
              Back to Species
            </Button>
            <Typography variant="h5" sx={{ color: "#e6f5ec", fontWeight: "bold" }}>
              Edit Species
            </Typography>
          </Stack>

          {loading ? (
            <Typography sx={{ color: "#b7d7c4" }}>Loading species...</Typography>
          ) : error ? (
            <Typography sx={{ color: "#f1b7b7" }}>{error}</Typography>
          ) : (
            <Stack spacing={2}>
              <TextField
                label="Common Name"
                value={form.commonName}
                onChange={handleChange("commonName")}
                fullWidth
                sx={{ input: { color: "#e6f5ec" }, label: { color: "#b7d7c4" } }}
              />
              <TextField
                label="Scientific Name"
                value={form.scientificName}
                onChange={handleChange("scientificName")}
                fullWidth
                sx={{ input: { color: "#e6f5ec" }, label: { color: "#b7d7c4" } }}
              />
              <TextField
                select
                label="Population Status"
                value={form.populationStatus}
                onChange={handleChange("populationStatus")}
                fullWidth
                sx={{ input: { color: "#e6f5ec" }, label: { color: "#b7d7c4" } }}
              >
                {statusOptions.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Lifespan"
                value={form.lifespan}
                onChange={handleChange("lifespan")}
                fullWidth
                sx={{ input: { color: "#e6f5ec" }, label: { color: "#b7d7c4" } }}
              />
              <TextField
                label="Description"
                value={form.description}
                onChange={handleChange("description")}
                fullWidth
                multiline
                minRows={4}
                sx={{ textarea: { color: "#e6f5ec" }, label: { color: "#b7d7c4" } }}
              />

              <Divider sx={{ borderColor: "rgba(109,220,139,0.18)" }} />

              <Stack spacing={1}>
                <Typography sx={{ color: "#e6f5ec", fontWeight: 600 }}>
                  Habitats
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField
                    label="Add habitat"
                    value={newHabitat}
                    onChange={(event) => setNewHabitat(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        handleAddHabitat();
                      }
                    }}
                    fullWidth
                    sx={{ input: { color: "#e6f5ec" }, label: { color: "#b7d7c4" } }}
                  />
                  <Button
                    variant="outlined"
                    onClick={handleAddHabitat}
                    sx={{
                      textTransform: "none",
                      borderColor: "rgba(109,220,139,0.45)",
                      color: "#b7d7c4",
                      "&:hover": { borderColor: "#8be0a6", color: "#e6f5ec" },
                    }}
                  >
                    Add
                  </Button>
                </Stack>
                {form.habitat.length === 0 ? (
                  <Typography sx={{ color: "#b7d7c4" }}>
                    No habitats added.
                  </Typography>
                ) : (
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {form.habitat.map((habitat) => (
                      <Chip
                        key={habitat}
                        label={habitat}
                        onDelete={() => handleRemoveHabitat(habitat)}
                        variant="outlined"
                        sx={{
                          color: "#e6f5ec",
                          borderColor: "rgba(109,220,139,0.45)",
                          backgroundColor: "rgba(109,220,139,0.12)",
                        }}
                      />
                    ))}
                  </Stack>
                )}
              </Stack>

              <Divider sx={{ borderColor: "rgba(109,220,139,0.18)" }} />

              <Stack spacing={1}>
                <Typography sx={{ color: "#e6f5ec", fontWeight: 600 }}>
                  Images
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  disabled={uploading}
                  sx={{
                    textTransform: "none",
                    borderColor: "rgba(109,220,139,0.45)",
                    color: "#b7d7c4",
                    "&:hover": { borderColor: "#8be0a6", color: "#e6f5ec" },
                    width: "fit-content",
                  }}
                >
                  {uploading ? "Uploading..." : "Upload Images"}
                  <input
                    type="file"
                    hidden
                    multiple
                    accept="image/*"
                    onChange={(event) => handleImageUpload(event.target.files)}
                  />
                </Button>
                {images.length === 0 ? (
                  <Typography sx={{ color: "#b7d7c4" }}>
                    No images uploaded.
                  </Typography>
                ) : (
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                      gap: 16,
                    }}
                  >
                    {images.map((image) => (
                      <Paper
                        key={image.public_id ?? image.url}
                        elevation={0}
                        sx={{
                          p: 1.5,
                          backgroundColor: "rgba(11,28,18,0.7)",
                          borderRadius: "12px",
                          border: "1px solid rgba(109,220,139,0.12)",
                        }}
                      >
                        <Box
                          component="img"
                          src={image.url}
                          alt={form.commonName || "Species image"}
                          sx={{
                            width: "100%",
                            height: 140,
                            objectFit: "cover",
                            borderRadius: "10px",
                            border: "1px solid rgba(109,220,139,0.18)",
                          }}
                        />
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleDeleteImage(image.public_id)}
                          disabled={uploading || !image.public_id}
                          sx={{
                            mt: 1,
                            textTransform: "none",
                            borderColor: "rgba(245,120,120,0.6)",
                            color: "#f1b7b7",
                            "&:hover": {
                              borderColor: "rgba(245,120,120,0.9)",
                              color: "#ffd6d6",
                            },
                          }}
                        >
                          Remove
                        </Button>
                      </Paper>
                    ))}
                  </Box>
                )}
              </Stack>

              <Box>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={saving}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    backgroundColor: "#2f7d4b",
                    "&:hover": { backgroundColor: "#3b9960" },
                  }}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </Box>
            </Stack>
          )}
        </Stack>
      </Paper>
    </Container>
  );
};

export default EditSpecies;
