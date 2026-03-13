import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  TextField,
  MenuItem,
  Chip,
  Divider,
  Button,
} from "@mui/material";
import axios from "axios";
import Grid from "@mui/system/Grid";
import SpeciesCard from "../../components/SpeciesCard";
import PieChart from "../../components/PieChart";

interface SpeciesItem {
  _id: string;
  commonName: string;
  scientificName: string;
  populationStatus?: string;
  imageUrl?: string | null;
  images?: { url: string }[];
}

const Species = () => {
  const [species, setSpecies] = useState<SpeciesItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const statusOptions = [
    "all",
    "Least Concern",
    "Vulnerable",
    "Endangered",
    "Critically Endangered",
    "Extinct",
    "Unknown",
  ];

  const activeSearch = search.trim();
  const activeFilter = statusFilter !== "all";

  useEffect(() => {
    const fetchSpecies = async () => {
      setLoading(true);
      try {
        let url = "http://localhost:8080/api/species";
        const params: Record<string, string> = {};

        if (activeSearch) {
          url = "http://localhost:8080/api/species/search";
          params.q = activeSearch;
        } else if (activeFilter) {
          url = "http://localhost:8080/api/species/filter";
          params.populationStatus = statusFilter;
        }

        const res = await axios.get(url, { withCredentials: true, params });
        if (res.data.success) {
          setSpecies(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching species:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecies();
  }, [activeSearch, activeFilter, statusFilter]);

  const filteredSpecies = useMemo(() => {
    if (activeSearch && activeFilter) {
      return species.filter(
        (item) => (item.populationStatus || "Unknown") === statusFilter,
      );
    }
    return species;
  }, [species, activeSearch, activeFilter, statusFilter]);

  const speciesByStatus = filteredSpecies.reduce(
    (acc, item) => {
      const status = item.populationStatus || "Unknown";
      if (!acc[status]) acc[status] = 0;
      acc[status] += 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const speciesStatuses = Object.entries(speciesByStatus);
  const speciesTotal = filteredSpecies.length;

  const chartColors = ["#1f6b3a", "#2f9e5b", "#3bbf7a", "#7fc97f", "#c9b458"];
  const speciesItems = speciesStatuses.map(([status, count]) => ({
    label: status,
    value: count,
  }));

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <Paper
            elevation={6}
            sx={{
              p: 4,
              width: "100%",
              backdropFilter: "blur(10px)",
              backgroundColor: "rgba(8,18,12,0.72)",
              borderRadius: "16px",
              border: "1px solid rgba(109,220,139,0.18)",
            }}
          >
            <Typography
              variant="h4"
              gutterBottom
              sx={{ color: "#e6f5ec", fontWeight: "bold" }}
            >
              Species
            </Typography>

            <Stack spacing={3} mt={2}>
              <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <Box flex={1}>
                  <Typography
                    sx={{ color: "#b7d7c4", fontWeight: "bold", mb: 2 }}
                  >
                    Filters
                  </Typography>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField
                      label="Search common or scientific name"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      fullWidth
                      sx={{
                        input: { color: "#e6f5ec" },
                        label: { color: "#b7d7c4" },
                      }}
                    />
                    <TextField
                      select
                      label="Status"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      sx={{
                        minWidth: 180,
                        input: { color: "#e6f5ec" },
                        label: { color: "#b7d7c4" },
                      }}
                    >
                      {statusOptions.map((status) => (
                        <MenuItem key={status} value={status}>
                          {status === "all" ? "All" : status}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Stack>
                  <Stack direction="row" spacing={1} mt={2}>
                    <Chip
                      label={`${speciesTotal} shown`}
                      size="small"
                      color="success"
                      variant="outlined"
                      sx={{
                        color: "#b7d7c4",
                        borderColor: "rgba(109,220,139,0.45)",
                      }}
                    />
                  </Stack>
                </Box>
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{
                    borderColor: "rgba(109,220,139,0.18)",
                    display: { xs: "none", md: "block" },
                  }}
                />
                <Box flex={1}>
                  <Typography
                    sx={{ color: "#b7d7c4", fontWeight: "bold", mb: 2 }}
                  >
                    Species by Status
                  </Typography>
                  {loading ? (
                    <Typography sx={{ color: "#b7d7c4" }}>
                      Loading chart...
                    </Typography>
                  ) : speciesStatuses.length === 0 ? (
                    <Typography sx={{ color: "#b7d7c4" }}>
                      No species data.
                    </Typography>
                  ) : (
                    <PieChart items={speciesItems} colors={chartColors} />
                  )}
                </Box>
              </Stack>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Typography
            variant="h5"
            sx={{ color: "#e6f5ec", fontWeight: "bold", mb: 2 }}
          >
            Species List
          </Typography>

          {loading ? (
            <Typography sx={{ color: "#b7d7c4" }}>
              Loading species...
            </Typography>
          ) : filteredSpecies.length === 0 ? (
            <Typography sx={{ color: "#b7d7c4" }}>No species found.</Typography>
          ) : (
            <Box
              sx={{
                columnCount: { xs: 1, sm: 2, md: 3 },
                columnGap: 16,
              }}
            >
              {filteredSpecies.map((item) => (
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
                    imageUrl={item.imageUrl ?? item.images?.[0]?.url ?? null}
                    actions={
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ justifyContent: "center" }}
                      >
                        <Button
                          size="small"
                          variant="outlined"
                          sx={{
                            textTransform: "none",
                            borderColor: "rgba(109,220,139,0.45)",
                            color: "#b7d7c4",
                            "&:hover": { borderColor: "#8be0a6", color: "#e6f5ec" },
                          }}
                        >
                          View
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          sx={{
                            textTransform: "none",
                            backgroundColor: "#2f7d4b",
                            "&:hover": { backgroundColor: "#3b9960" },
                          }}
                        >
                          Edit
                        </Button>
                      </Stack>
                    }
                  />
                </Box>
              ))}
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Species;
