import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  Chip,
  Divider,
  Button,
  Skeleton,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import SpeciesHabitatMap from "../../../components/SpeciesHabitatMap";
import TreeChart from "../../../components/TreeChart";
import SpeciesCard from "../../../components/SpeciesCard";
import type { TreeNode as TaxonomyTreeNode } from "../../../components/TreeChart";

type SpeciesImage = {
  url: string;
  public_id?: string;
};

type SpeciesDetails = {
  _id: string;
  commonName: string;
  scientificName: string;
  slug: string;
  aliases?: string[];
  populationStatus?: string;
  description?: string;
  lifespan?: string;
  firstDiscovery?: string | null;
  habitat?: string[];
  habitatArea?: {
    type?: string;
    coordinates?: number[][][][] | number[][][];
  };
  taxonomy?: {
    kingdom?: string | { _id?: string; name?: string } | null;
    phylum?: string | { _id?: string; name?: string } | null;
    class?: string | { _id?: string; name?: string } | null;
    order?: string | { _id?: string; name?: string } | null;
    family?: string | { _id?: string; name?: string } | null;
    genus?: string | { _id?: string; name?: string } | null;
  };
  predecessor?: string | null;
  successor?: string[];
  images?: SpeciesImage[];
  createdAt?: string;
  updatedAt?: string;
};

type RelatedSpecies = {
  _id: string;
  commonName: string;
  scientificName: string;
  slug: string;
  populationStatus?: string;
  taxonomy?: {
    genus?: string | { _id?: string; name?: string } | null;
    family?: string | { _id?: string; name?: string } | null;
  };
  images?: SpeciesImage[];
};

const formatDate = (value?: string | null) => {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
};

const toTaxonomyNode = (
  rank: string,
  value?: string | { _id?: string; name?: string } | null,
): TaxonomyTreeNode | null => {
  if (!value) return null;
  const name = typeof value === "string" ? value : value.name || value._id;
  if (!name) return null;
  const id = typeof value === "string" ? `${rank}-${name}` : value._id ?? `${rank}-${name}`;
  return { _id: id, name, rank };
};

const GetSpecies = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [species, setSpecies] = useState<SpeciesDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [relatedSpecies, setRelatedSpecies] = useState<RelatedSpecies[]>([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [relatedError, setRelatedError] = useState<string | null>(null);

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
        const res = await axios.get(`http://localhost:8080/api/species/${slug}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setSpecies(res.data.data);
          setImageIndex(0);
        } else {
          setError(res.data.message || "Failed to load species.");
        }
      } catch (err) {
        console.error("Error fetching species:", err);
        setError("Failed to load species.");
      } finally {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setLoading(false);
      }
    };

    fetchSpecies();
  }, [slug]);

  useEffect(() => {
    if (!slug) return;

    let isMounted = true;

    const fetchRelatedSpecies = async () => {
      setRelatedLoading(true);
      setRelatedError(null);
      try {
        const res = await axios.get(
          `http://localhost:8080/api/species/${slug}/related`,
          { withCredentials: true },
        );
        if (!isMounted) return;
        if (res.data.success) {
          setRelatedSpecies(res.data.data || []);
        } else {
          setRelatedError(res.data.message || "Failed to load related species.");
        }
      } catch (err) {
        console.error("Error fetching related species:", err);
        if (isMounted) {
          setRelatedError("Failed to load related species.");
        }
      } finally {
        if (isMounted) {
          setRelatedLoading(false);
        }
      }
    };

    fetchRelatedSpecies();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const activeImage = useMemo(
    () => {
      if (!species?.images || species.images.length === 0) return null;
      const safeIndex = Math.min(
        Math.max(imageIndex, 0),
        species.images.length - 1,
      );
      return species.images[safeIndex]?.url ?? null;
    },
    [species?.images, imageIndex],
  );
  const taxonomyTree = useMemo<TaxonomyTreeNode | null>(() => {
    const levels = [
      ["Kingdom", species?.taxonomy?.kingdom],
      ["Phylum", species?.taxonomy?.phylum],
      ["Class", species?.taxonomy?.class],
      ["Order", species?.taxonomy?.order],
      ["Family", species?.taxonomy?.family],
      ["Genus", species?.taxonomy?.genus],
    ] as const;

    const nodes = levels
      .map(([rank, value]) => toTaxonomyNode(rank, value))
      .filter((node): node is TaxonomyTreeNode => Boolean(node));

    const speciesName = species?.commonName || species?.scientificName;
    if (speciesName) {
      nodes.push({
        _id: `Species-${speciesName}`,
        name: speciesName,
        rank: "Species",
      });
    }

    if (nodes.length === 0) return null;

    for (let i = 0; i < nodes.length - 1; i += 1) {
      nodes[i].children = [nodes[i + 1]];
    }

    return nodes[0];
  }, [species?.taxonomy, species?.commonName, species?.scientificName]);

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Stack spacing={3}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Button
            variant="outlined"
            onClick={() => navigate("/admin/species")}
            sx={{
              textTransform: "none",
              borderColor: "rgba(109,220,139,0.45)",
              color: "#b7d7c4",
              "&:hover": { borderColor: "#8be0a6", color: "#e6f5ec" },
            }}
          >
            Back to Species
          </Button>
          <Typography
            variant="h4"
            sx={{ color: "#e6f5ec", fontWeight: "bold" }}
          >
            Species Details
          </Typography>
        </Stack>

        {loading ? (
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
              <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
                <Stack spacing={2} alignItems="center" sx={{ width: { xs: "100%", md: 420 } }}>
                  <Skeleton
                    variant="rounded"
                    width="100%"
                    height={320}
                    sx={{ bgcolor: "rgba(109,220,139,0.12)" }}
                  />
                  <Skeleton
                    variant="rounded"
                    width={160}
                    height={36}
                    sx={{ bgcolor: "rgba(109,220,139,0.12)" }}
                  />
                </Stack>
                <Stack spacing={2} flex={1}>
                  <Skeleton variant="text" height={44} sx={{ bgcolor: "rgba(109,220,139,0.12)" }} />
                  <Skeleton variant="text" height={28} sx={{ bgcolor: "rgba(109,220,139,0.12)" }} />
                  <Stack direction="row" spacing={1}>
                    <Skeleton variant="rounded" width={120} height={28} sx={{ bgcolor: "rgba(109,220,139,0.12)" }} />
                    <Skeleton variant="rounded" width={140} height={28} sx={{ bgcolor: "rgba(109,220,139,0.12)" }} />
                  </Stack>
                  <Skeleton variant="rounded" height={80} sx={{ bgcolor: "rgba(109,220,139,0.12)" }} />
                </Stack>
              </Stack>
              <Divider sx={{ borderColor: "rgba(109,220,139,0.18)" }} />
              <Stack spacing={2}>
                <Skeleton variant="text" height={32} sx={{ bgcolor: "rgba(109,220,139,0.12)" }} />
                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                  <Skeleton variant="rounded" height={120} sx={{ flex: 1, bgcolor: "rgba(109,220,139,0.12)" }} />
                  <Skeleton variant="rounded" height={120} sx={{ flex: 1, bgcolor: "rgba(109,220,139,0.12)" }} />
                </Stack>
              </Stack>
              <Stack spacing={2}>
                <Skeleton variant="text" height={32} sx={{ bgcolor: "rgba(109,220,139,0.12)" }} />
                <Skeleton variant="rounded" height={200} sx={{ bgcolor: "rgba(109,220,139,0.12)" }} />
              </Stack>
            </Stack>
          </Paper>
        ) : error ? (
          <Paper
            elevation={6}
            sx={{
              p: 3,
              backgroundColor: "rgba(8,18,12,0.72)",
              borderRadius: "16px",
              border: "1px solid rgba(109,220,139,0.18)",
            }}
          >
            <Typography sx={{ color: "#f1b7b7" }}>{error}</Typography>
          </Paper>
        ) : !species ? (
          <Typography sx={{ color: "#b7d7c4" }}>Species not found.</Typography>
        ) : (
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
              <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
                <Stack spacing={2} alignItems="center" sx={{ width: { xs: "100%", md: 420 } }}>
                  <Box
                    sx={{
                      width: "100%",
                      height: { xs: 240, sm: 300, md: 360 },
                      borderRadius: "16px",
                      overflow: "hidden",
                      border: "1px solid rgba(109,220,139,0.18)",
                      background:
                        "linear-gradient(135deg, rgba(59,191,122,0.25), rgba(6,19,12,0.8))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {activeImage ? (
                      <Box
                        component="img"
                        src={activeImage}
                        alt={species.commonName}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          backgroundColor: "rgba(6,19,12,0.6)",
                        }}
                      />
                    ) : (
                      <Typography sx={{ color: "#b7d7c4" }}>
                        No images available.
                      </Typography>
                    )}
                  </Box>
                  {species.images && species.images.length > 0 ? (
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Button
                        variant="outlined"
                        onClick={() => {
                          if (!species.images) return;
                          setImageIndex((prev) =>
                            prev === 0 ? species.images!.length - 1 : prev - 1,
                          );
                        }}
                        sx={{
                          minWidth: 40,
                          textTransform: "none",
                          borderColor: "rgba(109,220,139,0.45)",
                          color: "#b7d7c4",
                          "&:hover": {
                            borderColor: "#8be0a6",
                            color: "#e6f5ec",
                          },
                        }}
                      >
                        &lt;
                      </Button>
                      <Typography sx={{ color: "#b7d7c4" }}>
                        {imageIndex + 1} / {species.images.length}
                      </Typography>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          if (!species.images) return;
                          setImageIndex((prev) =>
                            prev === species.images!.length - 1 ? 0 : prev + 1,
                          );
                        }}
                        sx={{
                          minWidth: 40,
                          textTransform: "none",
                          borderColor: "rgba(109,220,139,0.45)",
                          color: "#b7d7c4",
                          "&:hover": {
                            borderColor: "#8be0a6",
                            color: "#e6f5ec",
                          },
                        }}
                      >
                        &gt;
                      </Button>
                    </Stack>
                  ) : null}
                </Stack>

                <Stack spacing={1} flex={1}>
                  <Typography
                    variant="h5"
                    sx={{ color: "#e6f5ec", fontWeight: "bold" }}
                  >
                    {species.commonName}
                  </Typography>
                  <Typography sx={{ color: "#b7d7c4" }}>
                    {species.scientificName}
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Chip
                      label={species.populationStatus || "Unknown"}
                      size="small"
                      color="success"
                      variant="outlined"
                      sx={{
                        color: "#b7d7c4",
                        borderColor: "rgba(109,220,139,0.45)",
                      }}
                    />
                    <Chip
                      label={`Slug: ${species.slug}`}
                      size="small"
                      variant="outlined"
                      sx={{
                        color: "#b7d7c4",
                        borderColor: "rgba(109,220,139,0.35)",
                      }}
                    />
                  </Stack>
                  {species.description ? (
                    <Typography sx={{ color: "#e6f5ec", mt: 1 }}>
                      {species.description}
                    </Typography>
                  ) : null}
                  <Button
                    variant="contained"
                    onClick={() => navigate(`/admin/species/${species.slug}/evolution-tree`)}
                    sx={{
                      mt: 2,
                      alignSelf: "flex-start",
                      textTransform: "none",
                      fontWeight: 600,
                      backgroundColor: "#2f7d4b",
                      "&:hover": { backgroundColor: "#3b9960" },
                    }}
                  >
                    See Evolution Tree
                  </Button>
                </Stack>
              </Stack>

              <Divider sx={{ borderColor: "rgba(109,220,139,0.18)" }} />

              <Stack spacing={2}>
                <Typography
                  variant="h6"
                  sx={{ color: "#e6f5ec", fontWeight: "bold" }}
                >
                  Key Details
                </Typography>
                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                  <Paper
                    elevation={0}
                    sx={{
                      flex: 1,
                      p: 2,
                      backgroundColor: "rgba(11,28,18,0.7)",
                      borderRadius: "12px",
                      border: "1px solid rgba(109,220,139,0.12)",
                    }}
                  >
                    <Stack spacing={1}>
                      <Typography sx={{ color: "#b7d7c4" }}>
                        First Discovery
                      </Typography>
                      <Typography sx={{ color: "#e6f5ec" }}>
                        {formatDate(species.firstDiscovery)}
                      </Typography>
                      <Typography sx={{ color: "#b7d7c4", mt: 1 }}>
                        Lifespan
                      </Typography>
                      <Typography sx={{ color: "#e6f5ec" }}>
                        {species.lifespan || "Not available"}
                      </Typography>
                    </Stack>
                  </Paper>

                  <Paper
                    elevation={0}
                    sx={{
                      flex: 1,
                      p: 2,
                      backgroundColor: "rgba(11,28,18,0.7)",
                      borderRadius: "12px",
                      border: "1px solid rgba(109,220,139,0.12)",
                    }}
                  >
                    <Stack spacing={1}>
                      <Typography sx={{ color: "#b7d7c4" }}>
                        Habitat
                      </Typography>
                      {species.habitat && species.habitat.length > 0 ? (
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          {species.habitat.map((habitat, index) => (
                            <Chip
                              key={`${habitat}-${index}`}
                              label={habitat}
                              size="small"
                              variant="outlined"
                              sx={{
                                color: "#e6f5ec",
                                borderColor:
                                  index % 3 === 0
                                    ? "rgba(139,224,166,0.6)"
                                    : index % 3 === 1
                                      ? "rgba(91,198,229,0.6)"
                                      : "rgba(245,196,104,0.6)",
                                backgroundColor:
                                  index % 3 === 0
                                    ? "rgba(139,224,166,0.15)"
                                    : index % 3 === 1
                                      ? "rgba(91,198,229,0.15)"
                                      : "rgba(245,196,104,0.15)",
                              }}
                            />
                          ))}
                        </Stack>
                      ) : (
                        <Typography sx={{ color: "#e6f5ec" }}>
                          Not available
                        </Typography>
                      )}
                    </Stack>
                  </Paper>
                </Stack>
              </Stack>

              <Stack spacing={2}>
                <Typography
                  variant="h6"
                  sx={{ color: "#e6f5ec", fontWeight: "bold" }}
                >
                  Taxonomy
                </Typography>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    backgroundColor: "rgba(11,28,18,0.7)",
                    borderRadius: "12px",
                    border: "1px solid rgba(109,220,139,0.12)",
                  }}
                >
                  {taxonomyTree ? (
                    <TreeChart node={taxonomyTree} />
                  ) : (
                    <Typography sx={{ color: "#b7d7c4" }}>
                      Taxonomy is not available.
                    </Typography>
                  )}
                </Paper>
              </Stack>

              <Stack spacing={2}>
                <Typography
                  variant="h6"
                  sx={{ color: "#e6f5ec", fontWeight: "bold" }}
                >
                  Habitat Map
                </Typography>
                <SpeciesHabitatMap
                  habitatArea={species.habitatArea}
                  height={320}
                  commonName={species.commonName}
                  scientificName={species.scientificName}
                  populationStatus={species.populationStatus}
                />
              </Stack>

              <Stack spacing={2}>
                <Typography
                  variant="h6"
                  sx={{ color: "#e6f5ec", fontWeight: "bold" }}
                >
                  Related Species
                </Typography>
                {relatedLoading ? (
                  <Stack spacing={2}>
                    <Skeleton variant="rounded" height={180} sx={{ bgcolor: "rgba(109,220,139,0.12)" }} />
                    <Skeleton variant="rounded" height={180} sx={{ bgcolor: "rgba(109,220,139,0.12)" }} />
                  </Stack>
                ) : relatedError ? (
                  <Typography sx={{ color: "#f1b7b7" }}>{relatedError}</Typography>
                ) : relatedSpecies.length === 0 ? (
                  <Typography sx={{ color: "#b7d7c4" }}>
                    No related species found.
                  </Typography>
                ) : (
                  <Box
                    sx={{
                      columnCount: { xs: 1, sm: 2, md: 3 },
                      columnGap: 16,
                    }}
                  >
                    {relatedSpecies.map((item) => (
                      <Box
                        key={item._id}
                        sx={{
                          breakInside: "avoid",
                          mb: 2,
                          display: "inline-block",
                          width: "100%",
                        }}
                      >
                        <SpeciesCard
                          commonName={item.commonName}
                          scientificName={item.scientificName}
                          status={item.populationStatus || "Unknown"}
                          imageUrl={item.images?.[0]?.url ?? null}
                          onClick={() => navigate(`/admin/species/${item.slug}`)}
                        />
                      </Box>
                    ))}
                  </Box>
                )}
              </Stack>

            </Stack>
          </Paper>
        )}
      </Stack>
    </Container>
  );
};

export default GetSpecies;
